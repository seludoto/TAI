from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from ..database import get_db
from ..models import User
from .auth import get_current_user
from ..services.ai_service import ai_service

router = APIRouter()

# Pydantic models
class CodeGenerationRequest(BaseModel):
    description: str
    programming_language: str
    framework: Optional[str] = None

class DebugRequest(BaseModel):
    code: str
    error_message: str
    programming_language: str

class APIRequest(BaseModel):
    description: str
    api_type: str = "REST"  # REST, GraphQL, etc.
    programming_language: str

class CLIRequest(BaseModel):
    command_description: str
    tool: str  # git, docker, linux, etc.

class CodeResponse(BaseModel):
    generated_code: str
    explanation: str

class DebugResponse(BaseModel):
    analysis: str
    suggested_fix: str
    fixed_code: str

class APIResponse(BaseModel):
    api_specification: str
    example_code: str
    documentation: str

class CLIResponse(BaseModel):
    command: str
    explanation: str
    example_usage: str

# Routes
@router.post("/generate-code", response_model=CodeResponse)
async def generate_code(
    request: CodeGenerationRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate code based on description"""
    try:
        # Build prompt for code generation
        prompt = f"Generate {request.programming_language} code for: {request.description}"
        if request.framework:
            prompt += f" using {request.framework} framework"

        # Get AI response
        generated_code = await ai_service.generate_code_template(
            request.description,
            request.programming_language
        )

        # Generate explanation
        explanation_prompt = f"Explain this {request.programming_language} code:\n\n{generated_code}"
        explanation = await ai_service.generate_response(explanation_prompt, request.programming_language)

        return CodeResponse(
            generated_code=generated_code,
            explanation=explanation
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code generation failed: {str(e)}")

@router.post("/debug", response_model=DebugResponse)
async def debug_code(
    request: DebugRequest,
    current_user: User = Depends(get_current_user)
):
    """Debug code and provide fixes"""
    try:
        # Get AI analysis and fix
        analysis = await ai_service.debug_code(
            request.code,
            request.error_message,
            request.programming_language
        )

        # Generate fixed code suggestion
        fix_prompt = f"Based on this error analysis, provide the corrected {request.programming_language} code:\n\nOriginal code:\n{request.code}\n\nError: {request.error_message}\n\nAnalysis: {analysis}"
        fixed_code = await ai_service.generate_response(fix_prompt, request.programming_language)

        return DebugResponse(
            analysis=analysis,
            suggested_fix=f"Here's the corrected code with the fix applied:",
            fixed_code=fixed_code
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Debug analysis failed: {str(e)}")

@router.post("/api-helper", response_model=APIResponse)
async def generate_api(
    request: APIRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate API specifications and code"""
    try:
        # Generate API specification
        if request.api_type.upper() == "REST":
            spec_prompt = f"Create a REST API specification for: {request.description}. Include endpoints, HTTP methods, request/response formats."
        elif request.api_type.upper() == "GRAPHQL":
            spec_prompt = f"Create a GraphQL API schema and resolvers for: {request.description}"
        else:
            spec_prompt = f"Create an API specification for: {request.description} using {request.api_type}"

        api_spec = await ai_service.generate_response(spec_prompt, request.programming_language)

        # Generate example implementation
        code_prompt = f"Generate {request.programming_language} code to implement this API: {request.description}"
        example_code = await ai_service.generate_response(code_prompt, request.programming_language)

        # Generate documentation
        docs_prompt = f"Create API documentation for: {request.description}. Include usage examples and authentication if needed."
        documentation = await ai_service.generate_response(docs_prompt, request.programming_language)

        return APIResponse(
            api_specification=api_spec,
            example_code=example_code,
            documentation=documentation
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API generation failed: {str(e)}")

@router.post("/cli-help", response_model=CLIResponse)
async def get_cli_help(
    request: CLIRequest,
    current_user: User = Depends(get_current_user)
):
    """Get CLI command help and examples"""
    try:
        # Generate CLI command
        command_prompt = f"Provide the {request.tool} command for: {request.command_description}. Include the exact command and explain what it does."
        command = await ai_service.generate_response(command_prompt, "bash")

        # Generate explanation
        explanation_prompt = f"Explain this {request.tool} command in detail: {command}"
        explanation = await ai_service.generate_response(explanation_prompt, "bash")

        # Generate usage example
        example_prompt = f"Provide a practical example of using this {request.tool} command: {command}"
        example_usage = await ai_service.generate_response(example_prompt, "bash")

        return CLIResponse(
            command=command,
            explanation=explanation,
            example_usage=example_usage
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CLI help generation failed: {str(e)}")

@router.get("/tools")
async def get_available_tools():
    """Get list of available developer tools"""
    return {
        "code_generator": {
            "name": "Code Generator",
            "description": "Generate code templates and boilerplate",
            "languages": ["python", "javascript", "typescript", "java", "cpp", "php", "ruby", "go"]
        },
        "debug_assistant": {
            "name": "Debug Assistant",
            "description": "Analyze errors and provide fixes",
            "supports": ["error analysis", "code correction", "explanations"]
        },
        "api_helper": {
            "name": "API Helper",
            "description": "Generate API specifications and implementations",
            "types": ["REST", "GraphQL", "SOAP"]
        },
        "cli_help": {
            "name": "CLI Helper",
            "description": "Get command-line help and examples",
            "tools": ["git", "docker", "linux", "npm", "pip", "composer"]
        }
    }