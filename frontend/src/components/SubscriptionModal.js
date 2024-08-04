import React, { useState } from 'react';
import { Button } from './ui/button';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const SubscriptionModal = ({ onClose, onSubscriptionUpdate }) => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const priceId = selectedPlan === 'yearly' ? 'price_1Pis9iHAfivlkvgP4kqn2vWM' : 'price_1Pis9wHAfivlkvgPlnwgoOBF';
      const response = await axios.post(`${API_URL}/api/create-checkout-session`, 
        { priceId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      const { sessionId } = response.data;
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-4">Premium</h2>
        <h3 className="text-xl font-bold mb-2">Start writing like a PRO!</h3>
        <p className="text-gray-600 mb-4">Get full access to InboxAI's powerful AI technology:</p>
        
        <ul className="space-y-2 mb-6">
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Unlimited Email Requests
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Advanced Claude 3.5 Sonnet Model
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            99.9% Plagiarism-Free Text
          </li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
  <div 
    className={`flex-1 border-2 rounded-lg p-4 cursor-pointer transition-all ${
      selectedPlan === 'monthly' 
        ? 'border-black bg-gray-200' 
        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-100'
    }`}
    onClick={() => setSelectedPlan('monthly')}
  >
    <div className="font-semibold">Monthly</div>
    <div className="text-xl font-bold">$9.99 /month</div>
  </div>
  <div 
    className={`flex-1 border-2 rounded-lg p-4 cursor-pointer transition-all ${
      selectedPlan === 'yearly' 
        ? 'border-black bg-gray-300' 
        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-100'
    } relative overflow-hidden`}
    onClick={() => setSelectedPlan('yearly')}
  >
    <div className="absolute top-0 right-0 bg-black text-white text-xs font-semibold px-2 py-1 transform translate-x-[2px] translate-y-[-2px]">
      Save 58%
    </div>
    <div className="font-semibold">Yearly</div>
    <div className="text-xl font-bold">$4.17 /month</div>
    <div className="text-sm text-gray-500">Billed as $49.99 per year</div>
  </div>
</div>

            <button
      onClick={handleSubscribe}
      disabled={isLoading}
      className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
    >
      {isLoading ? 'Processing...' : 'Subscribe Now'}
    </button>
        
        <div className="flex flex-wrap justify-between text-sm text-gray-500 mt-4">
          <a href="#" className="hover:underline mr-2 mb-2">Terms of Use</a>
          <a href="#" className="hover:underline mr-2 mb-2">Privacy Policy</a>
          <a href="#" className="hover:underline mb-2">Restore Purchases</a>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
