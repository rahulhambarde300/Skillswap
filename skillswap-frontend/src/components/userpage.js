"use client";
import Link from "next/link";
import Slider from "@/components/layout/sidebar";
import CircularProgress from "@mui/joy/CircularProgress";
import TopTabBar from "@/components/layout/tab";
import { useParams, useRouter } from "next/navigation";
import Post from "./post";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import ProfileComponent from "./profiles";

export default function UserPage() {
  const [content, setContent] = useState(false);
  const [imageSrc, setImageSrc] = useState();
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [state, setState] = useState(true);
  const [distance, setDistance] = useState(2);
  const [username, setUsername] = useState();
  const router = useRouter();

  useEffect(() => {
    fetchContent();
  }, []);

  const [skillFilter, setSkillFilter] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [skillArray, setSkillArray] = useState([]);
  const [postArray, setPostArray] = useState([]);

  let dataFetched = {};

  useEffect(() => {
    fetchPosts();
  }, [skillFilter]);
  useEffect(() => {
    fetchSkills();
    fetchProfiles();
  }, []);

  useEffect(() => {
    const delayFetchUsers = setTimeout(async () => {
      try {
        fetchProfiles();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 500);
    return () => clearTimeout(delayFetchUsers);
  }, [distance, skillFilter]);

  async function fetchProfiles() {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          `/user/getUsersByLocationAndSkillId?range=${distance}&skillId=${skillFilter}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();
      console.log(data);
      const profilesWithPictures = await fetchProfilePictures(data);
      setProfiles(profilesWithPictures);
      setContent(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function fetchProfilePictures(profiles) {
    const profilesWithPictures = await Promise.all(
      profiles.map(async (profile) => {
        const imageUrl = await imageURL(profile.profilePictureName);
        return { ...profile, imageUrl };
      })
    );
    return profilesWithPictures;
  }

  async function imageURL(file) {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/user/profilePicture/${file}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (!response.ok) {
      // If image is not found, return a placeholder image URL
      return "https://www.svgrepo.com/show/209349/user-avatar.svg/";
    }

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    return imageUrl;
  }

  const handleFilter = (event) => {
    setSkillFilter(event.target.value);
  };

  async function fetchSkills() {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/user/test`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (res.ok) {
      const resGet = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL + `/user/getSkills`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (resGet.ok) {
        const json = await resGet.json();
        const newArray = [];

        json.forEach((element) => {
          const skillId = element.skillId;
          const skillName = element.skillName;

          const newSkill = { skillId: skillId, skillName: skillName };
          newArray.push(newSkill);
        });

        setSkillArray(newArray);
      }
    } else {
      router.push(`/signin`);
    }
  }

  function receivedState(receivedstate) {
    if (receivedstate === 1) {
      setState(true);
    } else {
      setState(false);
    }
  }

  async function fetchPosts() {
    const queryParam = skillFilter === "" ? "" : "?skillId=" + skillFilter;
    const resGet = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
        `/user/post/getPosts` +
        queryParam,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    if (resGet.ok) {
      const json = await resGet.json();
      dataFetched = json;
      const newArray = [];

      json.forEach((element) => {
        const name = element.user.firstName + " " + element.user.lastName;
        const email = element.user.email;
        const content = element.content;
        const skillId = element.skill.skillId;
        const postId = element.postId;
        const createDate = element.createdAt;

        const newPost = {
          name: name,
          email: email,
          content: content,
          skillId: skillId,
          postId: postId,
          createDate: createDate,
          email: email,
        };
        newArray.push(newPost);
      });
      // Sort newArray based on createDate in descending order
      newArray.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

      setPostArray(newArray);
    }
  }

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
        setUsername(json.firstName);
        setUserId(json.id);
        setUserEmail(json.email);
        fetchImage(json.profilePictureName);
      }
    } else {
      router.push(`/`);
    }
  }

  const fetchImage = async (props) => {
    try {
      // Fetch image from backend (replace 'YOUR_IMAGE_ENDPOINT' with your actual image endpoint)
      const response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
          `/user/profilePicture/${props}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.ok) {
        // Convert response to blob
        const imageBlob = await response.blob();
        // Create object URL for the blob
        const imageUrl = URL.createObjectURL(imageBlob);
        setImageSrc(imageUrl);
      } else {
        console.error("Failed to fetch image:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleAddPost = () => {
    router.push(`/add_post/${username + ";" + userId}`);
  };

  const handleDeletePost = async (postId) => {

    try {
      const deleteUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/user/post/deletePost";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const data = postId;

      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Post deleted successfully");
        const updatedPosts = postArray.filter(post => post.postId !== postId);
        setPostArray(updatedPosts);

      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };


  return (
    <>
      {content && (
        <>
          <Slider username={username} image={imageSrc}>
            <TopTabBar sendState={receivedState}>
              {state && (
                <>
                  <div className="flex h-full ">
                    <h1 className="text-3xl grow">
                      <div style={{ marginTop: "25px" }}>
                        <Grid
                          container
                          spacing={2}
                          height={100}
                          paddingX={{ xs: 3, sm: 5, md: 24 }}
                        >
                          <Grid item xs={4}>
                            <Box
                              sx={{ minWidth: 120, maxWidth: 250 }}
                              className="bg-white"
                            >
                              <FormControl fullWidth>
                                <InputLabel>Skill</InputLabel>
                                <Select
                                  value={skillFilter}
                                  label="Skill"
                                  onChange={handleFilter}
                                >
                                  <MenuItem key={-1} value="">
                                    None
                                  </MenuItem>
                                  {Array.from(skillArray).map((_, index) => (
                                    <MenuItem
                                      key={index}
                                      value={skillArray[index].skillId}
                                    >
                                      {skillArray[index].skillName}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Box>
                          </Grid>
                          <Grid item xs={4}></Grid>
                          <Grid
                            container
                            item
                            xs={4}
                            alignSelf={"flex-start"}
                            justifyContent="flex-end"
                            paddingRight={{ xs: 3, sm: 5, md: 2 }}
                          >
                            <Button
                              variant="outlined"
                              className="bg-white"
                              onClick={handleAddPost}
                            >
                              Create a post
                            </Button>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          spacing={{ xs: 2, md: 3 }}
                          columns={{ xs: 4, sm: 8, md: 12 }}
                          paddingX={{ xs: 3, sm: 5, md: 24 }}
                        >
                          {Array.from(postArray).map((_, index) => (
                            <Grid
                              item
                              xs={2}
                              sm={4}
                              md={4}
                              key={index}
                              className="group cursor-pointer"
                            >
                              <div className="bg-teal-300 rounded-md">
                                <div className="transform transition-transform duration-300  hover:-translate-y-2 group-hover:shadow-md">
                                  {/* Apply transform and shadow effect on hover */}
                                  <Post params={postArray[index]}
                                        showDeleteOption={true}
                                        onDelete={handleDeletePost}
                                        signedUserEmail={userEmail}></Post>
                                </div>
                              </div>
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                    </h1>
                  </div>
                </>
              )}
              {!state && <ProfileComponent profiles={profiles} setDistance={setDistance} skillFilter={skillFilter} skillArray={skillArray} distance={distance} handleFilter={handleFilter}/>}
            </TopTabBar>
          </Slider>
        </>
      )}
      {!content && (
        <div className="flex h-screen ">
          <h1 className="m-auto text-3xl">
            <CircularProgress />
          </h1>
        </div>
      )}
    </>
  );
}
