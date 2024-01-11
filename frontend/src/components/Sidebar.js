import * as React from "react";
import MuiDrawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AdjustIcon from "@mui/icons-material/Adjust";
import HomeIcon from '@mui/icons-material/Home';
import FlagIcon from '@mui/icons-material/Flag';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';

import List from "@mui/material/List";
import { styled, useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { store } from "../redux/store";
import { LOGOUT } from "../redux/actionTypes";
import { useAuth } from "../hooks/useAuth";
import { enqueueSnackbar } from "notistack";
import { QuestionMark } from "@mui/icons-material";

const drawerWidth = 250;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} - 8px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} - 8px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  height: 40,
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxShadow: "rgba(47, 43, 61, 0.14) 0px 2px 6px 0px",
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Sidebar = () => {
  const { products } = useSelector((state) => state.product);
  const [open, setOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { logout } = useAuth();

  const navigator = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    store.dispatch({ type: LOGOUT });
    enqueueSnackbar({ variant: "default", message: "You have logged out." });
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={() => setOpen(!open)} sx={{ mr: 0.25 }}>
          <AdjustIcon sx={{ color: theme.palette.primary.main }} />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List sx={{ width: "100%" }} component="nav">

        <ListItemButton onClick={() => navigator("/dashboard/overview")}>
          <ListItemIcon>
            <HomeIcon></HomeIcon>
          </ListItemIcon>
          <ListItemText primary="Homepage" />
        </ListItemButton>

        <ListItemButton onClick={() => navigator("/Livedropes")}>
          <ListItemIcon>
            <FlagIcon />
          </ListItemIcon>
          <ListItemText primary="Livedropes" />
        </ListItemButton>

        <ListItemButton onClick={() => navigator("/myevents")}>
          <ListItemIcon>
            <FormatListBulletedIcon />
          </ListItemIcon>
          <ListItemText primary="My Events" />
        </ListItemButton>


        <ListItemButton onClick={() => navigator("/faqs")}>
          <ListItemIcon>
            <QuestionMark />
          </ListItemIcon>
          <ListItemText primary="FAQs" />
        </ListItemButton>



        <ListItemButton onClick={() => navigator("/profile")}>
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>


        <ListItemButton onClick={handleLogout} disableRipple>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItemButton>

      </List>
    </Drawer>
  );
};

export default Sidebar;




{/* <ListItemButton onClick={() => navigator("/gym")}>
          <ListItemIcon>
            <QuestionMarkIcon />
          </ListItemIcon>
          <ListItemText primary="FAQ" />
        </ListItemButton> */}
{/* 
        <ListItemButton onClick={() => navigator("/user")}>
          <ListItemIcon>
            <ContactMailIcon />
          </ListItemIcon>
          <ListItemText primary="Contacts" />
        </ListItemButton> */}

{/* <ListItemButton onClick={() => navigator("/gym")}>
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="Payment" />
        </ListItemButton> */}

{/* 
        <ListItemButton onClick={() => navigator("/user")}>
          <ListItemIcon>
            <SupportIcon />
          </ListItemIcon>
          <ListItemText primary="Supports" />
        </ListItemButton> */}