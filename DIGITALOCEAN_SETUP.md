# DigitalOcean GenAI Setup Guide

## 🚀 Quick Setup

### 1. Get Your DigitalOcean API Key

1. Go to [DigitalOcean API Tokens](https://cloud.digitalocean.com/account/api/tokens)
2. Click **Generate New Token**
3. Name it: `TAI-GenAI`
4. Enable **Read** and **Write** scopes
5. Copy the generated token (you won't see it again!)

### 2. Configure TAI Backend

Edit `backend/.env` file:

```env
# Set AI provider to DigitalOcean
AI_PROVIDER=digitalocean

# Add your DigitalOcean API key
DIGITALOCEAN_API_KEY=dop_v1_your_actual_api_key_here

# Choose your model (optional, default is llama-3.1-8b-instruct)
DIGITALOCEAN_MODEL=meta-llama/llama-3.1-8b-instruct
```

### 3. Available Models

DigitalOcean GenAI supports these models:

- `meta-llama/llama-3.1-8b-instruct` (Default, fastest)
- `meta-llama/llama-3.1-70b-instruct` (More powerful, slower)
- `meta-llama/llama-3.1-405b-instruct` (Most powerful, slowest)

### 4. Restart Backend

```bash
cd backend
# Stop the current backend (Ctrl+C)
python -m uvicorn main:app --reload
```

## 💰 Pricing

DigitalOcean GenAI pricing (as of 2025):

- **Llama 3.1 8B**: ~$0.10 per 1M tokens
- **Llama 3.1 70B**: ~$0.80 per 1M tokens
- **Llama 3.1 405B**: ~$3.00 per 1M tokens

Typical usage for TAI: 
- Single code generation: ~500-1000 tokens
- Chat response: ~200-500 tokens
- **Estimated cost**: $0.01-$0.10 per day for moderate use

## 🔄 Switching Between Providers

You can easily switch between Ollama (local) and DigitalOcean (cloud):

### Use Ollama (Local, Free but Slow)
```env
AI_PROVIDER=ollama
```

### Use DigitalOcean (Cloud, Fast but Paid)
```env
AI_PROVIDER=digitalocean
```

## 🧪 Testing the Integration

Test if DigitalOcean GenAI is working:

```bash
# Test the backend API
curl -X POST http://localhost:8000/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "Write a Python function to reverse a string",
    "programming_language": "python"
  }'
```

## 📊 Benefits of DigitalOcean GenAI

### vs. Local Ollama:
- ✅ **Much faster** responses (seconds vs minutes)
- ✅ **No RAM limitations** (runs in cloud)
- ✅ **Better quality** responses (larger models available)
- ✅ **No local setup** required
- ❌ **Costs money** (but very affordable)
- ❌ **Requires internet** connection

### When to Use Each:

**Use DigitalOcean** when:
- You need fast, reliable AI responses
- Your local machine has limited resources
- You're okay with small API costs
- You have stable internet connection

**Use Ollama** when:
- You want completely free AI
- Privacy is critical (all data stays local)
- You have powerful hardware (16GB+ RAM)
- You're okay with slower responses

## 🔒 Security Best Practices

1. **Never commit API keys** to Git
2. Add `.env` to `.gitignore` (already done)
3. Rotate API keys regularly
4. Use separate keys for dev/production
5. Monitor usage in DigitalOcean dashboard

## 🆘 Troubleshooting

### "Invalid API key" error
- Verify your API key is correct in `.env`
- Make sure there are no extra spaces
- Check if the token is still active in DigitalOcean

### "Model not found" error
- Verify the model name is correct
- Try the default model: `meta-llama/llama-3.1-8b-instruct`

### Backend not using DigitalOcean
- Restart the backend server after changing `.env`
- Check `AI_PROVIDER=digitalocean` in `.env`
- Look at backend logs for error messages

## 📚 Additional Resources

- [DigitalOcean GenAI Docs](https://docs.digitalocean.com/products/genai/)
- [API Reference](https://docs.digitalocean.com/reference/api/genai/)
- [Pricing Calculator](https://www.digitalocean.com/pricing/genai)
