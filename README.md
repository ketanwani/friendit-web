# Friendit - Full Stack Web Application

A complete Friendit web application built with Django REST Framework (backend) and React (frontend). This MVP allows users to create, discover, and join events with full authentication and social features.

## 🚀 Features

### Backend (Django REST Framework)
- **User Authentication**: JWT-based authentication with email/password and Google OAuth2
- **Event Management**: Full CRUD operations for events
- **Event Participation**: Join/leave events with attendee tracking
- **Comment System**: Users can comment on events
- **Database**: PostgreSQL with optimized queries
- **API**: RESTful API with filtering, searching, and pagination

### Frontend (React)
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Authentication**: Login/register with Google OAuth integration
- **Event Discovery**: Browse events with advanced filtering
- **Event Details**: View event details, attendees, and comments
- **User Profile**: Manage hosted and attending events
- **Real-time Updates**: Dynamic UI updates

## 🛠️ Tech Stack

### Backend
- **Django 4.2.7** - Web framework
- **Django REST Framework 3.14.0** - API framework
- **PostgreSQL** - Database
- **JWT Authentication** - Token-based auth
- **Google OAuth2** - Social authentication
- **CORS Headers** - Cross-origin requests

### Frontend
- **React 18.2.0** - UI library
- **React Router DOM 6.8.1** - Client-side routing
- **Tailwind CSS 3.3.6** - Styling framework
- **Axios 1.6.2** - HTTP client
- **Google OAuth** - Social login integration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd meetup-clone
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Database Setup
1. Create a PostgreSQL database:
```sql
CREATE DATABASE meetup_clone;
```

2. Create a `.env` file in the `backend` directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=meetup_clone
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-client-secret
```

#### Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Create Superuser
```bash
python manage.py createsuperuser
```

#### Start Backend Server
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Environment Configuration
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

#### Start Frontend Server
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:8000/accounts/google/login/callback/` (for backend)
   - `http://localhost:3000` (for frontend)
6. Copy Client ID and Client Secret to your `.env` files

### Database Configuration

The application uses PostgreSQL by default. To use a different database:

1. Update `DATABASES` in `backend/meetup_clone/settings.py`
2. Install the appropriate database adapter
3. Update your `.env` file with new credentials

## 📁 Project Structure

```
meetup-clone/
├── backend/                 # Django backend
│   ├── meetup_clone/       # Main Django project
│   ├── accounts/           # User authentication app
│   ├── events/            # Events management app
│   ├── requirements.txt   # Python dependencies
│   └── env.example        # Environment variables template
├── frontend/               # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   ├── package.json       # Node dependencies
│   └── env.example       # Environment variables template
└── README.md             # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/google/` - Google OAuth login
- `GET /api/auth/profile/` - Get user profile
- `POST /api/auth/logout/` - User logout

### Events
- `GET /api/events/` - List events (with filtering)
- `POST /api/events/` - Create event
- `GET /api/events/{id}/` - Get event details
- `PUT /api/events/{id}/` - Update event
- `DELETE /api/events/{id}/` - Delete event
- `POST /api/events/{id}/join/` - Join event
- `POST /api/events/{id}/leave/` - Leave event

### Comments
- `GET /api/events/{id}/comments/` - Get event comments
- `POST /api/events/{id}/comments/` - Create comment
- `PUT /api/events/{id}/comments/{id}/` - Update comment
- `DELETE /api/events/{id}/comments/{id}/` - Delete comment

## 🎨 Frontend Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/events` - Events listing
- `/events/:id` - Event details
- `/create-event` - Create event (protected)
- `/profile` - User profile (protected)

## 🧪 Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Django)
1. Set `DEBUG=False` in production
2. Configure production database
3. Set up static file serving
4. Use environment variables for secrets
5. Deploy to platforms like Heroku, AWS, or DigitalOcean

### Frontend Deployment (React)
1. Build the production version:
```bash
npm run build
```
2. Deploy to platforms like Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **CORS Errors**
   - Check `CORS_ALLOWED_ORIGINS` in Django settings
   - Ensure frontend URL is included

3. **Google OAuth Issues**
   - Verify Google OAuth credentials
   - Check redirect URIs in Google Console
   - Ensure HTTPS in production

4. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Create a new issue with detailed description
- Include error logs and system information

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Event categories and tags
- [ ] User profiles with avatars
- [ ] Event search and recommendations
- [ ] Mobile app (React Native)
- [ ] Payment integration for paid events
- [ ] Event analytics and insights
- [ ] Social features (friends, groups)
- [ ] Calendar integration
- [ ] Email notifications

---

**Happy Coding! 🚀**
