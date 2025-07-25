# Beeja Learning Management System

A comprehensive Learning Management System (LMS) built with React.js frontend and Node.js backend, designed to provide a complete educational platform for students, instructors, and administrators.

## 🚀 Features

### For Students
- **Course Enrollment**: Browse and enroll in courses
- **Interactive Learning**: Watch video lectures, take quizzes, and track progress
- **Certificate Generation**: Automatic certificate generation upon course completion
- **Progress Tracking**: Real-time progress monitoring with detailed analytics
- **Quiz System**: Multiple question types including multiple choice, short answer, code solving, and match the following
- **Course Access Management**: Seamless access to enrolled courses with order status validation

### For Instructors
- **Course Creation**: Create comprehensive courses with sections and subsections
- **Content Management**: Upload videos, create quizzes, and manage course materials
- **Student Analytics**: Track student progress and performance
- **Quiz Builder**: Advanced quiz creation with multiple question types and validation

### For Administrators
- **User Management**: Manage students, instructors, and admin accounts
- **Course Management**: Oversee all courses, categories, and content
- **Order Management**: Handle course purchases and access control
- **Analytics Dashboard**: Comprehensive analytics and reporting
- **Notification System**: Send notifications to users
- **Certificate Management**: Automatic certificate regeneration with updated issue dates
- **Enhanced Form Validation**: Advanced form validation with scroll-to-error and visual indicators

## 🏗️ Project Structure

```
Beeja-LMS/
├── backend/                    # Node.js Backend
│   ├── config/                # Configuration files
│   │   ├── cloudinary.js      # Cloudinary setup for file uploads
│   │   ├── database.js        # MongoDB connection
│   │   └── razorpay.js        # Payment gateway configuration
│   ├── controllers/           # Business logic controllers
│   │   ├── admin/             # Admin-specific controllers
│   │   ├── auth.js            # Authentication controller
│   │   ├── certificate.js     # Certificate management
│   │   ├── course.js          # Course management
│   │   ├── quiz.js            # Quiz management
│   │   ├── profile.js         # User profile management
│   │   └── ...                # Other controllers
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js            # Authentication middleware
│   │   ├── multer.js          # File upload middleware
│   │   └── rateLimiter.js     # Rate limiting
│   ├── models/                # MongoDB schemas
│   │   ├── user.js            # User model
│   │   ├── course.js          # Course model
│   │   ├── quiz.js            # Quiz model
│   │   ├── certificate.js     # Certificate model
│   │   └── ...                # Other models
│   ├── routes/                # API routes
│   │   ├── admin/             # Admin routes
│   │   ├── user.js            # User routes
│   │   ├── course.js          # Course routes
│   │   ├── quiz.js            # Quiz routes
│   │   └── ...                # Other routes
│   ├── utils/                 # Utility functions
│   │   ├── certificateRegeneration.js  # Certificate regeneration utility
│   │   ├── imageUploader.js   # Image upload utilities
│   │   └── mailSender.js      # Email utilities
│   └── server.js              # Main server file
├── frontend/                  # React.js Frontend
│   ├── public/                # Public assets
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── common/        # Common components
│   │   │   └── core/          # Core feature components
│   │   │       ├── Dashboard/ # Dashboard components
│   │   │       │   ├── Admin/ # Admin dashboard
│   │   │       │   └── ...    # Other dashboard components
│   │   │       └── ViewCourse/ # Course viewing components
│   │   ├── pages/             # Page components
│   │   │   ├── Admin/         # Admin pages
│   │   │   │   └── components/ # Admin-specific components
│   │   │   └── ...            # Other pages
│   │   ├── services/          # API services
│   │   │   ├── apis.js        # API endpoints
│   │   │   └── operations/    # API operation functions
│   │   ├── slices/            # Redux slices
│   │   ├── utils/             # Utility functions
│   │   └── App.jsx            # Main App component
│   ├── package.json           # Frontend dependencies
│   └── ...                    # Other frontend config files
└── README.md                  # Project documentation
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - File storage and management
- **Razorpay** - Payment processing
- **Nodemailer** - Email services
- **Multer** - File upload handling

### Frontend
- **React.js** - Frontend framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **Axios** - HTTP client

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/joshwa2003/Beeja-merge-0207.git
cd Beeja-merge-0207
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGODB_URL=mongodb://localhost:27017/beeja-lms
# or for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/beeja-lms

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary (for file uploads)
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
FOLDER_NAME=beeja-lms

# Razorpay (for payments)
RAZORPAY_KEY=your-razorpay-key
RAZORPAY_SECRET=your-razorpay-secret

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Server Configuration
PORT=4000
```

### 4. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 5. Configure Frontend Environment

Create a `.env` file in the frontend directory:

```env
VITE_APP_BASE_URL=http://localhost:4000
```

## 🏃‍♂️ Running the Project

### Development Mode

#### Start Backend Server

```bash
# From the backend directory
cd backend
npm run dev
```

The backend server will start on `http://localhost:4000`

#### Start Frontend Development Server

```bash
# From the frontend directory (in a new terminal)
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Production Mode

#### Build Frontend

```bash
cd frontend
npm run build
```

#### Start Production Server

```bash
cd backend
npm start
```

## 🗄️ Database Setup

### Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database and collections

### MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update the `MONGODB_URL` in your `.env` file

### Sample Data

To populate the database with sample data:

```bash
cd backend
npm run seed
```

## 🔧 Available Scripts

### Backend Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Populate database with sample data
npm test           # Run tests
```

### Frontend Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. Set up environment variables on your hosting platform
2. Deploy the backend code
3. Ensure MongoDB connection is configured

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `docs/` folder

## 🔄 Recent Updates

### Latest Features
- Enhanced form validation with scroll-to-error functionality
- Visual error indicators for better user experience
- Certificate regeneration system with preserved IDs
- Course access control based on order status
- Improved quiz creation and editing experience

---

**Happy Learning! 🎓**
