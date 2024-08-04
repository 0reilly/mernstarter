import React from 'react';

const SegmentedControl = ({ options, value, onChange }) => {
  return (
    <div className="flex rounded-lg bg-gray-100 p-1">
      {options.map((option) => (
        <button
          key={option}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            value === option
              ? 'bg-gray-300 text-gray-800 shadow'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;