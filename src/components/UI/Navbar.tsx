import { ThemeProvider } from "@emotion/react";
import { Logout } from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Button,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  createTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import { ReactComponent as Logo } from "../UI/logo/logo.svg";
import { useNavigate } from "react-router-dom";
import "./responsive.css";

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  let navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userFirstLetter = user.name.charAt(0);
  const [currentPage, setCurrentPage] = React.useState("");
  const theme = createTheme({
    palette: {
      primary: {
        main: "#0e055f",
      },
      secondary: {
        main: "#ffffff",
      },
    },
  });

  useEffect(() => {}, [currentPage]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setAnchorEl(null);
    navigate("/login");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSiteSwitch = (e: any) => {
    switch (e.target.textContent) {
      case "Project Management":
        navigate("/projectmanagement");
        setCurrentPage("projectmanagement");
        break;
      case "Task Management":
        navigate("/taskmanagement");
        setCurrentPage("taskmanagement");
        break;
      case "User Management":
        navigate("/usermanagement");
        setCurrentPage("usermanagement");
        break;
      default:
        break;
    }
  };

  return (
    <React.Fragment>
      {user.isAdmin ? (
        <ThemeProvider theme={theme}>
          <AppBar position="static">
            <Toolbar className="navbar-toolbar">
              <Logo />
              <Typography
                display={"flex"}
                paddingLeft={2}
                variant="h4"
                component="div"
                fontWeight={500}
                sx={{ flexGrow: 1 }}
              >
                Project Manager
              </Typography>
              <Stack
                sx={{ display: "flex", flexWrap: "wrap" }}
                direction="row"
                spacing={2}
              >
                <Button
                  color="secondary"
                  sx={{
                    border: 0.5,
                    display: "flex",
                  }}
                  onClick={(e) => handleSiteSwitch(e)}
                >
                  User Management
                </Button>
                <Button
                  color="secondary"
                  sx={{
                    border: 0.5,
                    display: "flex",
                  }}
                  onClick={(e) => handleSiteSwitch(e)}
                >
                  Task Management
                </Button>
                <Button
                  color="secondary"
                  sx={{
                    border: 0.5,
                    display: "flex",
                  }}
                  onClick={(e) => handleSiteSwitch(e)}
                >
                  Project Management
                </Button>
              </Stack>
              <Tooltip sx={{ display: "flex" }} title="Account">
                <IconButton
                  onClick={handleClick}
                  size="medium"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar
                    sx={{
                      backgroundColor: "#0e055f",
                      border: 2,
                      width: 45,
                      height: 45,
                    }}
                  >
                    {userFirstLetter}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ display: "flex" }}
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="medium" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
      ) : (
        <ThemeProvider theme={theme}>
          <AppBar sx={{ display: "flex" }} position="static">
            <Toolbar>
              <Logo />
              <Typography
                paddingLeft={2}
                variant="h4"
                component="div"
                fontWeight={500}
                sx={{ flexGrow: 1 }}
              >
                Project Manager
              </Typography>
              <Tooltip title="Account">
                <IconButton
                  onClick={handleClick}
                  size="medium"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar
                    sx={{
                      backgroundColor: "#0e055f",
                      border: 2,
                      width: 45,
                      height: 45,
                    }}
                  >
                    {userFirstLetter}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="medium" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>
        </ThemeProvider>
      )}
    </React.Fragment>
  );
};
