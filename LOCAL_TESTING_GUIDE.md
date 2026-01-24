# Local Testing with Cloud Services Guide

## Step 1: Set Up Cloud Services

### Supabase (Database)
1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the connection details:
   - Host, Port, Database name, User, Password
5. Format as JDBC URL: `jdbc:postgresql://[host]:[port]/postgres`

### Brevo (Email)
1. Sign up at https://brevo.com (free tier available)
2. Go to **SMTP & API** → **SMTP**
3. Note down:
   - Host: `smtp-relay.brevo.com`
   - Port: `587`
   - Login: Your Brevo account email
   - Password: Generate an SMTP key

### Cloudinary (File Storage)
1. Create account at https://cloudinary.com (free tier available)
2. Go to **Dashboard**
3. Copy:
   - Cloud name
   - API Key
   - API Secret

## Step 2: Configure Local Environment

I've created a `.env` file at:
`/Users/vipin/Desktop/bsncopy/book-social-network/book-network/.env`

**Fill in your actual credentials** (replace the placeholder values).

## Step 3: Run with Production Profile Locally

To test with cloud services locally, run the backend with the `prod` profile:

```bash
cd /Users/vipin/Desktop/bsncopy/book-social-network/book-network

# Load environment variables and run
export $(cat .env | xargs) && ./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```

Or use your IDE:
- **IntelliJ IDEA**: 
  1. Edit Run Configuration
  2. Add VM options: `-Dspring.profiles.active=prod`
  3. Add Environment variables from `.env` file

- **VS Code**:
  1. Create `.vscode/launch.json`
  2. Add environment variables

## Step 4: Test the Application

1. **Start Backend** (with prod profile as shown above)
2. **Start Frontend**:
   ```bash
   cd /Users/vipin/Desktop/bsncopy/book-social-network/book-network-ui
   npm start
   ```

3. **Test Key Features**:
   - ✅ User Registration (tests Brevo email)
   - ✅ Email Activation (tests Brevo)
   - ✅ Upload Book Cover (tests Cloudinary)
   - ✅ Database operations (tests Supabase)

## Important Notes

- The `.env` file is **git-ignored** so your credentials won't be committed
- You're using the **same cloud services** that production will use
- This is the **safest way** to test before deploying

## Alternative: Test in Dev Mode First

If you want to test the basic functionality first without cloud services:

```bash
# Backend (uses local PostgreSQL and MailDev)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Frontend
npm start
```

This uses local storage instead of Cloudinary.

## When Ready for Production

Once local testing with cloud services works perfectly:
1. Push your code to GitHub
2. Set up the same credentials as **Koyeb secrets**
3. Deploy!
