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
import React from "react";
import { ReactComponent as Logo } from "../UI/logo/logo.svg";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  let navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userFirstLetter = user.name.charAt(0);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setAnchorEl(null);
    navigate("/login");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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

  return (
    <React.Fragment>
      {user.isAdmin ? (
        <ThemeProvider theme={theme}>
          <AppBar position="static">
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
              <Stack direction="row" spacing={2}>
                <Button
                  color="secondary"
                  onClick={() => navigate("/usermanagement")}
                >
                  User Management
                </Button>
                <Button
                  color="secondary"
                  onClick={() => navigate("/projectmanagement")}
                >
                  Project Management
                </Button>
                <Button
                  color="secondary"
                  onClick={() => navigate("/taskmanagement")}
                >
                  Task Management
                </Button>
              </Stack>
              <Tooltip title="Account">
                <IconButton
                  onClick={handleClick}
                  size="medium"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  <Avatar sx={{ width: 45, height: 45 }}>
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
      ) : (
        <ThemeProvider theme={theme}>
          <AppBar position="static">
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
                  <Avatar sx={{ width: 45, height: 45 }}>
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
