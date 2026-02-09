"use client";

import React, { useState, useEffect } from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PersonIcon from "@mui/icons-material/Person";
import { useRouter } from "next/navigation";
import {
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  ListItemIcon,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navbar() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [open, SetOpen] = useState(false);
  const [confirm, SetConfirm] = useState(false);
  
  const [userName, setUserName] = useState("کاربر..");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.firstName && userObj.lastName) {
          setUserName(`${userObj.firstName} ${userObj.lastName}`);
        } else if (userObj.nationalId) {
          setUserName(userObj.nationalId);
        }
      } catch (error) {
        console.error("خطا در خواندن اطلاعات کاربر:", error);
      }
    }
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    SetConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("businessKey");
    localStorage.removeItem("user");
    
    SetConfirm(false);
    router.push("/");
  };

  return (
    <header className="w-full">
      <div
        className={
          "flex w-full justify-between items-center h-12 sm:h-14 md:h-16 rounded-md " +
          "bg-white text-black dark:bg-black dark:text-white my-6 sm:my-8 md:my-12 px-3 sm:px-4 transition-colors duration-300"
        }
      >
        <div className="text-sm sm:text-base md:text-lg truncate">
          {userName}
        </div>

        <div className="flex gap-2 items-center">
          <button
            className="p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          >
          </button>

          <IconButton
            onClick={handleMenuClick}
            size="small"
            className="mx-2 sm:mx-3 md:mx-5"
          >
            <PersonIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <MenuItem onClick={handleLogoutClick}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              خروج
            </MenuItem>
          </Menu>

          <Dialog
            open={confirm}
            onClose={() => SetConfirm(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"تایید خروج"}</DialogTitle>
            <DialogContent>
              <p className="text-gray-600 mt-2">آیا از خروج خود اطمینان دارید؟</p>
            </DialogContent>
            <DialogActions className="flex gap-5">
              <Button onClick={() => SetConfirm(false)} color="inherit">
                انصراف
              </Button>
              <Button onClick={confirmLogout} color="error" variant="contained" autoFocus>
                بله، خروج
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </header>
  );
}