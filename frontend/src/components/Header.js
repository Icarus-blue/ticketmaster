import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {
  Avatar,
  Badge,
  Card,
  LinearProgress,
  Menu,
  MenuItem,
  Stack,
  alpha,
} from "@mui/material";
import { useEffect, } from "react";
import { useSelector } from "react-redux";
import { Logout } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { store } from "../redux/store";
import { LOGOUT } from "../redux/actionTypes";
import { enqueueSnackbar } from "notistack";
import { useAuth } from "../hooks/useAuth";
import ThemeToggleButton from "./ThemeToggleButton";
import { useNavigate } from "react-router-dom";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 0,
    top: 6,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    color: theme.palette.text.primary,
  },
}));

const Header = () => {
  // const { myInvitations } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const theme = useTheme();
  const { logout } = useAuth();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.common);
  const navigate = useNavigate();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    console.log("current User->", user);
  }, []);

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    store.dispatch({ type: LOGOUT });
    enqueueSnackbar({ variant: "default", message: "You have logged out." });
  };

  return (
    <Box
      sx={{
        p: 2,
        pb: 0,
        position: "sticky",
        top: 0,
        left: 0,
        backgroundColor: theme.palette.background.default,
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Card>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {isLoading && (
            <LinearProgress
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
              }}
            />
          )}
          <Stack direction="row" alignItems="center">
            <Typography variant="h6" noWrap component="div">
              Event Ticket management system
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center">
            <ThemeToggleButton />
            <IconButton onClick={handleOpenMenu}>
              <StyledBadge
                // badgeContent={myInvitations.length}
                // invisible={myInvitations.length === 0}
                color="success"
              >
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  {/* {user?.fullname[0]?.toUpperCase()} */}
                </Avatar>
              </StyledBadge>
            </IconButton>
          </Stack>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleCloseMenu}
          >

            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                navigate("/profile");
              }}
              disableRipple
            >
              <AccountCircleIcon />
              Profile
            </MenuItem>  
          
            <MenuItem onClick={handleLogout} disableRipple>
              <Logout />
              Logout
            </MenuItem>
          </StyledMenu>
        </Toolbar>
      </Card>
    </Box>
  );
};

export default Header;
