import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/', {
          headers: {
            Authorization: `Bearer ${document.cookie.accessToken}`,  // Pass the access token here
          },
        });
        setUser(response.data.user);
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      }
    };
    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>Full Name: {user.fullName}</p>
      <p>Email: {user.email}</p>
      <p>Age: {user.age}</p>
    </div>
  );
};

export default Home;
