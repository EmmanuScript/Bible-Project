// VersePage.js
import React from "react";
import { Link } from "react-router-dom";
import VerseItems from "../components/VerseItems"; // Import the VerseItems component

const VersePage = ({ dataArray }) => {
  return (
    <div>
      <h2 className="verse-header">1 Timothy for the Day</h2>
      <div className="verses-container">
        {dataArray.map((item, index) => (
          <Link key={index} to={`/verse/${item.id}`}>
            {/* Use Link to direct to the verse detail page */}
            <VerseItems key={index} verse={item} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VersePage;
