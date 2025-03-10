import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Card from './ui/Card';
import { FaUser } from 'react-icons/fa';

/**
 * LLM IMPLEMENTATION GUIDE
 * 
 * This is a modular Home component with clearly defined extension points.
 * Structure:
 * 1. Sections are separated into their own components for easier maintenance
 * 2. Each section uses Card components for consistent styling
 * 3. Extension points are clearly marked with comments
 * 4. The component handles loading states and different user scenarios
 */

const Home = () => {
  const { appId } = useParams();
  const location = useLocation();
  const mode = location.pathname.includes('preview') ? 'preview' : 'live';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card 
        className="mb-4" 
        title="Welcome to Your Project" 
        icon={<FaUser className="text-green-500" />}
        subtitle={`${mode === 'preview' ? 'Preview' : 'Published'} project${appId ? ` #${appId}` : ''}`}
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
          <p className="mb-3">
            Welcome to your project dashboard. Here you can build your application without writing any code:
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Add new features to your application</li>
            <li>Customize your project's appearance</li>
            <li>Set up connections to your data</li>
            <li>Configure your project settings</li>
          </ul>
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> Start with one simple feature and gradually build up your project over time.
            </p>
          </div>
        </div>
      </Card>
      
      {/* EXTENSION POINT: Add additional sections here */}
      {/* Additional sections can be added here as needed */}
    </div>
  );
};

export default Home;