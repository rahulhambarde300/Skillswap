"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from 'react'
import Head from "next/head";
import "../app/global.css";

function ResetPasswordComponenet() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tokenIsValid, setTokenIsValid] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokens = searchParams.get("token");

  useEffect(() => {
    validateToken(); // To do: Handle validate token method as it is being called twice
  });

  const validateToken = async () => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL+`/user/auth/validateToken?token=${tokens}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const message = await response.text();

      if (response.ok && message === "success") {
        setTokenIsValid(true);
      } else if (message === "expired") {
        setMessage("Reset password link expired");
        setTokenIsValid(false);
      } else {
        setMessage("Error validating reset password link");
        setTokenIsValid(false);
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setMessage("Error validating reset password link");
      setTokenIsValid(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (password === "") {
      setMessage("Password Invalid");
      return;
    }

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/user/auth/changePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: tokens, password: password }),
        }
      );

      if (response.ok) {
        setMessage("Password changed successfully");
        setTimeout(() => {
          router.push(`/`);
        }, 2000);
      } else {
        setMessage("Error changing password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Error changing password");
    }
  };

  return (
    <>
      {tokenIsValid === true ? (
        // The reset password form is displayed only if the token is valid
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {/* <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
              /> */}
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Reset your password
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  New Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Confirm Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Reset
                </button>
              </div>
            </form>
            {message && (
              <p className="text-green-500 text-center font-bold">{message}</p>
            )}
          </div>
        </div>
      ) : (
        // This message is shown if the token is invalid or expired.
        <div className="text-center">
          <p className="text-red-500 font-bold">{message}</p>
        </div>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <ResetPasswordComponenet />
    </Suspense>
  )
}