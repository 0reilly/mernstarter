import React from 'react';

const Input = ({ label, type = 'text', className = '', ...props }) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full
          px-4
          py-2
          text-base
          bg-white
          border
          border-gray-300
          rounded-md
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          transition
          duration-150
          ease-in-out
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

export default Input; 