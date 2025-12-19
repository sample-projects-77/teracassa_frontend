# TerraCasa Frontend Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   Create a `.env` file in the root directory with:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
   
   Make sure your backend is running on port 5000, or update the URL accordingly.

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   The app will be available at `http://localhost:5173` (or the port shown in terminal)

## Backend Connection

The frontend is configured to connect to the TerraCasa backend API. Make sure:

- Backend is running on `http://localhost:5000`
- CORS is enabled in the backend
- The API base URL in `.env` matches your backend URL

## Project Structure

```
src/
├── config/
│   └── api.js              # Axios setup with interceptors
├── context/
│   └── AuthContext.jsx     # Global auth state management
├── services/
│   ├── authService.js      # Auth API calls
│   ├── countryService.js   # Countries API calls
│   └── profileService.js   # Profile API calls
├── components/
│   └── ProtectedRoute.jsx  # Route protection wrapper
├── App.jsx                  # Main app with routing
└── main.jsx                 # Entry point
```

## Available Services

All API services are ready to use:

- **authService**: register, login, getCurrentUser, updatePassword
- **countryService**: getCountries, getCountryOverview, getCountrySections
- **profileService**: updateProfile, getPublicProfile

## Authentication

The app uses JWT tokens stored in localStorage. The AuthContext provides:
- `user` - Current user object
- `isAuthenticated` - Boolean auth state
- `login(userData, token)` - Login function
- `logout()` - Logout function
- `updateUser(userData)` - Update user data

## Next Steps

1. Create actual page components (Login, Register, Countries, etc.)
2. Add styling framework (Tailwind CSS, Material-UI, etc.)
3. Implement error handling UI
4. Add loading states
5. Create forms for registration and login

