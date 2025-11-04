// Code templates for the Code Generator tool

export const CODE_TEMPLATES = {
  python: {
    "FastAPI REST API": {
      description: "A complete FastAPI REST API with CRUD operations",
      code: `from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="My API", version="1.0.0")

# Pydantic models
class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    
    class Config:
        orm_mode = True

# In-memory storage (replace with database)
items_db = {}
next_id = 1

@app.get("/")
async def root():
    return {"message": "Welcome to My API"}

@app.get("/items", response_model=List[Item])
async def get_items():
    return list(items_db.values())

@app.get("/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return items_db[item_id]

@app.post("/items", response_model=Item)
async def create_item(item: ItemCreate):
    global next_id
    item_dict = item.dict()
    item_dict["id"] = next_id
    items_db[next_id] = Item(**item_dict)
    next_id += 1
    return items_db[next_id - 1]

@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item: ItemCreate):
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item_dict = item.dict()
    item_dict["id"] = item_id
    items_db[item_id] = Item(**item_dict)
    return items_db[item_id]

@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    if item_id not in items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    
    del items_db[item_id]
    return {"message": "Item deleted successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)`
    },
    
    "Data Analysis with Pandas": {
      description: "Data analysis template with pandas and visualization",
      code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Load data
def load_data(file_path):
    """Load data from CSV file"""
    try:
        df = pd.read_csv(file_path)
        print(f"Data loaded successfully. Shape: {df.shape}")
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

# Data exploration
def explore_data(df):
    """Perform basic data exploration"""
    print("\\n=== DATA EXPLORATION ===")
    print(f"Dataset shape: {df.shape}")
    print(f"\\nColumn types:\\n{df.dtypes}")
    print(f"\\nMissing values:\\n{df.isnull().sum()}")
    print(f"\\nBasic statistics:\\n{df.describe()}")
    
    return df.info()

# Data cleaning
def clean_data(df):
    """Clean and preprocess data"""
    # Handle missing values
    df_cleaned = df.copy()
    
    # Remove duplicates
    df_cleaned = df_cleaned.drop_duplicates()
    
    # Handle missing values (example strategies)
    numeric_columns = df_cleaned.select_dtypes(include=[np.number]).columns
    df_cleaned[numeric_columns] = df_cleaned[numeric_columns].fillna(df_cleaned[numeric_columns].mean())
    
    categorical_columns = df_cleaned.select_dtypes(include=['object']).columns
    df_cleaned[categorical_columns] = df_cleaned[categorical_columns].fillna(df_cleaned[categorical_columns].mode().iloc[0])
    
    return df_cleaned

# Visualization
def create_visualizations(df):
    """Create basic visualizations"""
    plt.figure(figsize=(15, 10))
    
    # Correlation heatmap for numeric columns
    numeric_df = df.select_dtypes(include=[np.number])
    if len(numeric_df.columns) > 1:
        plt.subplot(2, 2, 1)
        sns.heatmap(numeric_df.corr(), annot=True, cmap='coolwarm')
        plt.title('Correlation Heatmap')
    
    # Distribution plots
    if len(numeric_df.columns) > 0:
        plt.subplot(2, 2, 2)
        numeric_df.hist(bins=20, alpha=0.7)
        plt.title('Feature Distributions')
    
    plt.tight_layout()
    plt.show()

# Main analysis pipeline
def main():
    """Main analysis pipeline"""
    # Load your data
    file_path = "your_data.csv"  # Replace with your file path
    df = load_data(file_path)
    
    if df is not None:
        # Explore data
        explore_data(df)
        
        # Clean data
        df_cleaned = clean_data(df)
        
        # Create visualizations
        create_visualizations(df_cleaned)
        
        # Your custom analysis here
        print("\\n=== CUSTOM ANALYSIS ===")
        # Add your specific analysis code here
        
        return df_cleaned
    
    return None

if __name__ == "__main__":
    main()`
    },
    
    "Django Model & View": {
      description: "Django model with corresponding views and serializers",
      code: `# models.py
from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

# serializers.py (Django REST Framework)
from rest_framework import serializers
from .models import Post, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'author_name', 
                 'category', 'category_name', 'created_at', 'updated_at', 'is_published']

# views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Post, Category
from .serializers import PostSerializer, CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=False, methods=['get'])
    def published(self, request):
        published_posts = Post.objects.filter(is_published=True)
        serializer = self.get_serializer(published_posts, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        post = self.get_object()
        post.is_published = True
        post.save()
        return Response({'status': 'published'})

# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'posts', views.PostViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]`
    }
  },
  
  javascript: {
    "React Component with Hooks": {
      description: "A modern React component using hooks with state management",
      code: `import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const UserManager = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    try {
      const response = await axios.post('/api/users', formData);
      setUsers(prev => [...prev, response.data]);
      setFormData({ name: '', email: '', phone: '' });
      setError(null);
    } catch (err) {
      setError('Failed to create user');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await axios.delete(\`/api/users/\${userId}\`);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  // Select user for editing
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || ''
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* User Form */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {selectedUser ? 'Edit User' : 'Add New User'}
        </h2>
        
        <form onSubmit={handleCreateUser}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {selectedUser ? 'Update User' : 'Add User'}
            </button>
            
            {selectedUser && (
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setFormData({ name: '', email: '', phone: '' });
                }}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white shadow-md rounded">
        <div className="px-8 py-4 border-b">
          <h2 className="text-xl font-semibold">Users List ({users.length})</h2>
        </div>
        
        <div className="p-8">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center">No users found</p>
          ) : (
            <div className="grid gap-4">
              {users.map(user => (
                <div key={user.id} className="border rounded p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    {user.phone && <p className="text-gray-500">{user.phone}</p>}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectUser(user)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManager;`
    },
    
    "Express.js REST API": {
      description: "A complete Express.js REST API with middleware and error handling",
      code: `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// In-memory storage (replace with database)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date() }
];
let nextId = 3;

// Validation middleware
const validateUser = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Must be a valid email address'),
  body('age').optional().isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150')
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Logger middleware
const logger = (req, res, next) => {
  console.log(\`\${new Date().toISOString()} - \${req.method} \${req.path}\`);
  next();
};

app.use(logger);

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let filteredUsers = users;

    // Search functionality
    if (search) {
      filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredUsers.length,
        pages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create new user
app.post('/api/users', validateUser, handleValidationErrors, (req, res) => {
  try {
    const { name, email, age } = req.body;

    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const newUser = {
      id: nextId++,
      name,
      email,
      age: age || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update user
app.put('/api/users/:id', validateUser, handleValidationErrors, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, age } = req.body;

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email already exists (excluding current user)
    const existingUser = users.find(u => u.email === email && u.id !== id);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    users[userIndex] = {
      ...users[userIndex],
      name,
      email,
      age: age || null,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      message: 'User updated successfully',
      data: users[userIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const deletedUser = users.splice(userIndex, 1)[0];

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
  console.log(\`📋 API Documentation: http://localhost:\${PORT}/api/users\`);
});

module.exports = app;`
    }
  }
};

export const getTemplatesByLanguage = (language: string) => {
  return CODE_TEMPLATES[language as keyof typeof CODE_TEMPLATES] || {};
};

export const getAllLanguages = () => {
  return Object.keys(CODE_TEMPLATES);
};