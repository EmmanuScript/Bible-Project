import React, { useEffect, useState } from "react";
import axios from "axios";
import { DATA_URL } from "../config";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Home = () => {
  const [user, setUser] = useState({});
  const [verse, setVerse] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = Cookies.get("jwt");
        const response = await axios.get(`${DATA_URL}api/get-user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        return toast.error("Failed to fetch user");
      }
    };

    const dailyVerse = async () => {
      try {
        const verseRes = await axios.get(
          "https://beta.ourmanna.com/api/v1/get?format=json&order=daily"
        );

        setVerse(verseRes.data.verse.details);
      } catch (e) {
        console.error("Error fetching user:", e);
        return toast.error("Failed to fetch verse");
      }
    };

    dailyVerse();
    fetchUser();
  }, []);

  return (
    <div className="dashboard">
      <header className="dash-header">
        <img
          className="dash-img"
          src="https://www.clipartmax.com/png/middle/303-3033117_cross-and-bible-designed-logo-cross.png"
          alt="Dashboard"
        />
      </header>
      <main className="dash-main">
        <h2>Starhub Bible Study App</h2>
        <h3>Welcome {user.name}</h3>
        <h4>Verse for the day</h4>
        <h4>{verse.reference}</h4>
        <p>{verse.text}</p>
        <div className="home-video">
          <iframe
            width="80%"
            height="90%"
            src="https://www.youtube.com/embed/yiHf8klCCc4?si=KXntNGJ-mhYOgQ08"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div className="flex-col-1">
          <div className="col-1">
            <h3>Your Streak is</h3>
            <div className="streak">
              <h1>{user.streak ? user.streak : 0}</h1>
            </div>
          </div>
          <div className="col-1">
            <h3>Your Point is</h3>
            <div className="streak">
              <h1>{user.points ? user.points : 0}</h1>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
