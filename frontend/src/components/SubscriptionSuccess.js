import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const SubscriptionSuccess = ({ onSubscriptionUpdate }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/subscription-status`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('Subscription status in SubscriptionSuccess:', response.data);
        if (response.data.isSubscribed) {
          onSubscriptionUpdate();
          navigate('/');
        } else {
          console.error('Subscription not confirmed');
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
        navigate('/');
      }
    };

    checkSubscriptionStatus();
  }, [onSubscriptionUpdate, navigate]);

  return <div>Processing your subscription...</div>;
};

export default SubscriptionSuccess;