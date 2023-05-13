import { ThemeProvider } from "@emotion/react";
import { Button, Link, TableCell, TableRow, createTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Navbar } from "../UI/Navbar";
import { DefaultTable } from "../UI/DefaultTable";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { EditProjectPanel } from "../UI/EditProjectPanel";
import DeleteIcon from "@mui/icons-material/Delete";
import { CreateProjectPanel } from "../UI/CreateProjectPanel";

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
      if (isReload) {
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
              });
              setIsReload(false);
              setTableData(res.data);
            });
        } catch (err) {
          console.log(err);
        }
      }
    };
    getProjects();
    setAdminButtonText(true);
  }, [isReload]);

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

  const handleDelete = (projectId: string) => {
    deleteProject(projectId);
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
        <Button
          variant="contained"
          color="success"
          onClick={() => handleStartCreate()}
        >
          <AddCircleIcon />
        </Button>
        <DefaultTable
          headers={["Name", "Description", "Status", "Manager", "Archived", ""]}
          data={[
            tableData.map((project: any) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Link href={`/project/${project.id}`} underline="always">
                    {project.name}
                  </Link>
                </TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>{project.user.name}</TableCell>
                <TableCell>
                  {project.archived ? "Archived" : "Unarchived"}
                  <Button
                    variant="contained"
                    onClick={() => handleStartEdit(project)}
                  >
                    <EditIcon />
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
      </ThemeProvider>
    </React.Fragment>
  );
};
