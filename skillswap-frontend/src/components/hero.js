"use client"; // This is a client component 👈🏽
import { useRouter } from "next/navigation";
import Link from "next/link";
import Desktop from "../../public/desktop.png";

import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function Hero(props) {
  const [password, setPassword] = useState("");
  const [checkif, setCheckif] = useState(false);
  const [value, setValue] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();


  return (
    <>
      <div className="grid grid-cols-2  lg:px-8 h-screen">
        <div className=" m-auto ">
          <h2 className=" text-6xl font-bold leading-9 tracking-tight text-black">
            Skill Swap
          </h2>
          <h2 className="m-8 text-4xl font-bold leading-9 tracking-tigh text-teal-400">
            Swap the right Skill , right away
          </h2>
        </div>
        <div className="flex justify-center py-16 px-10">
          <Image src={Desktop} height={400} width={500}
            alt={`Hero homepage IMage`}/>
        </div>
      </div>
    </>
  );
}
