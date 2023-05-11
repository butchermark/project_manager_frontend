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

export const CreateTaskPanel = (props: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [projects, setProjects] = useState([]);
  const [addProjectButtonText, setAddProjectButtonText] =
    useState("Add to project");
  const handleClickOnDropDown = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

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

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectProject = (projectId: string, projectName: string) => {
    props.projectId(projectId);
    props.projectName(projectName);
    setAddProjectButtonText(projectName);
    setAnchorEl(null);
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
          <TextField onChange={(e) => props.taskstatus(e)} />
          <Typography>Project</Typography>
          <Tooltip title="Add to project">
            <Button
              variant="contained"
              onClick={(e) => handleClickOnDropDown(e)}
            >
              {addProjectButtonText}
            </Button>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
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
              onClick={props.submit}
            >
              <AddCircleOutLineIcon />
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
};
