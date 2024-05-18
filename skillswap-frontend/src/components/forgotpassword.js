"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import '../app/global.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  async function handleSubmit(e)  {
    e.preventDefault();
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL+ "/user/auth/forgotPassword", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email}),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        setMessage('Password reset url sent!');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl text-center">Forgot your password?</h2>
        <p className="mt-6 text-lg leading-8 text-gray-500 text-center">
          Enter your email address used during sign up.
        </p>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex justify-center">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="rounded-md border-0 bg-black/5 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              placeholder="example@example.com"
              required
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="ml-2 rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-green-500 font-bold text-center">{message}</p>}
      </div>
    </div>
)
}

