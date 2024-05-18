"use client";

import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { chatHrefConstructor } from "@/util/utils";

export default function Post({ params, showDeleteOption , onDelete, signedUserEmail}) {
    const skillId = params.skillId;
    const userEmail = params.email;
    const showSendMessageOption = signedUserEmail != userEmail;
    if(signedUserEmail){
        showDeleteOption = userEmail == signedUserEmail;
    }
    else{
        showDeleteOption = false;
    }
    
    let initial = params.email.toUpperCase().charAt(0);

        // console.log(userEmail);
    // Calculate time elapsed since post creation
    const now = new Date();
    const createDate = new Date(params.createDate);
    const timeDiff = now.getTime() - createDate.getTime();
    const hoursDiff = Math.floor(timeDiff / (1000 * 3600));
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    const router = useRouter();

     // Format subheader text based on time elapsed
     let subheaderText;
     if (hoursDiff < 1) {
        if (minutesDiff === 0) {
            subheaderText = `Posted just now`;
        } else {
            subheaderText = `Posted ${minutesDiff} minute${minutesDiff > 1 ? 's' : ''} ago`;
        }
    } else if (hoursDiff < 24) {
        subheaderText = `Posted ${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
    } else {
        subheaderText = `Posted on ${createDate.toLocaleDateString('en-US')}`;
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openMenu, setOpenMenu] = React.useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpenMenu(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpenMenu(false);
    };

    const [openDialog, setOpenDialog] = React.useState(false);

    const handleConfirmDelete = async () => {
        onDelete(params.postId)
        handleCloseDialog();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    function AvatarClick() {
        router.push(`/profile/${userEmail}`);
    }

    const openChatPage = async () => {

        const res = await axios.post('/api/chat', {email: userEmail, signedUserEmail: signedUserEmail});
        if(res.status == 200){
            //Route to the message page with the user added
            router.push(`/chat/chatpage/${chatHrefConstructor(userEmail, signedUserEmail)}`);
        }
    }

    return(
    <Card sx={{ display:'block' }}>
        <CardHeader
            avatar={
            <Avatar onClick={AvatarClick} sx={{ bgcolor: "#42c5f5" }} aria-label="post">
                {initial}
            </Avatar>
            }
            action={
                <div>
                    {showDeleteOption && 
                        <IconButton aria-label="settings" onClick={handleClick}>
                            <MoreVertIcon />
                        </IconButton>}
                        <Menu
                                anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleClose}
                        >
                            {showDeleteOption && (
                                <MenuItem onClick={() => {
                                    handleClose();
                                    setOpenDialog(true); // Open confirmation dialog
                                }}>
                                    <ListItemIcon>
                                        <DeleteIcon fontSize="small" />
                                    </ListItemIcon>
                                    Delete
                                </MenuItem>
                            )}
                        </Menu>

                        {/* Confirmation dialog */}
                        <Dialog open={openDialog} onClose={handleCloseDialog}>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogContent>
                                Are you sure you want to delete this post?
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Cancel</Button>
                                <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
            }
            title={params.name}
            subheader={subheaderText}
        />
        <CardContent>
            <Typography sx={{wordBreak: "break-word", width: 1, height: '7vw'}} variant="body2" color="text.secondary">
                {params.content}
            </Typography>
        </CardContent>
        <CardActions disableSpacing sx={{wordBreak: "break-word", width: 1, height: '3vw'}}>
            <IconButton aria-label="share">
                {showSendMessageOption && <ChatBubbleIcon onClick={openChatPage}/>}
            </IconButton>
        </CardActions>
    </Card>
    )
}