"use client";
import LoginForm from "@/components/loginform";
import Header from "@/components/layout/header";
import { useRouter } from "next/navigation";

import Image from "next/image";
import HomePage from "../../public/homepage_image.webp";

import { useEffect, useState } from "react";

export default function LandingPage() {
  const props = "This is props";
  const [count, setCount] = useState(0);
  const router = useRouter();


  let features = [
    { name: "Matchmaking", value: true },
    { name: "Profiles", value: false },
    { name: "Swiping", value: false },
    { name: "Nearby", value: false },
    { name: "Exchange", value: false },
    { name: "Learning", value: false },
    { name: "Community", value: false },
    { name: "Verification", value: false },
    { name: "Messaging", value: false },
    { name: "Privacy", value: false },
    { name: "Security", value: false },
    { name: "Diversity", value: false },
    { name: "Networking", value: false },
    { name: "Events", value: false },
    { name: "Collaboration", value: false },
  ];

  return (
    <>
      <div className="grid grid-cols-2 bg-gray-100 ">
        <div className="p-8">
          <p className="text-gray-600 m-6 font-bold text-4xl ">
            The world of Skill-Swap
          </p>
          <ul>
            <li>
              <h2 className="text-gray-600 font-bold text-xl m-8">
                Discover a World of Skills
              </h2>
              <p className="text-gray-500 text-lg mx-12">
                Explore a diverse range of skills from coding and cooking to
                photography and languages. Connect with people from various
                backgrounds and expertise levels, enriching your learning
                experience.
              </p>
            </li>
            <li>
              <h2 className="text-gray-600 font-bold text-xl m-8">
                Discover a World of Skills
              </h2>
              <p className="text-gray-500 text-lg mx-12">
                Explore a diverse range of skills from coding and cooking to
                photography and languages. Connect with people from various
                backgrounds and expertise levels, enriching your learning
                experience.
              </p>
            </li>
            <li>
              <h2 className="text-gray-600 font-bold text-xl m-8">
                Discover a World of Skills
              </h2>
              <p className="text-gray-500 text-lg mx-12">
                Explore a diverse range of skills from coding and cooking to
                photography and languages. Connect with people from various
                backgrounds and expertise levels, enriching your learning
                experience.
              </p>
            </li>
          </ul>
        </div>
        <div>
          <Image
            className="p-2 m-4"
            src={HomePage}
            width={1000}
            height={1000}
            alt={`Landing page World of skill-swap`}
          />
        </div>
      </div>

      <div className=" bg-blue-50 h-screen m-auto flex justify-center items-center">
        <div className="py-8 px-8 ">
          <a className="text-gray-600 m-8 font-bold text-4xl ">
            What skill-Swap has to offer?
          </a>
          <ul className="grid grid-cols-7 flex-wrap my-8 mx-4">
            {features.map((data) => (
              <>
                {data.value && (
                  <li
                    key={data.name}
                    className={`p-4 animate-pulse m-4 border border-gray-300 shadow-sm rounded-xl bg-blue-50 hover:bg-sky-100`}
                  >
                    <p className=" flex justify-center text-gray-500 hover:text-black font-semibold  ">
                      {data.name}
                    </p>
                  </li>
                )}
                {!data.value && (
                  <li
                    key={data.name}
                    className={`p-4 animate-none m-4 border border-gray-300 shadow-sm rounded-xl bg-blue-50 hover:bg-sky-100`}
                  >
                    <p className=" flex justify-center text-gray-500 hover:text-black font-semibold  ">
                      {data.name}
                    </p>
                  </li>
                )}
              </>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
