"use client";

import { useRouter } from 'next/navigation'
import Post from './post';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';



export default function ExplorePage() {
    const router = useRouter();
  
    const [skillFilter, setSkillFilter] = useState('');
    const [skillArray, setSkillArray] = useState([]);
    const [postArray, setPostArray] = useState([]);

    let dataFetched = {};

    useEffect(() => {
        fetchPosts();
      }, [skillFilter]);
    useEffect(() => {
      fetchSkills();
    }, []);

    const handleFilter = (event) => {
      setSkillFilter(event.target.value);
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
    
    async function fetchPosts() {
        const queryParam = skillFilter === "" ? "" : "?skillId="+skillFilter;
        const resGet = await fetch(process.env.NEXT_PUBLIC_BACKEND_BASE_URL+`/user/post/getPosts`+queryParam, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (resGet.ok) {
          const json = await resGet.json();
          dataFetched = json;
          const newArray = [];

          json.forEach(element => {
              const name = element.user.firstName + " " + element.user.lastName;
              const content = element.content;
              const skillId = element.skill.skillId;
              const createDate = element.createdAt;

              const newPost = {name:name, content:content, skillId: skillId, createDate: createDate};
              newArray.push(newPost);
          });
          
          setPostArray(newArray);

        }
      }

    return(
       <div>
            <Grid container spacing={2} height={100} paddingX={{ xs: 3, sm: 5, md: 24}}>
              <Grid item xs={4}>
                <Box sx={{ minWidth: 120, maxWidth: 250}}>
                  <FormControl fullWidth>
                    <InputLabel>Skill</InputLabel>
                    <Select
                      value={skillFilter}
                      label="Skill"
                      onChange={handleFilter}
                    >
                      
                      {Array.from(skillArray).map((_, index) => (
                          <MenuItem key={index} value={skillArray[index].skillId}>{skillArray[index].skillName}</MenuItem>
                      ))}
                      <MenuItem key={-1} value="">
                        <em>None</em>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={4}>
                
              </Grid>
              <Grid container item xs={4} alignSelf={'flex-start'} justifyContent="flex-end" paddingRight={{ xs: 3, sm: 5, md: 2}}>
                <Button variant="outlined">Create a post</Button>
              </Grid>
            </Grid>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} paddingX={{ xs: 3, sm: 5, md: 24}}>
                {Array.from(postArray).map((_, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index} >
                        <Post params={postArray[index]}
                                        showDeleteOption={true}
                                        onDelete={handleDeletePost}
                                        signedUserEmail={userEmail}></Post>
                    </Grid>
                ))}
            </Grid>
       </div>
    )
}