import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
import { DATA_URL } from "../config";
import axios from "axios";
import Cookies from "js-cookie";
import books from "../verses";
import SpinnerImage from "../assets/ZKZg.gif";

const Quiz = ({ dataArray }) => {
  const { bookId, id } = useParams();
  const selectedBook = dataArray.find((book) => book.id === bookId);

  console.log(selectedBook);
  const [verse, setVerse] = useState(
    selectedBook.verses.find((verse) => verse.id === id)
  );
  const [counter, setCounter] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [hasTakenQuizBefore, setHasTakenQuizBefore] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchQuizIds = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const token = Cookies.get("jwt");
        const response = await axios(`${DATA_URL}api/quiz-taken/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        if (response.status === 200) {
          const quizIds = data;

          if (quizIds.includes(verse.quizId)) {
            setLoading(false);
            setHasTakenQuizBefore(true);

            setShowModal(true);
          }
        } else {
          setLoading(false);
          console.error("Failed to fetch quiz IDs");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching quiz IDs:", error);
      }
    };
    fetchQuizIds();
  }, [verse.quizId]);

  const handleAnswerSelection = (questionIndex, selectedOption) => {
    const selectedQuestion = verse.question[questionIndex];
    if (selectedQuestion.answer === selectedOption) {
      setCounter(counter + 1);
    }
    const updatedQuestion = {
      ...selectedQuestion,
      selectedAnswer: selectedOption,
    };
    const updatedVerse = { ...verse };
    updatedVerse.question[questionIndex] = updatedQuestion;
    setVerse(updatedVerse);
  };

  // const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const token = Cookies.get("jwt");
      // Make a request to update the quiz
      setSubmitLoading(true);
      const id = localStorage.getItem("userId");
      // Make a request to update the streak
      const streakUpdateResponse = await axios.patch(
        `${DATA_URL}api/update-streak/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const quizUpdateResponse = await axios.patch(
        `${DATA_URL}api/update-quiz/${id}`,
        {
          quizId: verse.quizId,
          dateTaken: new Date().toISOString(),
          quizScore: counter,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const pointsUpdateResponse = await axios.patch(
        `${DATA_URL}api/calculate-points/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // If all requests are successful, show the modal
      if (
        pointsUpdateResponse.status === 200 &&
        streakUpdateResponse.status === 200 &&
        quizUpdateResponse.status === 200
      ) {
        setSubmitLoading(false);
        setShowModal(true);
        setQuizSubmitted(true);
      } else {
        setLoading(false);
        console.error("Failed to update quiz or streak");
      }
    } catch (error) {
      setSubmitLoading(false);
      console.error("Error submitting quiz:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // const handleReturnModal = () => {
  //   setShowModal(false);
  //   navigate("/verses");
  // };

  const handleSeeAnswers = () => {
    // Find the verse based on the id parameter
    const bookToCheck = books.find((book) => book.id === bookId);

    console.log(bookToCheck);

    const verseToUpdate = bookToCheck.verses.find((verse) => verse.id === id);

    // Ensure verseToUpdate is found
    if (verseToUpdate) {
      // Iterate through each question in the verse
      const verseWithAnswers = {
        ...verseToUpdate,
        question: verseToUpdate.question.map((question) => ({
          ...question,
          // Highlight correct answer in green (or lime green)
          options: question.options.map((option, optionIndex) => (
            <span
              key={optionIndex}
              style={{
                color:
                  question.answer === String.fromCharCode(97 + optionIndex)
                    ? "green"
                    : "inherit",
              }}
            >
              {option}
            </span>
          )),
        })),
      };
      setVerse(verseWithAnswers);
      setHasTakenQuizBefore(true);
      setShowModal(false);
    } else {
      console.error("Verse not found");
    }
  };

  return (
    <div className="quiz-container">
      {hasTakenQuizBefore ? (
        <h3>
          All quiz can only be taken once, you can proceed to see your answers
        </h3>
      ) : (
        ""
      )}
      {loading ? (
        <div className="spinner">
          <img src={SpinnerImage} alt="spinner" width={100} height={100} />
        </div>
      ) : (
        <div>
          <h2 className="quiz-header">Quiz</h2>
          <p>pick the correct option</p>
          {verse ? (
            <div className="quiz-question">
              {verse.question.map((question, index) => (
                <div key={index}>
                  <h3>Question {index + 1}:</h3>
                  <p>{question.question}</p>
                  <form>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex}>
                        <label>
                          <input
                            type="radio"
                            name={`question_${index}`}
                            value={String.fromCharCode(97 + optionIndex)}
                            checked={
                              question.selectedAnswer ===
                              String.fromCharCode(97 + optionIndex)
                            }
                            onChange={() =>
                              hasTakenQuizBefore
                                ? null
                                : handleAnswerSelection(
                                    index,
                                    String.fromCharCode(97 + optionIndex)
                                  )
                            }
                            disabled={hasTakenQuizBefore}
                          />
                          {option}
                        </label>
                      </div>
                    ))}
                  </form>
                </div>
              ))}
              <Button
                variant="primary"
                className={
                  hasTakenQuizBefore ? "buttonInactive" : "button-quiz"
                }
                onClick={handleSubmit}
                disabled={hasTakenQuizBefore || quizSubmitted}
              >
                {submitLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          ) : (
            <p>Question not found</p>
          )}
        </div>
      )}

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="modal-helper"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {hasTakenQuizBefore ? "Quiz Already Taken" : "Your Score"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {hasTakenQuizBefore ? (
            <p>You have already taken this quiz.</p>
          ) : (
            <p>Your score is: {counter}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {hasTakenQuizBefore ? (
            <Button variant="primary" onClick={handleSeeAnswers}>
              See Correct Answers
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSeeAnswers}>
              See Correct Answers
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <div className="footer-push"></div>
    </div>
  );
};

export default Quiz;
