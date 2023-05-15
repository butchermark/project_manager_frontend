import { useCallback, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ProjectManagerContext from "../../context/ProjectManagerContext";
import LoginIcon from "@mui/icons-material/Login";
import {
  Container,
  TextField,
  ThemeProvider,
  Typography,
  colors,
  createTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ReactComponent as Logo } from "../UI/logo/logoBig.svg";
import { CreateUserPanel } from "../UI/CreateUserPanel";

export const LoginPage = () => {
  const { setAccessToken, setLoading, username, setUsername } = useContext(
    ProjectManagerContext
  );
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [userName, setCreateUserName] = useState("");
  const [userEmail, setCreateUserEmail] = useState("");
  const [userPassword, setCreateUserPassword] = useState("");
  const [isReload, setIsReload] = useState(true);
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
  let navigate = useNavigate();
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

  useEffect(() => {
    if (isSubmit) {
      const getUser = async () => {
        try {
          await axios
            .post("http://localhost:3000/auth/signin", {
              name: username,
              password: password,
            })
            .then((res) => {
              if (res.data) {
                setAccessToken(res.data.accesstoken);
                setIsSubmit(true);
                localStorage.setItem("accessToken", res.data.accesstoken);
                localStorage.setItem("user", JSON.stringify(res.data.user));
              }
              if (res.data.user.isSuspended) {
                window.alert("Account is Suspended");
                setIsSubmit(false);
              } else {
                navigate(
                  res.data.user.isAdmin ? "/usermanagement" : "/dashboard"
                );
              }
            })
            .catch((err) => {
              setIsSubmit(false);
              console.log(err);
            });
        } catch (err) {
          setLoading(false);
        }
      };
      getUser();
    }
  }, [isSubmit, isReload]);

  const registration = useCallback(async () => {
    try {
      await axios
        .post(
          "http://localhost:3000/user/registration",
          {
            name: userName,
            email: userEmail,
            password: userPassword,
            isAdmin: false,
            isSuspended: false,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((res) => {
          setIsReload(true);
          navigate("/login");
        });
    } catch (err) {
      console.log(err);
    }
    setCreatingUser(false);
  }, [userName, userEmail, userPassword]);

  const handleSubmit = () => {
    setIsSubmit(true);
  };

  const handleCreate = () => {
    setCreatingUser(false);
    if (!userName || !userEmail || !userPassword) {
      window.alert("Please fill all the fields");
    } else if (regexExp.test(userEmail)) {
      registration();
    } else {
      window.alert("Please enter a valid email");
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <ThemeProvider theme={theme}>
        <CreateUserPanel
          close={() => setCreatingUser(false)}
          status={creatingUser}
          method={"Create new User"}
          username={(e: any) => setCreateUserName(e.target.value)}
          useremail={(e: any) => setCreateUserEmail(e.target.value)}
          userpassword={(e: any) => setCreateUserPassword(e.target.value)}
          submit={handleCreate}
        ></CreateUserPanel>
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            paddingTop: 5,
          }}
        >
          <Logo />
          <Typography
            paddingLeft={2}
            variant="h2"
            component="div"
            fontWeight={500}
            maxWidth={440}
            textAlign={"center"}
            color={"#0e055f"}
            sx={{ flexGrow: 1 }}
          >
            Project Manager
          </Typography>
        </Container>
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
            flexDirection: "column",
          }}
        >
          <Typography color="primary">Name</Typography>
          <TextField
            type="text"
            className="login-input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Typography color="primary" sx={{ marginTop: 2 }}>
            Password
          </Typography>
          <TextField
            type="password"
            className="login-input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Container>
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Button
            type="button"
            className="submit-button"
            disabled={isSubmit}
            onClick={handleSubmit}
            variant="contained"
            sx={{ marginTop: 2, marginBottom: 2, marginRight: 2 }}
          >
            <LoginIcon />
          </Button>
          <Button variant="outlined" onClick={() => setCreatingUser(true)}>
            <Typography>Register</Typography>
          </Button>
        </Container>
      </ThemeProvider>
    </Container>
  );
};
