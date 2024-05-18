"use client"; // This is a client component 👈🏽
import Link from "next/link";
import closeEye from "../../public/closeeye.svg";
import openEye from "../../public/openeye.svg";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pincode, setPincode] = useState("");
  const [checkif, setCheckif] = useState(false);
  const router = useRouter();

  const [token, setToken] = useState("");

  function seePassword() {
    if (checkif == true) setCheckif(false);
    if (checkif == false) setCheckif(true);
  }

  useEffect(() => {
    localStorage.removeItem("token");
    router.push(`/signup`);
  }, []);
  async function AddLogin(e) {
    e.preventDefault();

    let data = {
      firstName: firstName,
      lastName: lastName,
      mobile: mobile,
      email: email,
      pincode: pincode,
      password: password,
    };

    console.log(JSON.stringify(data));

    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL+"/user/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
        email: email,
        pincode: pincode,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const json = await res.json();
      localStorage.setItem("token", json.token);
      setToken(json.token);
      console.log(json.token);
      router.push(`/add_skills/${email}`);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <p className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create your account
          </p>


        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
          <form className="space-y-2" onSubmit={AddLogin}>
            <div>
              <div className="grid grid-cols-2">
                <div>
                  <label
                    htmlFor="first name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    First Name
                  </label>
                  <input
                    className="block mt-2 w-3/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.currentTarget.value);
                    }}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="last name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Last Name
                  </label>
                  <input
                    className="block mt-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.currentTarget.value);
                    }}
                    required
                  />
                </div>
              </div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 mt-2 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.currentTarget.value);
                  }}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <label
              htmlFor="phone number"
              className="block text-sm font-medium leading-6  text-gray-900"
            >
              Phone no.
            </label>
            <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              type="mobile"
              placeholder="Phone. no"
              value={mobile}
              onChange={(e) => {
                setMobile(e.currentTarget.value);
              }}
              required
            />

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
            </div>

            <>
              {checkif ? (
                <div className="flex flex-row">
                  <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.currentTarget.value);
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={seePassword}
                    className="items-center relative right-8"
                  >
                    <Image src={openEye} alt="open-eye" width={20} height={20} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-row">
                  <input
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.currentTarget.value);
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={seePassword}
                    className="items-center relative right-8"
                  >
                    <Image src={closeEye} alt="close-eye" width={20} height={20} />
                  </button>
                </div>
              )}
            </>
            <label
              htmlFor="pincode"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Pincode
            </label>
            <input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => {
                setPincode(e.currentTarget.value);
              }}
              required
            />

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create the account
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?
            <Link
              href="/"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      </div>
    </>
  );
}
