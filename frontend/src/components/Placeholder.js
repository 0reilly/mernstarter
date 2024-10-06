import React from 'react';

const Placeholder = ({ title, description }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Placeholder;
