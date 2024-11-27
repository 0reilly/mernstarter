import React from 'react';

const Select = ({ label, options = [], className = '', ...props }) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
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
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select; 