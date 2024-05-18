"use client";

// Import necessary dependencies
import { useEffect, useState,  } from "react";
import { useParams, useRouter } from "next/navigation";

// Fetch skills from the provided endpoint with headers


// Functional component
export default function EditSkills({sendSkills, sendDataToParent}) {
  const router = useRouter();
  const [userSkills, setUserSkills] = useState([]);
  // State for search query
  const [query, setQuery] = useState("");

  function sendingSkills()
  {
    sendSkills(selectedSkills);
  }

  // State for skills list
  const [skills, setSkills] = useState([]);

  // State for selected skills

  const [currentUserSkills, setCurrentUSerSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Fetch skills on component mount

  const fetchSkills = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/getSkills";
  
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
  
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: headers,
    });
  
    const skills = await response.json();
     setSkills(skills);
  };

    useEffect(() => {
      fetchSkills();
      fetchUserSkills();
    }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const fetchUserSkills = async () => {
    const resGetSKills = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/getUserSkills",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (resGetSKills.ok) {
      const skills = await resGetSKills.json();
       const currentUserSkills = skills.map((data) => data.skill)
       setCurrentUSerSkills(currentUserSkills);
    } else {
      router.push(`/`);
    }
  };

    console.log("how many times this is running bitch");

  // Handle skill selection
  const handleSkillSelect = (skill) => {
    // Check if the skill is already selected
    if (
      !selectedSkills.some(
        (selectedSkill) => selectedSkill.skillId === skill.skillId
      )
    ) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Handle removing selected skill
  const handleRemoveSkill = (skill) => {
    const updatedSkills = selectedSkills.filter(
      (selectedSkill) => selectedSkill.skillId !== skill.skillId
    );
    setSelectedSkills(updatedSkills);
  };


  // Function to send selected skills to the server
  const sendUserSkills = async () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/addUserSkills";

      
  const user_Skills = selectedSkills.map((skill) => skill.skillName); //[skill1, skill2,SKill-3 ] so remove Skill-1 
  console.log(user_Skills);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(user_Skills),
      });

      if (response.ok) {
        console.log("User skills added successfully");
      } else {
        console.error("Failed to add user skills");
      }
    } catch (error) {
      console.error("Error sending user skills:", error);
    }
  };

  // Submit function
  const handleSubmit = () => {
    sendUserSkills();
    sendingSkills();
    sendDataToParent(false);
    location.reload();
  };

  const currentids = currentUserSkills.map(e => e.skillId)
  const selectedids = selectedSkills.map(e => e.skillId)
  // Filter skills based on search query
// console.log(skills);
// console.log(selectedids);
let filteredSkills= skills.filter((skill) =>
    skill.skillName.toLowerCase().includes(query.toLowerCase())
  );

  filteredSkills = filteredSkills.filter((skill) =>
  !currentids.includes(skill.skillId));

  filteredSkills = filteredSkills.filter((skill) =>
  !selectedids.includes(skill.skillId));

  return (
    <div className=" w-1/3 h-3/4 mx-auto my-28 bg-gray-100 p-4 rounded-lg shadow-md">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-center text-indigo-500 mb-4">
        Add Your Skills
      </h1>

      {/* Line below header */}
      <div className="border-b border-gray-300 mb-4"></div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search skills..."
        value={query}
        onChange={handleSearchChange}
        className="w-full border p-2 mb-4 bg-gray-200 text-black rounded-xl"
      />

      {/* Selected skills */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Selected Skills</h3>
        {selectedSkills.map((skill) => (
          <button
            key={skill.skillId}
            onClick={() => handleRemoveSkill(skill)}
            className="mr-2 mb-2 bg-green-500 text-white p-2 rounded"
          >
            {skill.skillName}
          </button>
        ))}
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="bg-purple-500 text-white p-2 rounded w-full"
      >
        Submit
      </button>

      {/* Add space between search results and submit button */}
      <div className="mb-8"></div>

      {/* Search results */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Search Results</h3>
        {filteredSkills.map((skill) => (
          <button
            key={skill.skillId}
            onClick={() => handleSkillSelect(skill)}
            className="mr-2 mb-2 bg-blue-500 text-white p-2 rounded"
          >
            {skill.skillName}
          </button>
        ))}
      </div>
    </div>
  );
}
