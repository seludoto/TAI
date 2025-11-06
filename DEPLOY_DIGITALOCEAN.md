# Deploy TAI Platform to DigitalOcean

## Option 1: Using DigitalOcean Web Console (Recommended)

1. **Create Account & Login**
   - Go to https://cloud.digitalocean.com
   - Create account or login

2. **Create New App**
   - Click "Create" → "Apps"
   - Choose "GitHub" as source
   - Select your TAI repository
   - Select `master` branch

3. **Configure Build Settings**
   - Dockerfile Path: `Dockerfile`
   - HTTP Port: `8000`
   - Run Command: `gunicorn main:app --bind 0.0.0.0:$PORT --worker-class uvicorn.workers.UvicornWorker --workers 2`

4. **Add Environment Variables**
   ```
   DATABASE_URL=<will be auto-set by managed database>
   SECRET_KEY=<generate-secure-random-key>
   AI_PROVIDER=digitalocean
   DIGITALOCEAN_API_KEY=sk-do-rm5p4ChxhK80oTytq2zMfbmymFQ98lASYcekdFR35NJqei31QcFTjfbA6t
   ALLOWED_ORIGINS=*
   DEBUG=false
   ```

5. **Add Managed Database**
   - Click "Add Resource" → "Database"
   - Select PostgreSQL 15
   - Choose Basic plan ($15/month)
   - It will auto-configure DATABASE_URL

6. **Deploy**
   - Click "Create Resources"
   - Wait 5-10 minutes for deployment
   - Your API will be available at: `https://your-app-name.ondigitalocean.app`

## Option 2: Using DigitalOcean CLI (doctl)

1. **Install doctl CLI**
   ```bash
   # Windows (using Chocolatey)
   choco install doctl

   # Or download from: https://github.com/digitalocean/doctl/releases
   ```

2. **Authenticate**
   ```bash
   doctl auth init
   # Paste your API token when prompted
   ```

3. **Create App from Spec**
   ```bash
   cd D:\projects\TAI
   doctl apps create --spec .do/app.yaml
   ```

4. **Monitor Deployment**
   ```bash
   # List your apps
   doctl apps list

   # Get app details
   doctl apps get <app-id>

   # View logs
   doctl apps logs <app-id> --type run
   ```

## Option 3: Using Docker + DigitalOcean Container Registry

1. **Build and Push Docker Image**
   ```bash
   # Login to DigitalOcean Registry
   doctl registry login

   # Build image
   docker build -t registry.digitalocean.com/your-registry/tai-api:latest .

   # Push image
   docker push registry.digitalocean.com/your-registry/tai-api:latest
   ```

2. **Deploy to App Platform**
   - In App Platform console, choose "Docker Hub or Container Registry"
   - Select your pushed image
   - Configure as above

## Post-Deployment

1. **Verify Deployment**
   ```bash
   curl https://your-app-name.ondigitalocean.app/
   ```

2. **Update Frontend**
   - Update frontend API URL in `frontend/.env.production`
   - Redeploy frontend to Vercel

3. **Monitor & Scale**
   - DigitalOcean dashboard shows metrics
   - Auto-scaling configured in app.yaml
   - Set up alerts for errors/downtime

## Costs (Estimated)

- **Basic App (512MB RAM)**: $5/month
- **PostgreSQL Database**: $15/month  
- **Total**: ~$20/month

## Troubleshooting

- **App crashes**: Check logs with `doctl apps logs <app-id>`
- **Database connection issues**: Verify DATABASE_URL environment variable
- **Port issues**: Ensure app listens on port specified by $PORT
- **Build failures**: Check Dockerfile and requirements.txt

## Benefits vs Heroku

✅ More reliable deployments  
✅ Better performance  
✅ Integrated with DigitalOcean GenAI (same provider)  
✅ More affordable  
✅ Better PostgreSQL integration  
✅ Auto-scaling out of the box
