# PostgreSQL Setup Guide for Meetup Clone

## 🐘 Installing PostgreSQL

### Step 1: Download PostgreSQL
1. Go to https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Download the latest version (15.x or 16.x recommended)

### Step 2: Install PostgreSQL
1. **Run the installer** as Administrator
2. **Choose components**: Keep all default selections
3. **Choose installation directory**: Default is fine
4. **Choose data directory**: Default is fine
5. **Set password**: Choose a strong password for the `postgres` user (remember this!)
6. **Choose port**: Default 5432 is fine
7. **Choose locale**: Default is fine
8. **Complete installation**

### Step 3: Verify Installation
Open Command Prompt or PowerShell and run:
```bash
psql --version
```

If successful, you should see the PostgreSQL version.

## 🗄️ Database Setup

### Option 1: Using the Batch Script (Recommended)
```bash
cd backend
setup_databases.bat
```

### Option 2: Manual Setup
1. **Open pgAdmin** (installed with PostgreSQL) or use command line
2. **Connect to PostgreSQL** using the password you set during installation
3. **Create databases**:
   ```sql
   CREATE DATABASE meetup_clone;
   CREATE DATABASE meetup_clone_test;
   ```

### Option 3: Command Line Setup
```bash
# Connect to PostgreSQL
psql -U postgres

# Create databases
CREATE DATABASE meetup_clone;
CREATE DATABASE meetup_clone_test;
\q
```

## ⚙️ Environment Configuration

### Update your `.env` file in `backend/.env`:
```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True

# Database Settings (Production)
DB_NAME=meetup_clone
DB_USER=postgres
DB_PASSWORD=your-actual-postgres-password
DB_HOST=localhost
DB_PORT=5432

# Database Settings (Test)
DB_NAME_TEST=meetup_clone_test

# Google OAuth Settings
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-client-secret
```

## 🚀 Running the Application

### 1. Stop Current Servers
If you have Django/React servers running, stop them first.

### 2. Run Database Migrations
```bash
cd backend
python manage.py migrate
```

### 3. Create Superuser
```bash
python manage.py createsuperuser
```

### 4. Start Backend Server
```bash
python manage.py runserver
```

### 5. Start Frontend Server (in new terminal)
```bash
cd frontend
npm start
```

## 🧪 Testing Database Configuration

### Test Production Database
```bash
python manage.py dbshell
```

### Test with Django Shell
```bash
python manage.py shell
>>> from django.db import connection
>>> connection.ensure_connection()
>>> print("Database connection successful!")
```

## 🔧 Troubleshooting

### Common Issues:

1. **"psql is not recognized"**
   - Add PostgreSQL to your system PATH
   - Restart your terminal/command prompt

2. **"Connection refused"**
   - Make sure PostgreSQL service is running
   - Check if port 5432 is available

3. **"Authentication failed"**
   - Verify the password in your `.env` file
   - Make sure you're using the correct username

4. **"Database does not exist"**
   - Run the database creation commands
   - Check database names in your `.env` file

### Useful Commands:
```bash
# Check PostgreSQL status
pg_ctl status

# Start PostgreSQL service
pg_ctl start

# Stop PostgreSQL service
pg_ctl stop

# List all databases
psql -U postgres -l

# Connect to specific database
psql -U postgres -d meetup_clone
```

## 📊 Database Management

### Using pgAdmin (GUI):
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Navigate to Databases
4. You should see `meetup_clone` and `meetup_clone_test`

### Using Command Line:
```bash
# List databases
psql -U postgres -l

# Connect to production database
psql -U postgres -d meetup_clone

# Connect to test database
psql -U postgres -d meetup_clone_test
```

## 🎯 Next Steps

Once PostgreSQL is set up:
1. Update your `.env` file with correct credentials
2. Run migrations: `python manage.py migrate`
3. Create superuser: `python manage.py createsuperuser`
4. Start the application
5. Test the application at http://localhost:3000

Your Meetup Clone will now use PostgreSQL for both production and testing!
