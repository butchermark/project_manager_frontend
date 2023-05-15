import { ThemeProvider } from "@emotion/react";
import {
  Button,
  Container,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  createTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useCallback, useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Navbar } from "../UI/Navbar";
import { DefaultTable } from "../UI/DefaultTable";
import axios from "axios";
import { EditTaskPanel } from "../UI/EditTaskPanel";
import EditIcon from "@mui/icons-material/Edit";
import { CreateTaskPanel } from "../UI/CreateTaskPanel";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";

export const TaskManagementPage = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [editingTask, setEditingTask] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [originalTaskName, setOriginalTaskName] = useState("");
  const [originalTaskDescription, setOriginalTaskDescription] = useState("");
  const [originalTaskStatus, setOriginalTaskStatus] = useState("");
  const [users, setUsers] = useState([]);
  const [creatingTask, setCreatingTask] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [isReload, setIsReload] = useState(true);
  const [projectButtonText, setProjectButtonText] = useState(false);
  const [statusButtonText, setStatusButtonText] = useState(false);
  const [showArchived, setShowArchived] = useState(true);
  const open = Boolean(anchorEl);

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
    const fetchTasks = async () => {
      try {
        await axios
          .get("http://localhost:3000/task/allTasks", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
          .then((res) => {
            res.data.forEach((task: any) => {
              if (task.user === null) {
                task.user = { name: "No user" };
              }
              if (task.project === null) {
                task.project = { name: "No project" };
              }
              if (showArchived) {
                const archivedTasks = res.data.filter(
                  (task: any) => !task.archived
                );

                setTableData(archivedTasks);
              } else {
                setTableData(res.data);
              }
            });
            setIsReload(false);
          });
      } catch (err) {
        console.log(err);
      }
    };
    fetchTasks();
    setProjectButtonText(true);
    setStatusButtonText(true);
  }, [isReload, showArchived]);

  const createTask = useCallback(async () => {
    try {
      await axios
        .post(
          `http://localhost:3000/project/${projectId}/task`,
          {
            name: taskName,
            description: taskDescription,
            status: taskStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((res) => {
          if (res.data.user === null) {
            res.data.user = { name: "No user" };
          }
          if (res.data.project === null) {
            res.data.project = { name: "No project" };
          }
          setIsReload(true);
        });
    } catch (err) {
      console.log(err);
    }
    setCreatingTask(false);
    setEditingTask(false);
    setOriginalTaskDescription("");
    setOriginalTaskName("");
    setOriginalTaskStatus("");
    setTaskId("");
    setTaskName("");
    setTaskDescription("");
    setTaskStatus("");
  }, [taskName, taskDescription, taskStatus, projectId]);

  const editTask = useCallback(async () => {
    try {
      await axios
        .put(
          `http://localhost:3000/task/admin/${taskId}`,
          {
            name: taskName || originalTaskName || "",
            description: taskDescription || originalTaskDescription || "",
            status: taskStatus || originalTaskStatus || "",
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
    setEditingTask(false);
    setOriginalTaskDescription("");
    setOriginalTaskName("");
    setOriginalTaskStatus("");
    setTaskId("");
    setTaskName("");
    setTaskDescription("");
    setTaskStatus("");
  }, [taskId, taskName, taskDescription, taskStatus, taskId]);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await axios
        .delete(`http://localhost:3000/task/${taskId}`, {
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

  const addUserToTask = useCallback(
    async (userId: string) => {
      try {
        await axios
          .post(
            `http://localhost:3000/user/${taskId}/task`,
            { id: userId },
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
    },
    [taskId]
  );

  const removeUserFromTask = useCallback(async (taskId: string) => {
    try {
      await axios
        .delete(`http://localhost:3000/user/${taskId}/task`, {
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

  const archiveTask = useCallback(async (taskId: string) => {
    try {
      await axios
        .put(
          `http://localhost:3000/task/${taskId}/archiveTask`,
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

  const unarchiveTask = useCallback(async (taskId: string) => {
    try {
      await axios
        .put(
          `http://localhost:3000/task/${taskId}/unarchiveTask`,
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

  const getAllUsers = useCallback(async () => {
    try {
      await axios
        .get("http://localhost:3000/user/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          setUsers(res.data);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleStartEdit = (task: any) => {
    console.log(originalTaskDescription, originalTaskName, originalTaskStatus);
    setTaskId(task.id);
    setOriginalTaskName(task.name);
    setOriginalTaskDescription(task.description);
    setOriginalTaskStatus(task.status);
    setEditingTask(true);
  };
  const handleEdit = () => {
    editTask();
  };

  const handleAddingUserToTask = (userId: string) => {
    addUserToTask(userId);
    setAnchorEl(null);
  };

  const handleClickOnDropDown = (event: any, taskId: string) => {
    setAnchorEl(event.currentTarget);
    setTaskId(taskId);
    getAllUsers();
  };

  const handleShowArchivedTasks = () => {
    if (showArchived) {
      setShowArchived(false);
    } else {
      setShowArchived(true);
    }
  };

  const handleCreateTask = () => {
    if (!taskName || !taskDescription || !taskStatus) {
      window.alert("Please fill all fields");
    } else {
      createTask();
    }
  };

  const handleArchiveTask = (taskId: string, taskIsArchived: boolean) => {
    if (!taskIsArchived) {
      archiveTask(taskId);
    } else {
      unarchiveTask(taskId);
    }
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <EditTaskPanel
          close={() => setEditingTask(false)}
          status={editingTask}
          method={"Edit task"}
          submit={handleEdit}
          taskname={(e: any) => setTaskName(e.target.value)}
          taskdescription={(e: any) => setTaskDescription(e.target.value)}
          taskstatus={setTaskStatus}
        ></EditTaskPanel>
        <CreateTaskPanel
          close={() => setCreatingTask(false)}
          status={creatingTask}
          method={"Create task"}
          submit={handleCreateTask}
          taskname={(e: any) => setTaskName(e.target.value)}
          taskdescription={(e: any) => setTaskDescription(e.target.value)}
          taskstatus={setTaskStatus}
          taskbuttontext={statusButtonText}
          projectId={setProjectId}
          projectbuttontext={projectButtonText}
          changeprojectbuttontext={setProjectButtonText}
        ></CreateTaskPanel>
        <Navbar />
        <Container sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
          <Typography color="primary" variant="h4">
            Task Management
          </Typography>
        </Container>

        <Container sx={{ mt: 5 }}>
          <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ marginRight: 2, padding: 0 }}
              variant="contained"
              color="success"
              onClick={() => setCreatingTask(true)}
            >
              <Container sx={{ padding: 0 }}>
                <Typography>Add New Task</Typography> <AddCircleIcon />
              </Container>
            </Button>
            <Button
              sx={{ padding: 0 }}
              variant="outlined"
              color="primary"
              onClick={() => handleShowArchivedTasks()}
            >
              {showArchived ? (
                <Container sx={{ padding: 0 }}>
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
            headers={[
              "Name",
              "Description",
              "Status",
              "User",
              "Project",
              "",
              "",
            ]}
            data={tableData.map((task: any) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.user.name}</TableCell>
                <TableCell>{task.project.name}</TableCell>
                <TableCell>
                  {task.user.name === "No user" && (
                    <div>
                      <Tooltip title="Add User">
                        <Button
                          id={task.id}
                          variant="contained"
                          onClick={(e) => handleClickOnDropDown(e, task.id)}
                        >
                          Add User
                        </Button>
                      </Tooltip>
                      <Menu
                        anchorEl={anchorEl}
                        id="users"
                        open={open}
                        onClose={() => setAnchorEl(null)}
                      >
                        {users.map((user: any) => (
                          <MenuItem
                            key={user.id}
                            onClick={() => handleAddingUserToTask(user.id)}
                          >
                            {user.name}
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  )}
                  {task.user.name !== "No user" && (
                    <Button
                      onClick={() => removeUserFromTask(task.id)}
                      variant="contained"
                    >
                      Remove User
                    </Button>
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleStartEdit(task)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleArchiveTask(task.id, task.archived)}
                  >
                    {task.archived ? <UnarchiveIcon /> : <ArchiveIcon />}
                  </Button>
                  <Button
                    color="error"
                    variant="outlined"
                    id={task.id}
                    onClick={() => deleteTask(task.id)}
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          ></DefaultTable>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
};
