'use client'

// Import necessary dependencies
import { useState, useEffect } from 'react';
import {useParams, useRouter} from "next/navigation";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

// Functional component
const AddPosts = () => {

    const router = useRouter();

    const params = useParams();
    const [postContent, setPostContent] = useState('');
    const [skillArray, setSkillArray] = useState([]);
    const [skillFilter, setSkillFilter] = useState('');

     // Function to get current date and time in Atlantic Standard Time
     const getCurrentDateTimeAST = () => {
        const currentDate = new Date();
        const offset = -3; // AST is 3 hours behind UTC
        const utc = currentDate.getTime();
        return new Date(utc + (3600000 * offset)).toISOString();
    };

    let userDetails = params.user;
    userDetails=userDetails.replace("%40", "@");
    userDetails=userDetails.replace("%3B", ";");
    let userId=userDetails.split(";")[1];
    let username = userDetails.split(";")[0];

    
    useEffect(() => {
        fetchSkills();
      }, []);

    const handleFilter = (event) => {
        setSkillFilter(event.target.value);
    };

    const handlePostContent = (event) => {
        setPostContent(event.target.value);
    };

    async function fetchSkills() {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL+`/user/test`, {
          headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (res.ok) {
          const resGet = await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL+`/user/getSkills`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
          if (resGet.ok) {
            const json = await resGet.json();
            const newArray = [];
  
            json.forEach(element => {
                const skillId = element.skillId;
                const skillName = element.skillName;
  
                const newSkill = {skillId:skillId, skillName:skillName};
                newArray.push(newSkill);
            });
            
            setSkillArray(newArray);
  
          }
        } else {
          router.push(`/login`);
        }
    }

    // Function to send selected skills to the server
    const addPost = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + '/user/post/addPost';

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };

        try {
            const currentDateTime = getCurrentDateTimeAST();
            const newPost = {
                "content":postContent,
                "user":{
                    "id":userId,
                    "email":username
                },
                "skill":{
                   "skillId":skillFilter
                },
                "createdAt": currentDateTime
            }
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(newPost),
            });

            if (response.ok) {
                console.log('Post added successfully');
                router.push(`/userpage/${username}`);
            } else {
                console.error('Failed to add post');
            }
        } catch (error) {
            console.error('Error adding post', error);
        }
    };

    // Submit function
    const handleSubmit = () => {
        addPost();
    };

    const handleCancel = () => {
        console.log('Post creation canceled');
        router.push(`/userpage/${username}`);
    }

    return (
        <div className=" max-w-2xl max-h-screen mx-auto my-28 bg-gray-100 p-4 rounded-lg shadow-md">

            {/* Header */}
            <h1 className="text-2xl font-semibold text-center text-indigo-500 mb-4">Create post</h1>

            {/* Line below header */}
            <div className="border-b border-gray-300 mb-4"></div>

            {/* Post content */}
            <TextField fullWidth
                placeholder="Add post (500 characters limit)"
                label="Post content" variant="outlined"
                multiline
                rows={10}
                maxRows={20}
                sx={{marginY: 1}}
                value={postContent}
                onChange={handlePostContent}
                inputProps={{ maxLength: 500 }}
                />

                <FormControl fullWidth sx={{marginY: 1}}>
                    <InputLabel>Skill</InputLabel>
                    <Select
                      value={skillFilter}
                      label="Skill"
                      onChange={handleFilter}
                    >
                      {Array.from(skillArray).map((_, index) => (
                          <MenuItem key={index} value={skillArray[index].skillId}>{skillArray[index].skillName}</MenuItem>
                      ))}
                    </Select>
                </FormControl>

            
            <div className='grid grid-cols-4 gap-4 items-center'>
                <div></div>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white p-2 mt-5 rounded w-full"
                >
                    Submit
                </button>
                <button
                    onClick={handleCancel}
                    className="bg-blue-500 text-white p-2 mt-5 rounded w-full"
                >
                    Cancel
                </button>
                <div></div>
            </div>
            
        </div>
    );
};

export default AddPosts;
