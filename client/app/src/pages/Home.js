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

        <h3 className="header-text">Welcome {user.name}</h3>
      </header>
      <main className="dash-main">
        <h2>Starhub Bible Study App</h2>

        <h4>Verse for the day - {verse.reference}</h4>
        <p>{verse.text}</p>
        <div className="home-video">
          <iframe
            width="80%"
            height="90%"
            src="https://www.youtube.com/embed/Y71r-T98E2Q?si=C-VPv-eOzrllq8Sp"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
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
