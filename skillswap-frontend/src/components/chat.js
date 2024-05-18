"use client";

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";

export default function Chat(){
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState(" ");
    const [email, setEmail] = useState(" ");

    useEffect(() => {
        fetchContent();
      }, []);
    
      //Fetch user details to check DB
      async function fetchContent() {
        const res = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/test",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        if (res.ok) {
          const resGet = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/details",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          );
    
          if (resGet.ok) {
            const json = await resGet.json();
            setFirstName(json.firstName);
            setLastName(json.lastName);
            setEmail(json.email);
          }
        } else {
          router.push(`/`);
        }
      }
    return(
        <>Works</>
    );
}