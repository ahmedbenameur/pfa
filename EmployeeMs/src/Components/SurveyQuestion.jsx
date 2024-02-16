import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './style.css';

const SurveyQuestion = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { id, questionId } = useParams();

  useEffect(() => {
    axios.get('http://localhost:3000/employee/survey-categories')
      .then(result => {
        if (result.data.Status) {
          setCategories(result.data.Result);
        } else {
          showAlert(result.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const questionsRef = useRef(questions);
  questionsRef.current = questions;

  useEffect(() => {
    fetchSurveyQuestions();
  }, [selectedCategory]);

  const fetchSurveyQuestions = async () => {
    try {
      if (selectedCategory) {
        const response = await axios.get(
          `http://localhost:3000/employee/survey-questions/${selectedCategory}`
        );

        if (response.data.Status) {
          const surveyQuestions = response.data.Result;

          if (Array.isArray(surveyQuestions)) {
            setQuestions(surveyQuestions);
            setResponses([]);
          } else {
            console.error("Les questions du sondage ne sont pas un tableau :", surveyQuestions);
            setQuestions([]);
            setResponses([]);
          }
        } else {
          showAlert(response.data.Error);
          setQuestions([]);
          setResponses([]);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des questions du sondage :", error);
      setQuestions([]);
      setResponses([]);
    }
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setQuestions([]);
    setResponses([]);
    fetchSurveyQuestions();
  };

  const handleResponseChange = (questionId, response) => {
    const updatedResponses = [...responses];
    const existingResponseIndex = updatedResponses.findIndex((r) => r.question_id === questionId);

    if (existingResponseIndex !== -1) {
      updatedResponses[existingResponseIndex].response = response;
    } else {
      updatedResponses.push({ question_id: questionId, response: response });
    }

    setResponses(updatedResponses);
  };

  const handleSubmitSurvey = async () => {
    try {
      console.log('Employee ID:', id);
      console.log('Responses:', responses);

      if (id && responses.length > 0) {
        const employeeResponses = responses.map(response => ({
          question_id: response.question_id,
          response: response.response,
          employee_id: id,
        }));

        await axios.post('http://localhost:3000/employee/submit-survey', {
          employee_id: id,
          responses: employeeResponses,
        });

        showAlert('Survey responses successfully recorded.');
      } else {
        showAlert("No responses have been recorded. Please answer the questions before submitting the survey, or the employee ID is not defined.");
      }
    } catch (error) {
      console.error('Error during survey submission:', error);
    }
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);

    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  };

  return (
    <div>
      <h2>Employee Survey</h2>
      <label>
        Select Category:
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          {categories && categories.map((categoryObj) => (
            <option key={categoryObj.category} value={categoryObj.category}>
              {categoryObj.category}
            </option>
          ))}
        </select>
      </label>

      {selectedCategory && questions && Array.isArray(questions) ? (
        <>
          <h3>Survey Questions - {selectedCategory}</h3>
          <form>
            {questions && questions.map((question) => (
              <div key={question.id.toString()}>
                <p>{question.question_text}</p>
                <input
                  type="text"
                  value={(responses.find((r) => r.question_id === question.id) || {}).response || ''}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={handleSubmitSurvey}>
              Submit Survey
            </button>
          </form>
        </>
      ) : (
        <p>No questions available for the selected category.</p>
      )}

      {alertVisible && (
        <div className="alert">
          <span className="close" onClick={() => setAlertVisible(false)}>&times;</span>
          <p>{alertMessage}</p>
        </div>
      )}
    </div>
  );
};

export default SurveyQuestion;
