import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className='flex items-center justify-center h-screen'>

      <div className='flex flex-col items-center gap-4 justify-center bg-white p-8 w-96 rounded-xl shadow-lg'>
        <h2 className='text-3xl font-extrabold text-blue-800'>Login</h2>
        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700'>Username</label>
          <input
            type='text'
            className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500'
          />
        </div>
        <div className='w-full'>
          <label className='block text-sm font-medium text-gray-700'>Password</label>
          <input
            type='password'
            className='mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500'
          />
        </div>
        <button className='bg-blue-500 hover:bg-blue-600 text-white w-full p-2 rounded-lg focus:outline-none'>
          Login
        </button>
        <p className='mt-3 text-gray-600'>
          Don't have an account?{' '}
          <Link to='/signup' className='text-blue-500 hover:underline'>
            Sign up 
          </Link>
        </p>
      </div>

    </div>
  );
};

export default Login;
