# TAI Deployment Guide for dolese.tech

## 🌐 Production Deployment

### Domain Setup

- **Frontend**: `https://dolese.tech` or `https://www.dolese.tech`
- **Backend API**: `https://api.dolese.tech`

### Prerequisites

1. DigitalOcean account with:
   - Droplet or App Platform access
   - Domain `dolese.tech` configured
   - DigitalOcean GenAI API key (already configured)

## 🚀 Deployment Options

### Option 1: DigitalOcean App Platform (Recommended)

#### Backend Deployment

1. **Create App from GitHub**:
   ```bash
   # Push your code to GitHub first
   git remote add origin https://github.com/yourusername/TAI.git
   git push -u origin main
   ```

2. **Configure Backend App**:
   - Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
   - Click **Create App**
   - Connect your GitHub repository
   - Select `backend` folder as source directory
   - Set build command: `pip install -r requirements.txt`
   - Set run command: `uvicorn main:app --host 0.0.0.0 --port 8080`

3. **Environment Variables**:
   ```env
   AI_PROVIDER=digitalocean
   DIGITALOCEAN_API_KEY=sk-do-rm5p4ChxhK80oTytq2zMfbmymFQ98lASYcekdFR35NJqei31QcFTjfbA6t
   DIGITALOCEAN_MODEL=meta-llama/llama-3.1-8b-instruct
   SECRET_KEY=your-production-secret-key-change-this
   DATABASE_URL=sqlite:///./tai.db
   DEBUG=False
   ```

4. **Set Custom Domain**:
   - In App settings → Domains
   - Add `api.dolese.tech`
   - Update DNS records as shown

#### Frontend Deployment

1. **Configure Frontend App**:
   - Create another App in DigitalOcean
   - Connect same GitHub repository
   - Select `frontend` folder as source directory
   - Set build command: `npm install && npm run build`
   - Set run command: `npm start`

2. **Environment Variables**:
   ```env
   NEXT_PUBLIC_API_URL=https://api.dolese.tech
   ```

3. **Set Custom Domain**:
   - In App settings → Domains
   - Add `dolese.tech` and `www.dolese.tech`
   - Update DNS records

### Option 2: DigitalOcean Droplet (Manual)

#### 1. Create Droplet

- Size: Basic - $12/month (2GB RAM, 1 vCPU)
- Image: Ubuntu 22.04 LTS
- Region: Choose closest to your users

#### 2. Server Setup

```bash
# SSH into your droplet
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Python
apt install python3 python3-pip python3-venv -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install nodejs -y

# Install Nginx
apt install nginx -y

# Install Certbot for SSL
apt install certbot python3-certbot-nginx -y
```

#### 3. Deploy Backend

```bash
# Create app directory
mkdir -p /var/www/tai
cd /var/www/tai

# Clone repository
git clone https://github.com/yourusername/TAI.git .

# Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create systemd service
cat > /etc/systemd/system/tai-backend.service << EOF
[Unit]
Description=TAI Backend API
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/tai/backend
Environment="PATH=/var/www/tai/backend/venv/bin"
ExecStart=/var/www/tai/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Start service
systemctl enable tai-backend
systemctl start tai-backend
```

#### 4. Deploy Frontend

```bash
cd /var/www/tai/frontend

# Update .env.local for production
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=https://api.dolese.tech
EOF

# Build frontend
npm install
npm run build

# Create systemd service
cat > /etc/systemd/system/tai-frontend.service << EOF
[Unit]
Description=TAI Frontend
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/tai/frontend
ExecStart=/usr/bin/npm start
Restart=always
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Start service
systemctl enable tai-frontend
systemctl start tai-frontend
```

#### 5. Configure Nginx

```bash
# Backend API configuration
cat > /etc/nginx/sites-available/api.dolese.tech << EOF
server {
    listen 80;
    server_name api.dolese.tech;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Frontend configuration
cat > /etc/nginx/sites-available/dolese.tech << EOF
server {
    listen 80;
    server_name dolese.tech www.dolese.tech;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable sites
ln -s /etc/nginx/sites-available/api.dolese.tech /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/dolese.tech /etc/nginx/sites-enabled/

# Test and reload Nginx
nginx -t
systemctl reload nginx
```

#### 6. Setup SSL with Let's Encrypt

```bash
# Get SSL certificates
certbot --nginx -d dolese.tech -d www.dolese.tech
certbot --nginx -d api.dolese.tech

# Auto-renewal is configured automatically
```

### DNS Configuration

Configure these DNS records in your domain provider:

```
Type    Name    Value                   TTL
A       @       your-droplet-ip         3600
A       www     your-droplet-ip         3600
A       api     your-droplet-ip         3600
```

Or for App Platform:

```
Type    Name    Value                   TTL
CNAME   @       your-app.ondigitalocean.app     3600
CNAME   www     your-app.ondigitalocean.app     3600
CNAME   api     your-backend.ondigitalocean.app 3600
```

## 🔒 Security Checklist

- [ ] Change `SECRET_KEY` in production `.env`
- [ ] Set `DEBUG=False` in production
- [ ] Enable SSL/HTTPS (Let's Encrypt or DigitalOcean managed)
- [ ] Set up firewall (UFW or DigitalOcean Firewall)
- [ ] Secure DigitalOcean API key (never commit to Git)
- [ ] Enable rate limiting on API endpoints
- [ ] Set up database backups
- [ ] Configure monitoring and alerts

## 📊 Monitoring

### DigitalOcean App Platform
- Built-in monitoring in dashboard
- View logs in real-time
- Set up alerts for errors

### Manual Droplet
```bash
# Check backend status
systemctl status tai-backend

# Check frontend status
systemctl status tai-frontend

# View backend logs
journalctl -u tai-backend -f

# View frontend logs
journalctl -u tai-frontend -f

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 🔄 Updates and Maintenance

### DigitalOcean App Platform
- Automatic deployments on Git push (configure in App settings)
- Or manually trigger deployment from dashboard

### Manual Droplet
```bash
# Update application
cd /var/www/tai
git pull origin main

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
systemctl restart tai-backend

# Update frontend
cd ../frontend
npm install
npm run build
systemctl restart tai-frontend
```

## 💰 Estimated Costs

### DigitalOcean App Platform
- Backend: $5-12/month
- Frontend: $5-12/month
- GenAI API: $0.01-$0.10/day
- **Total**: ~$15-30/month

### DigitalOcean Droplet
- Droplet: $12/month (2GB RAM)
- GenAI API: $0.01-$0.10/day
- **Total**: ~$15/month

## 🆘 Troubleshooting

### "502 Bad Gateway"
- Check if services are running: `systemctl status tai-backend tai-frontend`
- Check logs: `journalctl -u tai-backend -n 50`

### "CORS Error"
- Verify `ALLOWED_ORIGINS` in `backend/app/config.py` includes your domain
- Check browser console for exact error

### "AI Not Responding"
- Verify DigitalOcean API key is set correctly
- Check backend logs for API errors
- Test API key: `curl -H "Authorization: Bearer YOUR_KEY" https://api.digitalocean.com/v2/genai/chat/completions`

### SSL Certificate Issues
- Run: `certbot renew --dry-run`
- Check Nginx configuration: `nginx -t`

## 📚 Additional Resources

- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [DigitalOcean Droplet Docs](https://docs.digitalocean.com/products/droplets/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
