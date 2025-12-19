# TerraCasa Frontend

React frontend application for TerraCasa real estate platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── config/
│   └── api.js              # Axios configuration and interceptors
├── context/
│   └── AuthContext.jsx     # Authentication context
├── services/
│   ├── authService.js      # Authentication API calls
│   ├── countryService.js   # Countries API calls
│   └── profileService.js   # Profile API calls
├── components/
│   └── ProtectedRoute.jsx  # Route protection component
├── App.jsx                  # Main app component with routing
└── main.jsx                 # Entry point
```

## Features

- ✅ API connection to backend
- ✅ Authentication context
- ✅ Protected routes
- ✅ Service layer for API calls
- ✅ Axios interceptors for token management

## API Endpoints Connected

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /me` - Get current user
- `PUT /auth/resetpassword` - Update password

### Countries
- `GET /countries` - List countries
- `GET /countries/:countryCode` - Get country overview
- `GET /countries/:countryCode/sections` - Get country sections

### Profiles
- `PATCH /me` - Update profile
- `GET /:partnerId` - Get public profile

## Next Steps

1. Create login/register forms
2. Create country listing page
3. Create profile pages
4. Add styling (CSS/Tailwind/Material-UI)
5. Add error handling UI
6. Add loading states
