import React from "react";
import { Link } from "react-router-dom";
import hall_request from '../../assets/hall_requests.png';
import hall_review from '../../assets/hall_review.png';

import './styles.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>Welcome back, Admin</h2>
      <nav className="dashboard-nav">
      <div className="dashboard-item">
          <Link to="/hall-review" className="dashboard-link">
            <img src={hall_review} alt="Hall Review" className="dashboard-image" />
            <p>Hall Review</p>
          </Link>
        </div>
        <div className="dashboard-item">
          <Link to="/requests" className="dashboard-link">
            <img src={hall_request} alt="Requests" className="dashboard-image" />
            <p>Requests</p>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
