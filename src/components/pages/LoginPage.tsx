import { useContext, useEffect, useState } from "react";
import "../pages/LoginPage.css";
import Button from "@mui/material/Button";
import ProjectManagerContext from "../../context/ProjectManagerContext";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const LoginPage = () => {
  const { setAccessToken, setLoading } = useContext(ProjectManagerContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    if (isSubmit) {
      const getUsers = async () => {
        try {
          //setLoading(true);
          await axios
            .post("http://localhost:3000/auth/signin", {
              name: username,
              password: password,
            })
            .then((res) => {
              console.log(res);
              res.data && setIsSubmit(true);
              setAccessToken(res.data.accesstoken);
              res.data &&
                localStorage.setItem("accessToken", res.data.accesstoken);
              navigate("/dashboard");
            })
            .catch((err) => {
              setIsSubmit(false);
              console.log(err);
            });
        } catch (err) {
          setLoading(false);
        }
      };
      getUsers();
    }
  }, [isSubmit]);

  const handleSubmit = () => {
    setIsSubmit(true);
    //setIsAccessToken(true);
  };
  return (
    <div className="login-panel">
      <h1>Login Page</h1>
      <div className="login-inputs">
        <p>Name</p>
        <TextField
          type="text"
          className="login-input-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <p>Password</p>
        <TextField
          type="text"
          className="login-input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="button"
          className="submit-button"
          disabled={isSubmit}
          onClick={handleSubmit}
          variant="contained"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};