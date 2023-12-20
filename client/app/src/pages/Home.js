import React from "react";

const Home = () => {
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
        <h2>Summary of 1 Timothy</h2>
        <p>Dashboard content goes here...</p>

        <video controls className="dashboard-video">
          <source
            src="https://youtu.be/7RoqnGcEjcs?si=8mA7-eSNQaaZz1Zu"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div>
          <h3>Click the link below to go to verses for the day</h3>
          <div className="verse">
            <h2>Verses for the Day</h2>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
