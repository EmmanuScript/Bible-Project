import React from "react";

const VerseItems = ({ verse, onClick }) => {
  return (
    <div className="verse" onClick={onClick}>
      <p>Day {verse.id}</p>
    </div>
  );
};

export default VerseItems;
