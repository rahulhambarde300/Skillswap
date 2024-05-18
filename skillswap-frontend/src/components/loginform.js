"use client"; // This is a client component 👈🏽
import { useRouter } from "next/navigation";
import Link from "next/link";
import closeEye from "../../public/closeeye.svg";
import openEye from "../../public/openeye.svg";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function LoginForm(props) {
  const [password, setPassword] = useState("");
  const [checkif, setCheckif] = useState(false);
  const [value, setValue] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      localStorage.removeItem("token");
      router.push(`/signin`);
    }
  }, []);

  async function AddLogin(e) {
    e.preventDefault();
    let email = value;

    console.log(
      JSON.stringify({
        email: email,
        password: password,
      })
    );

    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.ok) {
      const json = await res.json();
      localStorage.setItem("token", json.token);
      props.getToken(json.token);
      setToken(json.token);
    } else {
      alert("Invalid email/password!");
    }

    if (res.ok) {
      router.push(`./userpage/${value}`);
    }
  }

  function seePassword(event) {
    event.preventDefault();
    if (checkif == true) setCheckif(false);
    if (checkif == false) setCheckif(true);
  }
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>

          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={AddLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    placeholder="   e-mail"
                    value={value}
                    onChange={(e) => {
                      setValue(e.currentTarget.value);
                    }}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="/forgotpassword"
                      className="font-semibold text-indigo-600 hover:text-indigo-400"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
              </div>

              <>
                {checkif ? (
                  <div>
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
                      onClick={seePassword}
                      className="relative bottom-7 left-80"
                    >
                      <Image
                        src={openEye}
                        width={20}
                        height={20}
                        alt={`open-eye`}
                      />
                    </button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <input
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      type="password"
                      placeholder="   Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.currentTarget.value);
                      }}
                      required
                    />
                    <button
                      onClick={seePassword}
                      className="relative bottom-7 left-80"
                    >
                      <Image
                        src={closeEye}
                        width={20}
                        height={20}
                        alt={`close-eye`}
                      />
                    </button>
                  </div>
                )}
              </>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?&nbsp;
              <Link
                href="/signup"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Create your account now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
