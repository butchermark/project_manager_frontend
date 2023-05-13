import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ProjectManagerContext from "../../context/ProjectManagerContext";
import LoginIcon from "@mui/icons-material/Login";
import {
  Container,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ReactComponent as Logo } from "../UI/logo/logoBig.svg";

export const LoginPage = () => {
  const { setAccessToken, setLoading, username, setUsername } = useContext(
    ProjectManagerContext
  );
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
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
          //setLoading(true);
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
  }, [isSubmit]);

  const handleSubmit = () => {
    setIsSubmit(true);
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
          <Typography>Name</Typography>
          <TextField
            type="text"
            className="login-input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Typography sx={{ marginTop: 2 }}>Password</Typography>
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
            flexDirection: "column",
          }}
        >
          <Button
            type="button"
            className="submit-button"
            disabled={isSubmit}
            onClick={handleSubmit}
            variant="contained"
            sx={{ marginTop: 2 }}
          >
            <LoginIcon />
          </Button>
        </Container>
      </ThemeProvider>
    </Container>
  );
};
