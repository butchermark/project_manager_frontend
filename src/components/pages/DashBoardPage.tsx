import React, { useEffect, useState } from "react";
import { Navbar } from "../UI/Navbar";
import { DefaultTable } from "../UI/DefaultTable";
import axios from "axios";
import {
  Button,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";

export const DashBoardPage = () => {
  const [taskStatus, setTaskStatus] = useState("");
  const [taskId, setTaskId] = useState("");
  const [tableData, setTableData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/user/${userId}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setTableData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTasks();

    if (taskStatus) {
      const updateTask = async () => {
        try {
          await axios.put(
            `http://localhost:3000/task/${taskId}`,
            {
              status: taskStatus,
              userId: userId,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          fetchTasks();
        } catch (err) {
          console.log(err);
        }
      };
      updateTask();
    }
  }, [taskStatus, taskId, userId]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = async (event: any) => {
    setTaskStatus(event.currentTarget.textContent);
    setTaskId(anchorEl ? anchorEl.id.toString() : "");
    setAnchorEl(null);
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <React.Fragment>
      <Navbar />
      <DefaultTable
        headers={["Name", "Description", "Status", "Archived", " "]}
        data={tableData.map((task: any) => (
          <TableRow key={task.id}>
            <TableCell>{task.name}</TableCell>
            <TableCell>{task.description}</TableCell>
            <TableCell>{task.status}</TableCell>
            <TableCell>{task.archived ? "Archived" : "Unarchived "}</TableCell>
            <TableCell>
              <Tooltip title="Update">
                <Button id={task.id} onClick={(e) => handleClick(e)}>
                  Update
                </Button>
              </Tooltip>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem id={task.id} onClick={(e) => handleUpdate(e)}>
                  In Progress
                </MenuItem>
                <MenuItem id={task.id} onClick={(e) => handleUpdate(e)}>
                  Done
                </MenuItem>
              </Menu>
            </TableCell>
          </TableRow>
        ))}
      ></DefaultTable>
    </React.Fragment>
  );
};
