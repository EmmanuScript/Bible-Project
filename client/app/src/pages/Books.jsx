// BooksPage.js
import React from "react";
import { Link } from "react-router-dom";
import VersePage from "./Verses";
import BooksItems from "../components/BooksItem";

const BooksPage = ({ booksArray }) => {
  console.log(booksArray);
  return (
    <div>
      <h2 className="books-header">Books of the Bible</h2>
      <div className="books-container">
        {booksArray.map((book, index) => (
          <Link key={index} to={`/books/${book.id}`}>
            <BooksItems key={index} book={book} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BooksPage;
