# Security Guidelines for Friendit

## 🔒 Environment Variables Security

### ✅ What's Protected
- `.env` files are **NEVER** committed to git
- Database passwords are kept secure
- API keys and secrets are protected
- All sensitive configuration is excluded

### 🛡️ Files Protected by .gitignore
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
backend/.env
frontend/.env
```

### 📋 Environment Setup

#### Backend (.env)
```bash
# Copy the example file
cp backend/env.example backend/.env

# Edit with your actual values
# NEVER commit the .env file!
```

#### Frontend (.env)
```bash
# Copy the example file  
cp frontend/env.example frontend/.env

# Edit with your actual values
# NEVER commit the .env file!
```

### 🔐 Required Environment Variables

#### Backend
- `SECRET_KEY` - Django secret key (generate a strong one)
- `DB_PASSWORD` - Your PostgreSQL password
- `GOOGLE_OAUTH2_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_OAUTH2_CLIENT_SECRET` - Google OAuth client secret

#### Frontend
- `REACT_APP_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `REACT_APP_API_BASE_URL` - Backend API URL

### ⚠️ Security Best Practices

1. **Never commit `.env` files**
2. **Use strong, unique passwords**
3. **Rotate secrets regularly**
4. **Use different credentials for different environments**
5. **Keep production secrets separate from development**

### 🚨 If You Accidentally Commit Secrets

1. **Immediately rotate the exposed secrets**
2. **Remove from git history** (if possible)
3. **Update all environments with new secrets**
4. **Review access logs for unauthorized usage**

### 📝 Development Setup

1. Copy `env.example` to `.env`
2. Fill in your actual values
3. Never commit the `.env` file
4. Share only the `env.example` file with team members

## 🔍 Verification

To verify your setup is secure:

```bash
# Check if .env files are ignored
git check-ignore backend/.env
git check-ignore frontend/.env

# Should return the file paths if properly ignored
```

## 📞 Support

If you have security concerns or questions, please review this document and ensure all environment variables are properly configured.
