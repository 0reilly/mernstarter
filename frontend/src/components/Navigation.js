import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul className="flex space-x-4">
        <li>
          <NavLink to="/" className={({ isActive }) => 
            `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`
          }>Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/feature1" className={({ isActive }) => 
            `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`
          }>Feature 1</NavLink>
        </li>
        <li>
          <NavLink to="/feature2" className={({ isActive }) => 
            `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-200'}`
          }>Feature 2</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
