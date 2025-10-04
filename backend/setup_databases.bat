@echo off
echo Setting up PostgreSQL databases for Meetup Clone...
echo.

REM Check if PostgreSQL is installed
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL from: https://www.postgresql.org/download/windows/
    echo Make sure to add PostgreSQL to your system PATH
    pause
    exit /b 1
)

echo PostgreSQL found! Creating databases...
echo.

REM Create production database
echo Creating production database 'meetup_clone'...
psql -U postgres -c "CREATE DATABASE meetup_clone;" 2>nul
if %errorlevel% equ 0 (
    echo ✓ Production database created successfully
) else (
    echo ! Database might already exist
)

REM Create test database
echo Creating test database 'meetup_clone_test'...
psql -U postgres -c "CREATE DATABASE meetup_clone_test;" 2>nul
if %errorlevel% equ 0 (
    echo ✓ Test database created successfully
) else (
    echo ! Database might already exist
)

echo.
echo ✓ Database setup complete!
echo.
echo Next steps:
echo 1. Update your .env file with the correct PostgreSQL password
echo 2. Run: python manage.py migrate
echo 3. Run: python manage.py createsuperuser
echo 4. Start the server: python manage.py runserver
echo.
pause
