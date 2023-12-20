import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Quiz = ({ dataArray }) => {
  const { id } = useParams();
  const [verse, setVerse] = useState(
    dataArray.find((verse) => verse.id === id)
  );
  const [counter, setCounter] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleAnswerSelection = (questionIndex, selectedOption) => {
    const selectedQuestion = verse.question[questionIndex];
    console.log(selectedOption);
    console.log(selectedQuestion.answer);
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

  const navigate = useNavigate();

  const handleSubmit = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleReturnModal = () => {
    setShowModal(false);
    navigate("/verses");
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-header">Quiz</h2>
      <p>Correct Answers: {counter}</p>
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
                          handleAnswerSelection(
                            index,
                            String.fromCharCode(97 + optionIndex)
                          )
                        }
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
            className="button-quiz"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      ) : (
        <p>Question not found</p>
      )}

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className="modal-helper"
      >
        <Modal.Header closeButton>
          <Modal.Title>Your Score</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your score is: {counter}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReturnModal}>
            Go Back to Verses
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="footer-push"></div>
    </div>
  );
};

export default Quiz;
