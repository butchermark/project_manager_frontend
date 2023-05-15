import {
  Container,
  Typography,
  TextField,
  Modal,
  Box,
  Button,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import AddCircleOutLineIcon from "@mui/icons-material/AddCircle";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { EStatus } from "../../shared/status.enum";

export const CreateTaskPanel = (props: any) => {
  const [projectAnchorEl, setProjectAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [statusAnchorEl, setStatusAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const projectOpen = Boolean(projectAnchorEl);
  const statusOpen = Boolean(statusAnchorEl);
  const [projects, setProjects] = useState([]);
  const [addProjectButtonText, setAddProjectButtonText] =
    useState("Add to project");
  const [addStatusButtonText, setAddStatusButtonText] = useState("Add status");

  useEffect(() => {
    const getAllProjects = async () => {
      try {
        await axios
          .get("http://localhost:3000/project/", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
          .then((res) => {
            setProjects(res.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    getAllProjects();
  }, []);

  const handleCloseProject = () => {
    setProjectAnchorEl(null);
  };

  const handleCloseStatus = () => {
    setStatusAnchorEl(null);
  };

  const handleSelectProject = (projectId: string, projectName: string) => {
    props.projectId(projectId);
    setAddProjectButtonText(projectName);
    setProjectAnchorEl(null);
  };

  const handleSelectStatus = (status: string) => {
    props.taskstatus(status);
    setAddStatusButtonText(status);
    setStatusAnchorEl(null);
  };
  const handleClickOnProjectDropDown = (event: any) => {
    setProjectAnchorEl(event.currentTarget);
  };

  const handleClickOnStatusDropDown = (event: any) => {
    setStatusAnchorEl(event.currentTarget);
  };

  const handleSubmit = () => {
    props.submit();
    props.changeprojectbuttontext(false);
  };

  return (
    <Modal
      sx={{ display: "flex", alignItems: "center" }}
      open={props.status}
      onClose={props.close}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 400,
          maxHeight: 500,
          backgroundColor: "white",
          padding: 3,
          width: "100%",
          position: "relative",
        }}
        maxWidth={false}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: 2,
          }}
        >
          <Typography variant="h5">{props.method}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography>Name</Typography>
          <TextField onChange={(e) => props.taskname(e)} />
          <Typography>Description</Typography>
          <TextField onChange={(e) => props.taskdescription(e)} />
          <Typography>Status</Typography>
          <Tooltip title="Update" onClick={handleClickOnStatusDropDown}>
            <Button variant="contained">{addStatusButtonText}</Button>
          </Tooltip>
          <Menu
            anchorEl={statusAnchorEl}
            open={statusOpen}
            onClose={handleCloseStatus}
          >
            <MenuItem onClick={() => handleSelectStatus(EStatus.DONE)}>
              {EStatus.DONE}
            </MenuItem>
            <MenuItem onClick={() => handleSelectStatus(EStatus.TO_DO)}>
              {EStatus.TO_DO}
            </MenuItem>
            <MenuItem onClick={() => handleSelectStatus(EStatus.IN_PROGRESS)}>
              {EStatus.IN_PROGRESS}
            </MenuItem>
          </Menu>
          <Typography>Project</Typography>
          <Tooltip title="Add to project">
            <Button
              variant="contained"
              onClick={(e) => handleClickOnProjectDropDown(e)}
            >
              {addProjectButtonText}
            </Button>
          </Tooltip>
          <Menu
            anchorEl={projectAnchorEl}
            id="status-menu"
            open={projectOpen}
            onClose={handleCloseProject}
          >
            {projects.map((project: any) => (
              <MenuItem
                key={project.id}
                onClick={() => handleSelectProject(project.id, project.name)}
              >
                {project.name}
              </MenuItem>
            ))}
          </Menu>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              color="success"
              variant="contained"
              sx={{ width: 10, marginTop: 2 }}
              onClick={handleSubmit}
              disabled={addProjectButtonText === "Add to project"}
            >
              <AddCircleOutLineIcon />
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
};
