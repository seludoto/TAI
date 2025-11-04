# TAI Platform - Heroku Deployment Guide

## 🚀 Quick Deployment Steps

### Prerequisites
1. ✅ Heroku CLI installed
2. ✅ Git initialized in project
3. Heroku account created

### Deploy Backend (API)

```bash
# Navigate to backend directory
cd backend

# Login to Heroku
heroku login

# Create Heroku app for backend
heroku create tai-platform-api

# Set environment variables
heroku config:set AI_PROVIDER=digitalocean
heroku config:set DIGITALOCEAN_API_KEY=sk-do-rm5p4ChxhK80oTytq2zMfbmymFQ98lASYcekdFR35NJqei31QcFTjfbA6t
heroku config:set DIGITALOCEAN_MODEL=meta-llama/llama-3.1-8b-instruct
heroku config:set DATABASE_URL=sqlite:///./tai.db
heroku config:set SECRET_KEY=your-secret-key-here-generate-new-one

# Deploy backend
git init
git add .
git commit -m "Initial backend deployment"
heroku git:remote -a tai-platform-api
git push heroku main

# Check logs
heroku logs --tail
```

### Deploy Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Create Heroku app for frontend
heroku create tai-platform-frontend

# Set environment variable for API URL
heroku config:set NEXT_PUBLIC_API_URL=https://tai-platform-api.herokuapp.com

# Deploy frontend
git init
git add .
git commit -m "Initial frontend deployment"
heroku git:remote -a tai-platform-frontend
git push heroku main

# Open app
heroku open
```

## 🔧 Configuration

### Backend Environment Variables
- `AI_PROVIDER`: digitalocean
- `DIGITALOCEAN_API_KEY`: Your DigitalOcean API key
- `DIGITALOCEAN_MODEL`: meta-llama/llama-3.1-8b-instruct
- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: JWT secret key (generate secure one)
- `ALLOWED_ORIGINS`: Frontend URL for CORS

### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL

## 📝 Post-Deployment

### Update CORS in Backend
After deploying frontend, update backend CORS configuration:

```bash
heroku config:set ALLOWED_ORIGINS=https://tai-platform-frontend.herokuapp.com,https://dolese.tech
```

### Custom Domain Setup
1. Add custom domain to Heroku app
2. Update DNS records at domain registrar
3. Update CORS settings

```bash
# Add domain to frontend
heroku domains:add dolese.tech -a tai-platform-frontend
heroku domains:add www.dolese.tech -a tai-platform-frontend

# Add domain to backend
heroku domains:add api.dolese.tech -a tai-platform-api
```

## 🔄 Continuous Deployment

### Option 1: Direct Git Push
```bash
git push heroku main
```

### Option 2: GitHub Integration
1. Go to Heroku Dashboard
2. Connect GitHub repository
3. Enable automatic deployments
4. Select branch (main/master)

## 📊 Monitoring

```bash
# View logs
heroku logs --tail -a tai-platform-api
heroku logs --tail -a tai-platform-frontend

# Check app status
heroku ps -a tai-platform-api
heroku ps -a tai-platform-frontend

# Open apps
heroku open -a tai-platform-frontend
```

## 💰 Cost Estimation

### Free Tier (Eco Dynos)
- Backend: $0/month (550 free hours)
- Frontend: $0/month (550 free hours)
- **Total: FREE** (with limitations)

### Paid Tier (Basic Dynos)
- Backend: $7/month
- Frontend: $7/month
- **Total: $14/month**

### Recommended (Hobby/Standard)
- Backend: $25-50/month
- Frontend: $25-50/month
- Postgres DB: $9/month
- **Total: $59-109/month**

## 🛠️ Troubleshooting

### Build Failures
```bash
# Check build logs
heroku logs --tail -a [app-name]

# Restart app
heroku restart -a [app-name]

# Check config vars
heroku config -a [app-name]
```

### Database Issues
```bash
# Use PostgreSQL for production
heroku addons:create heroku-postgresql:mini -a tai-platform-api

# Get database URL
heroku config:get DATABASE_URL -a tai-platform-api
```

### CORS Issues
- Ensure frontend URL is in backend ALLOWED_ORIGINS
- Check environment variables are set correctly
- Verify API URL in frontend matches backend URL

## 🎯 Production Best Practices

1. **Security**
   - Generate new SECRET_KEY for production
   - Use PostgreSQL instead of SQLite
   - Enable SSL/HTTPS
   - Rotate API keys regularly

2. **Performance**
   - Use CDN for static assets
   - Enable caching
   - Monitor response times
   - Scale dynos as needed

3. **Reliability**
   - Set up monitoring/alerts
   - Configure health checks
   - Implement error tracking (Sentry)
   - Regular backups

4. **Cost Optimization**
   - Start with Eco/Basic dynos
   - Monitor usage
   - Scale up only when needed
   - Use add-ons wisely

## 📞 Support

- Heroku Status: https://status.heroku.com
- Heroku Docs: https://devcenter.heroku.com
- TAI Platform: https://dolese.tech

## 🎉 Next Steps

1. Test deployed applications
2. Set up custom domains
3. Configure monitoring
4. Add error tracking
5. Implement CI/CD
6. Scale as needed
