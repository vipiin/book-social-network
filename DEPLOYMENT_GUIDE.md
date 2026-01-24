# GitHub Setup and Deployment Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `book-social-network` (or your preferred name)
3. **Visibility**: Private (recommended)
4. **DO NOT** check "Initialize this repository with a README"
5. Click **"Create repository"**

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
cd /Users/vipin/Desktop/bsncopy/book-social-network

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/book-social-network.git

# Push your code
git branch -M main
git push -u origin main
```

**Example**: If your GitHub username is `vipin123`, the command would be:
```bash
git remote add origin https://github.com/vipin123/book-social-network.git
```

## Step 3: Update koyeb.yaml

Once you know your repository URL, update the `koyeb.yaml` file:

1. Open `/Users/vipin/Desktop/bsncopy/book-social-network/koyeb.yaml`
2. Replace `github.com/your-username/your-repo` with your actual repository URL
   - Example: `github.com/vipin123/book-social-network`
3. Save the file
4. Commit and push the change:
   ```bash
   git add koyeb.yaml
   git commit -m "Update koyeb.yaml with actual repository URL"
   git push
   ```

## Step 4: Deploy to Koyeb

### A. Deploy Backend

1. Go to https://app.koyeb.com
2. Click **"Create App"**
3. Choose **"GitHub"** as the source
4. Select your `book-social-network` repository
5. Configure:
   - **Name**: `book-social-network-backend`
   - **Build**: Dockerfile
   - **Dockerfile path**: `book-network/Dockerfile`
   - **Port**: 8088

6. **Add Environment Variables** (Secrets):
   - `SPRING_PROFILES_ACTIVE` = `prod`
   - `JDBC_DATABASE_URL` = (your Supabase connection string)
   - `DB_USERNAME` = `postgres`
   - `DB_PASSWORD` = (your Supabase password)
   - `SPRING_MAIL_HOST` = `smtp-relay.brevo.com`
   - `SPRING_MAIL_PORT` = `587`
   - `SPRING_MAIL_USERNAME` = `a0b565001@smtp-brevo.com`
   - `SPRING_MAIL_PASSWORD` = (your Brevo API key)
   - `JWT_SECRET` = `KZJMKYTRrF+U9LKuki88yjPGtfs9v+Ldy3/9tcgSJ/I=`
   - `CLOUDINARY_CLOUD_NAME` = `dqakmq4sg`
   - `CLOUDINARY_API_KEY` = `261654455347899`
   - `CLOUDINARY_API_SECRET` = (your Cloudinary secret)
   - `FRONTEND_URL` = `https://your-frontend-url.koyeb.app/activate-account` (update later)

7. Click **"Deploy"**

### B. Deploy Frontend

1. Create another app in Koyeb
2. Choose your repository again
3. Configure:
   - **Name**: `book-social-network-frontend`
   - **Build**: Dockerfile
   - **Dockerfile path**: `book-network-ui/Dockerfile`
   - **Port**: 80

4. **Before deploying**, update `environment.prod.ts`:
   - Replace the `apiUrl` with your backend URL from Koyeb
   - Example: `https://book-social-network-backend-vipin.koyeb.app/api/v1`

5. Commit and push:
   ```bash
   git add book-network-ui/src/environments/environment.prod.ts
   git commit -m "Update frontend API URL for production"
   git push
   ```

6. Click **"Deploy"**

### C. Update Backend with Frontend URL

Once frontend is deployed:
1. Go to backend app settings in Koyeb
2. Update `FRONTEND_URL` environment variable with your frontend URL
3. Redeploy the backend

## Done! 🎉

Your application should now be live on Koyeb!

- **Frontend**: `https://your-frontend-app.koyeb.app`
- **Backend**: `https://your-backend-app.koyeb.app`

## Troubleshooting

If something doesn't work:
1. Check Koyeb logs for errors
2. Verify all environment variables are set correctly
3. Ensure Supabase, Brevo, and Cloudinary credentials are correct
