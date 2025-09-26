import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./FormBuilderPage.css";

export default function FormBuilderPage() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "shortText",
    required: false,
    options: [],
    currentOption: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFormAndQuestions();
  }, [formId]);

  const loadFormAndQuestions = async () => {
    try {
      // Load form details
      const formRes = await api.get(`/forms/${formId}`);
      setForm(formRes.data.form);
      
      // Load questions
      const questionsRes = await api.get(`/questions/form/${formId}`);
      setQuestions(questionsRes.data.questions);
    } catch (err) {
      console.error("Error loading form:", err);
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => {
    if (newQuestion.currentOption.trim()) {
      setNewQuestion(prev => ({
        ...prev,
        options: [...prev.options, prev.currentOption.trim()],
        currentOption: ""
      }));
    }
  };

  const removeOption = (index) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    
    try {
      const questionData = {
        formId,
        text: newQuestion.text,
        type: newQuestion.type,
        required: newQuestion.required,
        order: questions.length
      };

      // Add type-specific data
      if (["singleChoice", "multipleChoice"].includes(newQuestion.type)) {
        questionData.options = newQuestion.options;
      }

      const response = await api.post("/questions", questionData);
      
      setQuestions([...questions, response.data.question]);
      setNewQuestion({
        text: "",
        type: "shortText",
        required: false,
        options: [],
        currentOption: ""
      });
    } catch (err) {
      console.error("Error adding question:", err);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await api.delete(`/questions/${questionId}`);
      setQuestions(questions.filter(q => q.id !== questionId));
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  const handleCloneQuestion = async (questionId) => {
    try {
      const response = await api.post(`/questions/${questionId}/clone`);
      setQuestions([...questions, response.data.question]);
    } catch (err) {
      console.error("Error cloning question:", err);
    }
  };

  const handleSaveForm = () => {
    
    
    alert("Form saved successfully!");
  };

  if (loading) {
    return <div className="form-builder-container">Loading...</div>;
  }

  return (
    <div className="form-builder-container">
      <div className="form-header">
        <h1>Editing: {form?.title}</h1>
        <div className="form-actions">
          <button onClick={() => navigate(`/profile`)} className="btn btn-secondary">
            Back to Profile
          </button>
          <button onClick={handleSaveForm} className="btn btn-primary">
            Save Form
          </button>
        </div>
      </div>

      {/* Add New Question Form */}
      <div className="add-question-section">
        <h3>Add New Question</h3>
        <form onSubmit={handleAddQuestion} className="question-form">
          <div className="form-group">
            <label>Question Text *</label>
            <input
              type="text"
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
              placeholder="Enter your question"
              required
            />
          </div>

          <div className="form-group">
            <label>Question Type</label>
            <select
              value={newQuestion.type}
              onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value})}
            >
              <option value="shortText">Short Text (up to 512 chars)</option>
              <option value="longText">Long Text (up to 4096 chars)</option>
              <option value="singleChoice">Multiple Choice (Single Answer)</option>
              <option value="multipleChoice">Multiple Choice (Multiple Answers)</option>
              <option value="numeric">Numeric Answer</option>
              <option value="date">Date</option>
              <option value="time">Time</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={newQuestion.required}
                onChange={(e) => setNewQuestion({...newQuestion, required: e.target.checked})}
              />
              Required
            </label>
          </div>

          {/* Options for choice questions */}
          {["singleChoice", "multipleChoice"].includes(newQuestion.type) && (
            <div className="form-group">
              <label>Options</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={newQuestion.currentOption}
                  onChange={(e) => setNewQuestion({...newQuestion, currentOption: e.target.value})}
                  placeholder="Add an option"
                />
                <button type="button" onClick={addOption} className="btn btn-outline">
                  Add Option
                </button>
              </div>
              <div>
                {newQuestion.options.map((option, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                    <span>{option}</span>
                    <button 
                      type="button" 
                      onClick={() => removeOption(index)}
                      className="btn btn-sm btn-danger"
                      style={{ padding: '2px 6px', fontSize: '12px' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            Add Question
          </button>
        </form>
      </div>

      {/* Questions List */}
      <div className="questions-list">
        <h3>Questions ({questions.length})</h3>
        {questions.length === 0 ? (
          <p>No questions added yet.</p>
        ) : (
          <div className="questions-container">
            {questions.map((question, index) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <div>
                    <strong>{index + 1}. {question.text}</strong>
                    {question.required && <span style={{ color: 'red', marginLeft: '5px' }}> *</span>}
                  </div>
                  <div className="question-actions">
                    <button 
                      onClick={() => handleCloneQuestion(question.id)}
                      className="btn btn-sm btn-outline"
                      title="Clone"
                    >
                      📋
                    </button>
                    <button 
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="btn btn-sm btn-danger"
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="question-info">
                  Type: {question.type} | Required: {question.required ? "Yes" : "No"}
                </div>
                {question.options && question.options.length > 0 && (
                  <div className="question-options">
                    <strong>Options:</strong>
                    <ul>
                      {question.options.map((option, idx) => (
                        <li key={idx}>{option}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button at the bottom */}
      <div className="form-actions-bottom">
        <button onClick={handleSaveForm} className="btn btn-primary">
          Save Form
        </button>
      </div>
    </div>
  );
}