'use client';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

export default function AuthForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((currentState) => !currentState);
  };

  const submitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <form className="flex flex-col" onSubmit={submitHandler}>
      <h1>Hello</h1>
      <label htmlFor="email">
        Email
        <input
          required
          id="email"
          placeholder="Enter your email."
          type="email"
        />
      </label>
      <div className="relative">
        <label htmlFor="password">
          Password
          <input
            required
            id="password"
            placeholder="Enter your password."
            type={isPasswordVisible ? 'text' : 'password'}
          />
        </label>
        <button
          className="absolute aspect-square h-full"
          type="button"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
}
