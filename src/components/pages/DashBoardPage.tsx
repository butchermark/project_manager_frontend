import React, { useEffect, useState } from "react";
import { Navbar } from "../UI/Navbar";
import { DefaultTable } from "../UI/DefaultTable";
import axios from "axios";
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
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import { ThemeProvider } from "@emotion/react";
import { EStatus } from "../../shared/status.enum";

export const DashBoardPage = () => {
  const [taskStatus, setTaskStatus] = useState("");
  const [taskId, setTaskId] = useState("");
  const [tableData, setTableData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showArchived, setShowArchived] = useState(true);
  const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
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
          .get(`http://localhost:3000/user/${userId}/tasks`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
          .then((res) => {
            if (showArchived) {
              const archivedTasks = res.data.filter(
                (task: any) => !task.archived
              );
              setTableData(archivedTasks);
            } else {
              setTableData(res.data);
            }
          });
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
  }, [taskStatus, showArchived]);

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

  const handleShowArchivedTasks = () => {
    if (showArchived) {
      setShowArchived(false);
    } else {
      setShowArchived(true);
    }
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Container sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
          <Typography color="primary" variant="h4">
            Dashboard
          </Typography>
        </Container>
        <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleShowArchivedTasks()}
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
          headers={["Name", "Description", "Status", " "]}
          data={tableData.map((task: any) => (
            <TableRow key={task.id}>
              <TableCell>{task.name}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>
                <Tooltip title="Update">
                  <Button
                    variant="contained"
                    id={task.id}
                    onClick={(e) => handleClick(e)}
                  >
                    Update
                  </Button>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem id={task.id} onClick={(e) => handleUpdate(e)}>
                    {EStatus.DONE}
                  </MenuItem>
                  <MenuItem id={task.id} onClick={(e) => handleUpdate(e)}>
                    {EStatus.TO_DO}
                  </MenuItem>
                  <MenuItem id={task.id} onClick={(e) => handleUpdate(e)}>
                    {EStatus.IN_PROGRESS}
                  </MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        ></DefaultTable>
      </ThemeProvider>
    </React.Fragment>
  );
};
