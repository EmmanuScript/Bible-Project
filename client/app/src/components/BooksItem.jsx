import React from "react";

const BooksItems = ({ book, onClick }) => {
  console.log(book);
  return (
    <div
      className={book.name === "Third John" ? "verse-today" : "verse"}
      onClick={onClick}
    >
      {book.name === "Third John" ? <p>{book.name}★</p> : <p>{book.name}</p>}
    </div>
  );
};

export default BooksItems;
