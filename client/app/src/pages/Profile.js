import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Providers/AuthProviders";
import axios from "axios";
import { DATA_URL } from "../config";
import Cookies from "js-cookie";
import SpinnerImage from "../assets/ZKZg.gif";
import { Modal } from "react-bootstrap";

function Profile() {
  const { isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    group: "",
  });
  const { name, email, group } = formData;
  const [changeDetails, setChangeDetails] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupScore, setGroupScore] = useState(0);
  const [leaders, setLeaders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("jwt");
        const userId = localStorage.getItem("userId");

        // Fetch user data
        const userResponse = await axios.get(
          `${DATA_URL}api/get-user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = userResponse.data;
        setFormData({
          name: userData.name,
          email: userData.email,
          group: userData.group,
        });

        // Fetch group users
        const group = localStorage.getItem("group");
        const groupResponse = await axios.get(
          `${DATA_URL}api/groups/${group}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGroupMembers(groupResponse.data);

        // Fetch group score
        const groupScoreResponse = await axios.get(
          `${DATA_URL}api/group-score/${group}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGroupScore(groupScoreResponse.data.groupScore);

        // Fetch leaders
        const leadersResponse = await axios.get(`${DATA_URL}api/top-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaders(leadersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Possible Network Error: Failed to fetch data", {
          autoClose: 1000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onLogout = () => {
    logout();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      // Implement your submit logic here
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div className="dashboard">
      <header className="profileHeader">
        <h2 className="dash-header">My Profile</h2>
        {isAuthenticated() ? (
          <button type="button" onClick={onLogout} className="logOut">
            Logout
          </button>
        ) : (
          <></>
        )}
      </header>

      <div>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>

        <div className="profileCard">
          <form action="">
            <div className="profileInput">
              <label htmlFor="name">Name: </label>
              <input
                className={!changeDetails ? "profileName" : "profileNameActive"}
                disabled={!changeDetails}
                value={name}
                onChange={onChange}
                type="text"
                id="name"
              />
            </div>
            <div className="profileInput">
              <label htmlFor="email">Email: </label>
              <input
                className={
                  !changeDetails ? "profileEmail" : "profileEmailActive"
                }
                disabled={!changeDetails}
                value={email}
                onChange={onChange}
                type="email"
                id="email"
              />
            </div>
            <div className="profileInput">
              <label htmlFor="group">Group: </label>
              <input
                className={
                  !changeDetails ? "profileGroup" : "profileEmailGroup"
                }
                disabled={!changeDetails}
                value={group}
                onChange={onChange}
                type="text"
                id="group"
              />
            </div>
          </form>
        </div>

        <div className="col-profile">
          <h3>Your Group Score is</h3>
          <div className="streak">
            <h1>{groupScore ? groupScore : 0}</h1>
          </div>
        </div>

        {/* Display group members if data is fetched and loading is false */}
        {!loading && groupMembers?.length > 0 && (
          <>
            <p className="listingText">Group Board</p>
            <div className="listingsList">
              {groupMembers.map((member) => (
                <div key={member.id} className="listingBox">
                  <h4 className="profileNameActive">{member.name}</h4>
                  <p className="profileName">{member.points}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Display leaders if data is fetched and loading is false */}
        {!loading && leaders?.length > 0 && (
          <>
            <p className="listingText">General Leaderboard</p>
            <div className="listingsList">
              {leaders.map((leader) => (
                <div key={leader.id} className="listingBox">
                  <h4 className="profileNameActive">{leader.name}</h4>
                  <p className="profileName">{leader.points}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Display spinner while loading */}
        <Modal show={loading} onHide={!loading} className="modal-helper">
          <Modal.Body>
            <img src={SpinnerImage} alt="spinner" height={100} width={100} />{" "}
          </Modal.Body>
        </Modal>
      </div>
      <div className="listingBottom"></div>
    </div>
  );
}

export default Profile;
