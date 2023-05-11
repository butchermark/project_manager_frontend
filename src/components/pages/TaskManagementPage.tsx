import { ThemeProvider } from "@emotion/react";
import {
  Button,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Tooltip,
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

export const TaskManagementPage = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [tableData, setTableData] = useState([]);
  const [editingTask, setEditingTask] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [originalTaskName, setOriginalTaskName] = useState("");
  const [originalTaskDescription, setOriginalTaskDescription] = useState("");
  const [originalTaskStatus, setOriginalTaskStatus] = useState("");
  const [deletingTask, setDeletingTask] = useState(false);
  const [edit, setEdit] = useState(false);
  const [addingUserToTask, setAddingUserToTask] = useState(false);
  const [removingUserFromTask, setRemovingUserFromTask] = useState(false);
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [create, setCreate] = useState(false);
  const [creatingTask, setCreatingTask] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
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
        const res = await axios
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
            });
            setTableData(res.data);
          });
      } catch (err) {
        console.log(err);
      }
    };
    fetchTasks();
  }, [removingUserFromTask, addingUserToTask]);

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
          console.log(res.data);
          res.data.forEach((task: any) => {
            if (task.user === null) {
              task.user = { name: "No user" };
            }
            if (task.project === null) {
              task.project = { name: "No project" };
            }
          });
          setTableData(res.data);
        });
    } catch (err) {
      console.log(err);
    }
    setCreatingTask(false);
    setCreate(false);
  }, [create]);

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
          res.data.forEach((task: any) => {
            if (task.user === null) {
              task.user = { name: "No user" };
            }
            if (task.project === null) {
              task.project = { name: "No project" };
            }
          });
          setTableData(res.data);
        });
    } catch (err) {
      console.log(err);
    }
    setEditingTask(false);
    setEdit(false);
  }, [edit]);

  const deleteTask = useCallback(async () => {
    try {
      await axios
        .delete(`http://localhost:3000/task/${taskId}`, {
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
          });
          setTableData(res.data);
        });
    } catch (err) {
      console.log(err);
    }
    setDeletingTask(false);
  }, [deletingTask]);

  const addUserToTask = useCallback(async () => {
    try {
      await axios.post(
        `http://localhost:3000/user/${taskId}/task`,
        { id: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
    setAddingUserToTask(false);
  }, [userId]);

  const removeUserFromTask = useCallback(async () => {
    try {
      await axios.delete(`http://localhost:3000/user/${taskId}/task`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
    setRemovingUserFromTask(false);
  }, [removingUserFromTask]);

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

  useEffect(() => {
    switch (true) {
      case edit:
        editTask();
        break;
      case deletingTask:
        deleteTask();
        break;
      case addingUserToTask:
        addUserToTask();
        break;
      case removingUserFromTask:
        removeUserFromTask();
        break;
      case create:
        createTask();
        break;
      default:
        getAllUsers();
        break;
    }
  }, [create, edit, deletingTask, addingUserToTask, removingUserFromTask]);

  const handleStartEdit = (task: any) => {
    setTaskId(task.id);
    setOriginalTaskName(task.name);
    setOriginalTaskDescription(task.description);
    setOriginalTaskStatus(task.status);
    setEditingTask(true);
  };
  const handleEdit = () => {
    setEdit(true);
  };

  const handleDelete = (taskId: string) => {
    setDeletingTask(true);
    setTaskId(taskId);
  };

  const handleAddingUserToTask = (userId: string, taskId: string) => {
    setTaskId(taskId);
    setUserId(userId);
    setAddingUserToTask(true);
    setAnchorEl(null);
  };
  const handleRemoveUserFromTask = (taskId: string) => {
    setRemovingUserFromTask(true);
    setTaskId(taskId);
  };

  const handleClickOnDropDown = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStartCreate = () => {
    setCreatingTask(true);
  };

  const handleCreate = () => {
    setCreate(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          taskstatus={(e: any) => setTaskStatus(e.target.value)}
        ></EditTaskPanel>
        <CreateTaskPanel
          close={() => setCreatingTask(false)}
          status={creatingTask}
          method={"Create task"}
          submit={handleCreate}
          taskname={(e: any) => setTaskName(e.target.value)}
          taskdescription={(e: any) => setTaskDescription(e.target.value)}
          taskstatus={(e: any) => setTaskStatus(e.target.value)}
          projectId={setProjectId}
          projectName={setProjectName}
        ></CreateTaskPanel>
        <Navbar />
        <Button
          variant="contained"
          color="success"
          onClick={() => handleStartCreate()}
        >
          <AddCircleIcon />
        </Button>
        <DefaultTable
          headers={[
            "Name",
            "Description",
            "Status",
            "User",
            "Project",
            "Archived",
            " ",
          ]}
          data={tableData.map((task: any) => (
            <TableRow key={task.id}>
              <TableCell>{task.name}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{task.user.name}</TableCell>
              <TableCell>{task.project.name}</TableCell>
              <TableCell>
                {task.archived ? "Archived" : "Unarchived "}
              </TableCell>
              <TableCell sx={{ display: "flex", flexDirection: "row" }}>
                {task.user.name === "No user" && (
                  <div>
                    <Tooltip title="Add User">
                      <Button
                        id={task.id}
                        variant="contained"
                        onClick={(e) => handleClickOnDropDown(e)}
                      >
                        Add User
                      </Button>
                    </Tooltip>
                    <Menu
                      anchorEl={anchorEl}
                      id="users"
                      open={open}
                      onClose={handleClose}
                    >
                      {users.map((user: any) => (
                        <MenuItem
                          key={user.id}
                          onClick={() =>
                            handleAddingUserToTask(user.id, task.id)
                          }
                        >
                          {user.name}
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>
                )}
                {task.user.name !== "No user" && (
                  <Button
                    onClick={() => handleRemoveUserFromTask(task.id)}
                    variant="contained"
                  >
                    Remove User
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={() => handleStartEdit(task)}
                >
                  <EditIcon />
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  id={task.id}
                  onClick={() => handleDelete(task.id)}
                >
                  <DeleteIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        ></DefaultTable>
      </ThemeProvider>
    </React.Fragment>
  );
};
