import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { red } from "@mui/material/colors";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import profilePhoto from "../../public/profilePhoto.svg";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Slider from '@mui/material/Slider';

const StyledCard = styled(Card)(({ theme }) => ({
  // maxWidth: 300,
  // margin: theme.spacing(2),
}));

const ProfileComponent = (props) => {
  const router = useRouter(); // Initialize the useRouter hook

  const profiles = props.profiles;
  const setDistance = props.setDistance;
  const skillFilter = props.skillFilter;
  const skillArray = props.skillArray;
  const distance = props.distance;
  const handleFilter = props.handleFilter;

  const handleDistanceChange = (event, newValue) => {
    setDistance(newValue);
  };

  function routerPush(value) {
    router.push(`/profile/${value}`);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {profiles.length === 0 ? (
        <CircularProgress />
      ) : (
        <div>
          <Grid
              container
              spacing={2}
              height={100}
              paddingX={{ xs: 3, sm: 5, md: 24 }}
              margin={1}
          >
            <Grid item xs={4}>
              <Box sx={{ minWidth: 120, maxWidth: 250 }}>
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
            <Grid item xs={4}>
              <Box sx={{ minWidth: 120, maxWidth: 250 }}>
                <Typography id="discrete-slider" gutterBottom>
                  Distance (KM)
                </Typography>
                <Slider
                    value={distance}
                    onChange={handleDistanceChange}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={0.1}
                    min={1}
                    max={5}
                />
              </Box>
            </Grid>
            <Grid
                container
                item
                xs={4}
                alignSelf={"flex-start"}
                justifyContent="flex-end"
                paddingRight={{ xs: 3, sm: 5, md: 2 }}
            >
            </Grid>
          </Grid>
          {profiles.length > 0 && (
            <Grid container spacing={2} paddingX={3} paddingY={6}>
              {profiles.map((profile) => (
                <Grid item key={profile.id} xs={12} sm={6} md={4} lg={3}>
                  <div
                    onClick={() => routerPush(profile.email)}
                    className="bg-teal-300 rounded-md"
                  >
                    <div className="relative">
                      <Card className="min-h-96 max-h-96 cursor-pointer transition-transform transform hover:-translate-y-2 hover:shadow-md">
                        <CardHeader
                          avatar={
                            <Avatar sx={{ bgcolor: red[500] }}>
                              {profile.firstName[0].toUpperCase()}
                            </Avatar>
                          }
                          action={
                            <IconButton aria-label="settings">
                              <MoreVertIcon />
                            </IconButton>
                          }
                          title={
                            <Typography
                              variant="h8"
                              component="div"
                              className="font-bold text-gray-700"
                            >
                              {`${profile.firstName} ${profile.lastName}`}
                            </Typography>
                          }
                        />
                        <CardMedia
                          component="img"
                          style={{ height: 140 }} // Set a fixed height for the image
                          image={profile.imageUrl}
                          alt={`Profile photo of ${profile.firstName}`}
                        />
                        <CardContent>
                          <Typography variant="body2" color="text.secondary">
                            <strong className="font-extrabold">
                              Description:
                            </strong>{" "}
                            {profile.description}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong className="font-extrabold">Skills:</strong>{" "}
                            {profile.userSkills.map(
                              (e) => e.skill.skillName + ","
                            )}
                          </Typography>
                          <div className="absolute bottom-2 right-2">
                            <IconButton aria-label="share">
                              <ChatBubbleIcon />
                            </IconButton>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
