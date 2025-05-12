import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory

const Sentiment = () => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [sentiment, setSentiment] = useState('');

  const navigate = useNavigate();  // useNavigate replaces useHistory

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = getCookie('accessToken');  // Get the token from cookies

      if (!accessToken) {
        console.error('No access token found!');
        setLoading(false);
        return;
      }

    try {
      // POST request to the backend
      const response = await api.post('/sentiments/sentiment', {text}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        } 
      });
      setSentiment(response.data.sentiment);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      <h2>Sentiment</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {sentiment && <div style={{ color: 'white' }}>{sentiment}</div>}
    </div>
  );
};

export default Sentiment;