from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from ..models import User, Chat, Message
from .auth import get_current_user
from ..services.ai_service import ai_service

router = APIRouter()

# Pydantic models for general chat (no auth required)
class GeneralChatRequest(BaseModel):
    message: str
    context: Optional[str] = "general"  # code_generation, debugging, api_help, cli_help, portfolio
    conversation_history: Optional[List[Dict[str, str]]] = []

class GeneralChatResponse(BaseModel):
    response: str
    context: str

class ChatCreate(BaseModel):
    title: Optional[str] = "New Chat"

class ChatResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    content: str
    programming_language: Optional[str] = None

class MessageResponse(BaseModel):
    id: int
    content: str
    role: str
    programming_language: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ChatWithMessages(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: Optional[datetime]
    messages: List[MessageResponse]

    class Config:
        from_attributes = True

# Routes

# General chat endpoint (no authentication required)
@router.post("/general", response_model=GeneralChatResponse)
async def general_chat(request: GeneralChatRequest):
    """
    General chat endpoint that handles context-aware conversations.
    Supports: code_generation, debugging, api_help, cli_help, portfolio, general
    """
    
    # Build system prompts based on context
    context_prompts = {
        "code_generation": "You are an expert code generator. Help users create clean, efficient, and well-documented code in any programming language. Provide complete, runnable examples with explanations.",
        "debugging": "You are a debugging expert. Help users identify and fix bugs in their code. Analyze error messages, suggest solutions, and explain the root causes of issues.",
        "api_help": "You are an API documentation expert. Help users understand APIs, generate API endpoints, create request examples, and build comprehensive API documentation.",
        "cli_help": "You are a command-line expert. Help users with terminal commands, shell scripts, and CLI tools. Provide clear examples and explanations.",
        "portfolio": "You are a career advisor and technical writer. Help users create professional resumes, portfolios, and showcase their technical skills effectively.",
        "general": "You are TAI, a friendly and knowledgeable AI developer assistant. Help users with any development-related questions, provide clear explanations, and guide them to the right solutions."
    }
    
    system_prompt = context_prompts.get(request.context, context_prompts["general"])
    
    # Build conversation with system prompt
    messages = [{"role": "system", "content": system_prompt}]
    
    # Add conversation history
    if request.conversation_history:
        messages.extend(request.conversation_history[-10:])  # Last 10 messages for context
    
    # Add current user message
    messages.append({"role": "user", "content": request.message})
    
    # Get AI response
    try:
        response = await ai_service.generate_response(
            user_message=request.message,
            conversation_history=messages,
            programming_language=None
        )
        
        return GeneralChatResponse(
            response=response,
            context=request.context
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.post("/", response_model=ChatResponse)
async def create_chat(
    chat: ChatCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_chat = Chat(
        title=chat.title,
        user_id=current_user.id
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

@router.get("/", response_model=List[ChatResponse])
async def get_user_chats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chats = db.query(Chat).filter(Chat.user_id == current_user.id).order_by(Chat.updated_at.desc()).all()
    return chats

@router.get("/{chat_id}", response_model=ChatWithMessages)
async def get_chat(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    return chat

@router.post("/{chat_id}/messages", response_model=MessageResponse)
async def send_message(
    chat_id: int,
    message: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify chat belongs to user
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    # Save user message
    user_message = Message(
        content=message.content,
        role="user",
        chat_id=chat_id,
        programming_language=message.programming_language
    )
    db.add(user_message)
    
    # Get conversation history for context
    conversation_history = []
    recent_messages = db.query(Message).filter(
        Message.chat_id == chat_id
    ).order_by(Message.created_at.desc()).limit(20).all()
    
    # Build conversation history (reverse to get chronological order)
    for msg in reversed(recent_messages):
        conversation_history.append({
            "role": msg.role,
            "content": msg.content
        })
    
    # Get AI response
    ai_response_content = await ai_service.generate_response(
        user_message=message.content,
        programming_language=message.programming_language,
        conversation_history=conversation_history
    )
    
    # Save AI response
    ai_message = Message(
        content=ai_response_content,
        role="assistant",
        chat_id=chat_id,
        programming_language=message.programming_language
    )
    db.add(ai_message)
    
    # Update chat timestamp
    chat.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(ai_message)
    return ai_message

@router.get("/{chat_id}/messages", response_model=List[MessageResponse])
async def get_chat_messages(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify chat belongs to user
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    messages = db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.created_at).all()
    return messages

@router.delete("/{chat_id}")
async def delete_chat(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    db.delete(chat)
    db.commit()
    return {"message": "Chat deleted successfully"}