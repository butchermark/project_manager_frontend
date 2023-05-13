import { Container, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IProject } from "../../interface/IProject.interface";

export const ProjectPage = () => {
  const [project, setProject] = useState<IProject>({});
  let { projectid } = useParams();

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
    <Container>
      <Typography>{project.name}</Typography>
      <Container>
        <Typography>{project.description}</Typography>
        <Typography>{project.status}</Typography>
        <Typography>{project?.manager?.name}</Typography>
      </Container>
      <Container>
        <Typography>Tasks: {project?.tasks?.length}</Typography>
        <Typography></Typography>
      </Container>
      <Container>
        <Typography>Users: {project?.users?.length}</Typography>
        <Typography></Typography>
      </Container>
    </Container>
  );
};
