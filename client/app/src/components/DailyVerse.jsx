import React from "react";
import { Link, useParams } from "react-router-dom";

const VerseDetail = ({ dataArray }) => {
  const { id, quizId } = useParams();

  // Find the selected verse from dataArray based on id
  const selectedVerse = dataArray.find((verse) => verse.id === id);

  console.log("this is ", selectedVerse.quizId);

  return (
    <div className="verse-detail">
      <h2 className="verse-header">Verse Details</h2>
      {selectedVerse ? (
        <div className="verse-container">
          <h3>Day {selectedVerse.id}</h3>
          <p className="verse-text">{selectedVerse.verses}</p>
          {/* Add more details if needed */}
        </div>
      ) : (
        <p>Verse not found</p>
      )}

      <div className="quiz-button-container">
        <Link to={`/quiz/${id}`} className="quiz-button">
          Go to Quiz
        </Link>
        {/* <Link to={`/comments/${id}`} className="quiz-button">
          Go to Comments
        </Link> */}
      </div>
    </div>
  );
};

export default VerseDetail;
