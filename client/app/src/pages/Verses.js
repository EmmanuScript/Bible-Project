// VersePage.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import VerseItems from "../components/VerseItems"; // Import the VerseItems component

const VersePage = ({ dataArray }) => {
  const { id } = useParams();
  const [verse, setVerse] = useState(
    dataArray.find((verse) => verse.id === id)
  );

  const verseArray = verse.verses;
  const bookId = verse.id;

  return (
    <div>
      <h2 className="verse-header">Verse from Genesis </h2>

      <div className="verses-container">
        {verseArray.map((item, index) => (
          <Link key={index} to={`/books/${bookId}/${item.id}`}>
            {/* Use Link to direct to the verse detail page */}
            <VerseItems key={index} verse={item} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VersePage;
