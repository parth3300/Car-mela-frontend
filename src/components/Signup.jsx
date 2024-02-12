import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignup = () => {
    // Implement signup logic here
    console.log('Signing up with:', { username, password });
  };

  return (
    <div className="flex items-center  justify-center h-screen">
      <div className="flex flex-col items-center gap-4 justify-center bg-white p-8 w-96 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-blue-800">Sign Up</h2>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleSignup}
          className="bg-blue-500 hover:bg-blue-600 text-white w-full p-2 rounded-lg focus:outline-none"
        >
          Sign up
        </button>
        <p className="mt-3 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login 
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
