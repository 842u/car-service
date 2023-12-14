'use client';

import React, { useState } from 'react';

import { ToggleVisibilityButton } from '../ToggleVisibilityButton/ToggleVisibilityButton';

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
        <ToggleVisibilityButton
          className="absolute h-full"
          isVisible={isPasswordVisible}
          onClick={togglePasswordVisibility}
        />
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
}
