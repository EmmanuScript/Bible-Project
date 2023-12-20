import React from "react";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dash-header">
        <img
          className="dash-img"
          src="https://images.subsplash.com/image.jpg?id=13c38c4b-5360-4116-b151-6d3cf1cbbf36&w=1280&h=720"
          alt="Dashboard Image"
        />
        <nav className="dash-nav">
          <a className="dash-nav-link" href="/login">
            Login
          </a>
          <a className="dash-nav-link" href="/signup">
            Signup
          </a>
        </nav>
      </header>
      <main className="dash-main">
        <h2>Welcome to Your Dashboard!</h2>
        <video controls>
          <source
            src="https://youtu.be/7RoqnGcEjcs?si=8mA7-eSNQaaZz1Zu"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <p>Dashboard content goes here...</p>
      </main>
    </div>
  );
};

export default Dashboard;
