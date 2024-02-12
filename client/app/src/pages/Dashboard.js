import React from "react";
import HomeImage from "../assets/jpg/bible-1868070_1280.jpg";
import CardImage1 from "../assets/jpg/open_app.jpg";
import CardImage2 from "../assets/jpg/quiz.jpg";
import CardImage3 from "../assets/jpg/group.jpg";
import CardImage4 from "../assets/jpg/streak.jpg";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <header className="dash-header">
        <img
          className="dash-img"
          src="https://www.clipartmax.com/png/middle/303-3033117_cross-and-bible-designed-logo-cross.png"
          alt="Dashboard-logo"
        />
        <nav className="dash-nav">
          <Link className="dash-nav-link" to="/login">
            Login
          </Link>
          <Link className="dash-nav-link" to="/sign-up">
            Signup
          </Link>
        </nav>
      </header>
      <main className="dash-main">
        <h2>Welcome to Your Bible Study App!</h2>
        <img src={HomeImage} alt="bibile-study" width="100%" height="80%" />
        <h3>How To Use App</h3>
        <p></p>
        <div className="card-container">
          <div className="card">
            <img src={CardImage1} alt="card1" width="50%" height="40%" />
            <p>Open the app</p>
          </div>
          <div className="card">
            <img src={CardImage2} alt="card2" width="50%" height="40%" />
            <p>Go to "Verses" - Study and Take Quiz</p>
          </div>
          <div className="card">
            <img src={CardImage3} alt="card3" width="50%" height="40%" />
            <p>Each points increases Group rating</p>
          </div>
          <div className="card">
            <img src={CardImage4} alt="card4" width="50%" height="40%" />
            <p>Maintain Streak by Taking Quiz Daily</p>
          </div>
        </div>
      </main>
      <footer className="dash-footer">
        <div></div>
        <div>
          <h4>Emmanuel &copy; 2024</h4>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
