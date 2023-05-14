import { Container, Typography, createTheme } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IProject } from "../../interface/IProject.interface";
import { ThemeProvider } from "@emotion/react";
import { Navbar } from "../UI/Navbar";
import React from "react";

export const ProjectPage = () => {
  const [project, setProject] = useState<IProject>({});
  let { projectid } = useParams();
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
    const getProjectById = async () => {
      try {
        await axios
          .get(`http://localhost:3000/project/${projectid}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
          .then((res) => {
            setProject(res.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    getProjectById();
  }, []);

  return (
    <React.Fragment>
      <Navbar />
      <ThemeProvider theme={theme}>
        <Container
          sx={{ display: "flex", justifyContent: "center", mt: "50px" }}
        >
          <Typography color="primary" variant="h3">
            {project.name}
          </Typography>
        </Container>
        <Container
          sx={{
            mt: "50px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              ml: "20px",
              borderRadius: "10px",
              color: "white",
              padding: "10px",
              backgroundColor: "#0e055f",
            }}
            variant="h5"
          >
            Description: {project.description}
          </Typography>
          <Typography
            sx={{
              ml: "20px",
              borderRadius: "10px",
              color: "white",
              padding: "10px",
              backgroundColor: "#0e055f",
            }}
            variant="h5"
          >
            Status: {project.status}
          </Typography>
          <Typography
            sx={{
              ml: "20px",
              borderRadius: "10px",
              color: "white",
              padding: "10px",
              backgroundColor: "#0e055f",
            }}
            variant="h5"
          >
            Manager: {project?.user?.name}
          </Typography>
        </Container>
        <Container sx={{ mt: "100px", display: "flex", flexDirection: "row" }}>
          <Typography
            sx={{
              ml: "20px",
              borderRadius: "10px",
              color: "white",
              padding: "10px",
              backgroundColor: "#0e055f",
            }}
            variant="h5"
          >
            Tasks:
          </Typography>
          {project?.tasks?.map((task: any) => (
            <Typography
              key={task.id}
              sx={{
                ml: "20px",
                fontSize: "20px",
                border: "1px solid #0e055f",
                borderRadius: "10px",
                color: "#0e055f",
                padding: "10px",
                backgroundColor: "ffffff",
              }}
            >
              {task.name}
            </Typography>
          ))}
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
};
