import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

// Helper function to get the value of a specific cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = getCookie('accessToken');  // Get the token from cookies

      if (!accessToken) {
        console.error('No access token found!');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/users/profile', {  // Ensure the correct endpoint is used
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response);
        setUser(response.data.user);
        // console.log(user)
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch user profile', err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);  // Empty dependency array to run only once (componentDidMount)

  // Show loading message while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user data is not found, show an appropriate message
  if (!user) {
    return <div>No user data available.</div>;
  }else{
    console.log(user)
  }

  const navigateToSent =()=>{
    navigate('/sentiments/sentiment');
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>Full Name: {user.fullName}</p>
      <p>Email: {user.email}</p>
      <p>Age: {user.age}</p>
      <button onClick={navigateToSent} >Get Sentiment</button>
    </div>
  );
};

export default Home;
