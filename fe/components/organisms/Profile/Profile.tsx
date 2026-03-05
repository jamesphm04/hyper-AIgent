"use client";
import { useProfile } from "./useProfile";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

export const Profile = () => {
  const {
    anchorEl,
    username,
    email,
    handleSignOut,
    handleSignIn,
    handleCloseProfile,
    handleOpenProfile,
  } = useProfile();

  return (
    <>
      <IconButton onClick={handleOpenProfile} size="large">
        <Avatar>{username?.[0]?.toUpperCase() || "U"}</Avatar>
      </IconButton>
      <Menu
        id="more--profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseProfile}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <MenuItem disabled>
          <div>
            <span style={{ fontSize: 12, color: "#888" }}>{email}</span>
          </div>
        </MenuItem>
        {username ? (
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        ) : (
          <MenuItem onClick={handleSignIn}>Sign In</MenuItem>
        )}
      </Menu>
    </>
  );
};
