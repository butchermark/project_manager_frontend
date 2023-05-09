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
import React, { useCallback, useEffect, useState } from "react";
import { Navbar } from "../UI/Navbar";
import { DefaultTable } from "../UI/DefaultTable";
import axios from "axios";
import { EditTaskPanel } from "../UI/EditTaskPanel";

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
  const [originalTaskUserId, setOriginalTaskUserId] = useState("");
  const [originalTaskProjectId, setOriginalTaskProjectId] = useState("");
  const [edit, setEdit] = useState(false);

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
            setTableData(res.data);
          });
      } catch (err) {
        console.log(err);
      }
    };
    fetchTasks();
  }, []);

  const updateTask = useCallback(async () => {
    try {
      await axios
        .put(
          `http://localhost:3000/task/admin/${taskId}`,
          {
            name: taskName || originalTaskName || "",
            description: taskDescription || originalTaskDescription || "",
            status: taskStatus || originalTaskStatus || "",
            user: originalTaskUserId || "",
            project: originalTaskProjectId || "",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((res) => {
          setTableData(res.data);
        });
    } catch (err) {
      console.log(err);
    }
    setEditingTask(false);
    setEdit(false);
  }, [edit]);

  useEffect(() => {
    if (edit) {
      updateTask();
    }
  }, [edit]);

  const handleStartEdit = (task: any) => {
    setTaskId(task.id);
    setOriginalTaskName(task.name);
    setOriginalTaskDescription(task.description);
    setOriginalTaskStatus(task.status);
    setOriginalTaskUserId(task.user.id);
    setOriginalTaskProjectId(task.project.id);
    setEditingTask(true);
  };
  const handleEdit = () => {
    setEdit(true);
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
        <Navbar />
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
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleStartEdit(task)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        ></DefaultTable>
      </ThemeProvider>
    </React.Fragment>
  );
};
