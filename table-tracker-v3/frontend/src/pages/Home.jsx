import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Table Tracker
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional Snooker & Pool Table Management System
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Snooker Tables
            </h2>
            <p className="text-gray-600 mb-6">
              Manage 3 professional snooker tables with real-time billing
            </p>
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Access Snooker Tables
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Pool Tables
            </h2>
            <p className="text-gray-600 mb-6">
              Manage 3 professional pool tables with real-time billing
            </p>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Access Pool Tables
            </Link>
          </div>
        </div>
        
        <div className="mt-12 text-gray-500">
          <p>Login required for table management</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
