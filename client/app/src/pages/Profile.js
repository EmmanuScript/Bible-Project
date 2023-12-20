import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

function Profile() {
//   const auth = getAuth();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: 'Olajumoke Emmanuel',
    email: 'oanjoyin@gmail.com',
    group: 'Group 2'
  });
  const { name, email, group } = formData;
  const [changeDetails, setChangeDetails] = useState(false);
  const [listings, setListings] = useState([]); // State to hold fetched data

  


  const navigate = useNavigate();

  useEffect(() => {
    // Simulating data fetching (replace with your actual API call)
    const fetchData = () => {
      const simulatedData = [
        { id: 1, name: 'Listing 1', progress: 'In progress' },
        { id: 2, name: 'Listing 2', progress: 'Completed' },
        // Add more simulated data objects as needed
      ];

      setListings(simulatedData);
      setLoading(false);
    };

    fetchData(); // Call the function to simulate fetching
  }, []);

  const onLogout = () => {
    // auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
    } catch (error) {
  };
}

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (listingId) => {
   
  };

  return (
    <div className='dashboard'>
      <header className='profileHeader'>
        <h2 className='dash-header'>My Profile</h2>
        <button type='button' onClick={onLogout} className='logOut'>
          Logout
        </button>
      </header>

      <div>
        <div className='profileDetailsHeader'>
          <p className='profileDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>

        <div className='profileCard'>
          <form action=''>
            <input
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
              type='text'
              id='name'
            />
            <input
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
              type='email'
              id='email'
            />
            <input
              className={!changeDetails ? "profileGroup" : "profileEmailGroup"}
              disabled={!changeDetails}
              value={group}
              onChange={onChange}
              type='text'
              id='group'
            />
          </form>
        </div>

        {!loading && listings?.length > 0 && (
          <>
            <p className='listingText'>Group Board</p>
            <div className='listingsList'>
              {/* Displaying simulated listings */}
              {listings.map((listing) => (
                <div key={listing.id} className='listingBox'>
                  <p>{listing.name}</p>
                  <p>{listing.progress}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
