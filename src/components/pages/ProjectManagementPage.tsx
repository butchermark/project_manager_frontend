import { ThemeProvider } from "@emotion/react";
import {
  Button,
  Container,
  Link,
  TableCell,
  TableRow,
  Typography,
  createTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Navbar } from "../UI/Navbar";
import { DefaultTable } from "../UI/DefaultTable";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { EditProjectPanel } from "../UI/EditProjectPanel";
import DeleteIcon from "@mui/icons-material/Delete";
import { CreateProjectPanel } from "../UI/CreateProjectPanel";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import { arch } from "os";

export const ProjectManagementPage = () => {
  const managerId = JSON.parse(localStorage.getItem("user") ?? "").id;
  const [isReload, setIsReload] = useState(true);
  const [tableData, setTableData] = useState<any[]>([]);
  const [projectId, setProjectId] = useState("");
  const [originalProjectName, setOriginalProjectName] = useState("");
  const [originalProjectDescription, setOriginalProjectDescription] =
    useState("");
  const [originalProjectStatus, setOriginalProjectStatus] = useState("");
  const [originalProjectManager, setOriginalProjectManager] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [editingProject, setEditingProject] = useState(false);
  const [adminButtonText, setAdminButtonText] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);
  const [showArchived, setShowArchived] = useState(true);
  const [admin, setAdmin] = useState<Admin>();
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

  interface Admin {
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    isAdmin?: boolean;
  }

  useEffect(() => {
    const getProjects = async () => {
      if (isReload || showArchived || !showArchived) {
        try {
          await axios
            .get("http://localhost:3000/project/", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            })
            .then((res) => {
              res.data.forEach((project: any) => {
                if (project.user === null) {
                  project.user = { name: "No manager" };
                }
                if (showArchived) {
                  const archivedProjects = res.data.filter(
                    (project: any) => !project.archived
                  );
                  setTableData(archivedProjects);
                } else {
                  setTableData(res.data);
                }
              });
              setIsReload(false);
            });
        } catch (err) {
          console.log(err);
        }
      }
    };
    getProjects();
    setAdminButtonText(true);
  }, [isReload, showArchived]);

  const createProject = useCallback(async () => {
    try {
      await axios
        .post(
          `http://localhost:3000/project/${managerId}`,
          {
            name: projectName,
            description: projectDescription,
            status: projectStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((res) => {
          setIsReload(true);
        });
    } catch (err) {
      console.log(err);
    }
    setCreatingProject(false);
  }, [projectName, projectDescription, projectStatus, managerId]);

  const editProject = useCallback(async () => {
    try {
      await axios
        .put(
          `http://localhost:3000/project/${projectId}`,
          {
            name: projectName || originalProjectName || "",
            description: projectDescription || originalProjectDescription || "",
            status: projectStatus || originalProjectStatus || "",
            user: admin || originalProjectManager || "",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((res) => {
          setIsReload(true);
        });
    } catch (err) {
      console.log(err);
    }
    setEditingProject(false);
  }, [admin, projectId, projectDescription, projectName]);

  const deleteProject = useCallback(async (projectId: string) => {
    try {
      await axios
        .delete(`http://localhost:3000/project/${projectId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          setIsReload(true);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const archiveProject = useCallback(async (projectId: string) => {
    try {
      await axios
        .put(
          `http://localhost:3000/project/${projectId}/archiveProject`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((res) => {
          setIsReload(true);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const unarchiveProject = useCallback(async (projectId: string) => {
    try {
      await axios
        .put(
          `http://localhost:3000/project/${projectId}/unarchiveProject`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          setIsReload(true);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleStartCreate = () => {
    setCreatingProject(true);
  };

  const handleStartEdit = (project: any) => {
    setProjectId(project.id);
    setOriginalProjectName(project.name);
    setOriginalProjectDescription(project.description);
    setOriginalProjectStatus(project.status);
    setOriginalProjectManager(project.user.name);
    setEditingProject(true);
  };

  const handleCreate = () => {
    createProject();
  };

  const handleEdit = () => {
    editProject();
  };

  const handleShowArchivedProjects = () => {
    if (showArchived) {
      setShowArchived(false);
    } else {
      setShowArchived(true);
    }
  };

  const handleDelete = (projectId: string) => {
    deleteProject(projectId);
  };

  const handleArchiveProject = (
    projectId: string,
    projectIsArchived: boolean
  ) => {
    if (!projectIsArchived) {
      archiveProject(projectId);
    } else {
      unarchiveProject(projectId);
    }
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <EditProjectPanel
          close={() => setEditingProject(false)}
          status={editingProject}
          method={"Edit project"}
          submit={handleEdit}
          projectname={(e: any) => setProjectName(e.target.value)}
          projectdescription={(e: any) => setProjectDescription(e.target.value)}
          projectstatus={(e: any) => setProjectStatus(e.target.value)}
          projectmanager={setAdmin}
          adminbuttontext={adminButtonText}
          changeadminbuttontext={setAdminButtonText}
        ></EditProjectPanel>
        <CreateProjectPanel
          close={() => setCreatingProject(false)}
          status={creatingProject}
          method={"Create project"}
          submit={handleCreate}
          projectname={(e: any) => setProjectName(e.target.value)}
          projectdescription={(e: any) => setProjectDescription(e.target.value)}
          projectstatus={(e: any) => setProjectStatus(e.target.value)}
        ></CreateProjectPanel>
        <Navbar />
        <Container sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
          <Typography color="primary" variant="h4">
            Project Management
          </Typography>
        </Container>
        <Container sx={{ mt: 5 }}>
          <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ marginRight: 2, padding: 0 }}
              variant="contained"
              color="success"
              onClick={() => handleStartCreate()}
            >
              <Container sx={{ padding: 0 }}>
                <Typography>Add New Project</Typography> <AddCircleIcon />
              </Container>
            </Button>
            <Button
              sx={{ padding: 0 }}
              variant="outlined"
              color="primary"
              onClick={() => handleShowArchivedProjects()}
            >
              {showArchived ? (
                <Container>
                  <Typography>Show All</Typography>
                  <UnarchiveIcon />
                </Container>
              ) : (
                <Container>
                  <Typography>Hide Archived</Typography>
                  <ArchiveIcon />
                </Container>
              )}
            </Button>
          </Container>
          <DefaultTable
            headers={["Name", "Description", "Status", "Manager", ""]}
            data={[
              tableData.map((project: any) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Link
                      color="inherit"
                      href={`/project/${project.id}`}
                      underline="always"
                    >
                      {project.name}
                    </Link>
                  </TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{project.user.name}</TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleStartEdit(project)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      sx={{ marginLeft: 3, marginRight: 3 }}
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        handleArchiveProject(project.id, project.archived)
                      }
                    >
                      {project.archived ? <UnarchiveIcon /> : <ArchiveIcon />}
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      id={project.id}
                      onClick={() => handleDelete(project.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              )),
            ]}
          ></DefaultTable>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
};
