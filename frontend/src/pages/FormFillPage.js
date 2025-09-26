import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "./FormFillPage.css";

export default function FormFillPage() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({
    name: "",
    email: "",
    answers: {}
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      // Load form details
      const formRes = await api.get(`/forms/${formId}`);
      setForm(formRes.data.form);
      
      // Load questions
      const questionsRes = await api.get(`/questions/form/${formId}`);
      setQuestions(questionsRes.data.questions);
    } catch (err) {
      console.error("Error loading form:", err);
      setError("Form not found or unavailable");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: value
      }
    }));
  };

  const handleMultipleChoiceChange = (questionId, option, checked) => {
    setResponses(prev => {
      const currentAnswers = prev.answers[questionId] || [];
      let newAnswers;
      
      if (checked) {
        newAnswers = [...currentAnswers, option];
      } else {
        newAnswers = currentAnswers.filter(a => a !== option);
      }
      
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: newAnswers
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Validate required fields
      const requiredQuestions = questions.filter(q => q.required);
      const missingAnswers = requiredQuestions.filter(q => !responses.answers[q.id] || responses.answers[q.id].length === 0);
      
      if (missingAnswers.length > 0) {
        throw new Error(`Please answer the required questions: ${missingAnswers.map(q => q.text).join(', ')}`);
      }
      
      if (!responses.name || !responses.email) {
        throw new Error("Name and email are required");
      }
      
      // Prepare answers for submission
      const answers = questions.map(q => ({
        questionId: q.id,
        answer: responses.answers[q.id]
      }));
      
      const response = await api.post(`/responses`, {
        formId,
        submittedBy: responses.name,
        email: responses.email,
        answers
      });
      
      setSuccess(true);
      setSubmitting(false);
    } catch (err) {
      setError(err.message || "Failed to submit form");
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="form-fill-container">Loading form...</div>;
  }

  if (error) {
    return <div className="form-fill-container">Error: {error}</div>;
  }

  if (success) {
    return (
      <div className="form-fill-container">
        <div className="success-message">
          <h2>Thank You!</h2>
          <p>Your response has been submitted successfully.</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-fill-container">
      <div className="form-fill-card">
        <h1>{form?.title}</h1>
        {form?.description && <p className="form-description">{form.description}</p>}
        
        <form onSubmit={handleSubmit} className="form-fill-form">
          {/* Name and Email Fields */}
          <div className="form-group">
            <label>Your Name *</label>
            <input
              type="text"
              value={responses.name}
              onChange={(e) => setResponses({...responses, name: e.target.value})}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Your Email *</label>
            <input
              type="email"
              value={responses.email}
              onChange={(e) => setResponses({...responses, email: e.target.value})}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          {/* Questions */}
          {questions.map((question, index) => (
            <div key={question.id} className="question-container">
              <div className="question-header">
                <strong>{index + 1}. {question.text}</strong>
                {question.required && <span style={{ color: 'red', marginLeft: '5px' }}>*</span>}
              </div>
              
              {question.type === 'shortText' && (
                <input
                  type="text"
                  value={responses.answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Enter your answer"
                  maxLength={512}
                  required={question.required}
                />
              )}
              
              {question.type === 'longText' && (
                <textarea
                  value={responses.answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Enter your answer"
                  rows={4}
                  maxLength={4096}
                  required={question.required}
                />
              )}
              
              {question.type === 'singleChoice' && (
                <div className="options-container">
                  {question.options.map((option, idx) => (
                    <label key={idx} className="option-label">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={responses.answers[question.id] === option}
                        onChange={() => handleAnswerChange(question.id, option)}
                        required={question.required}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
              
              {question.type === 'multipleChoice' && (
                <div className="options-container">
                  {question.options.map((option, idx) => (
                    <label key={idx} className="option-label">
                      <input
                        type="checkbox"
                        checked={(responses.answers[question.id] || []).includes(option)}
                        onChange={(e) => handleMultipleChoiceChange(question.id, option, e.target.checked)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
              
              {question.type === 'numeric' && (
                <input
                  type="number"
                  value={responses.answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Enter a number"
                  required={question.required}
                />
              )}
              
              {question.type === 'date' && (
                <input
                  type="date"
                  value={responses.answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  required={question.required}
                />
              )}
              
              {question.type === 'time' && (
                <input
                  type="time"
                  value={responses.answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  required={question.required}
                />
              )}
            </div>
          ))}
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </form>
      </div>
    </div>
  );
}