import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName || user?.email}!</h1>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Your Profile</h2>
          <div className="profile-info">
            <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            {user?.roleTitle && <p><strong>Role:</strong> {user.roleTitle}</p>}
            {user?.baseCity && <p><strong>Location:</strong> {user.baseCity}, {user.baseCountry}</p>}
          </div>
          <Link to="/profile" className="profile-link">Edit Profile</Link>
        </div>

        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/countries" className="action-button">
              Browse Countries
            </Link>
            <Link to="/profile" className="action-button">
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

