import axios from "axios";
import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { Navbar } from "../UI/Navbar";
import { DefaultTable } from "../UI/DefaultTable";
import {
  TableRow,
  TableCell,
  Button,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { UserForm } from "../UI/UserForm";

export const UserManagementPage = () => {
  const [tableData, setTableData] = useState([]);
  const [suspendStatus, setSuspendStatus] = useState(false);
  const [userId, setUserId] = useState("");
  const [deletingUser, setDeletingUser] = useState(false);
  const [suspendingUser, setSuspendingUser] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [create, setCreate] = useState(false);
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
    const getAllUsers = async () => {
      try {
        await axios
          .get("http://localhost:3000/user/", {
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
    getAllUsers();
  }, []);

  const suspendUser = useCallback(async () => {
    try {
      await axios
        .put(
          `http://localhost:3000/user/${userId}`,
          {
            isSuspended: true,
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
  }, [setTableData, userId]);

  const unsuspendUser = useCallback(async () => {
    try {
      await axios
        .put(
          `http://localhost:3000/user/${userId}`,
          {
            isSuspended: false,
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
  }, [setTableData, userId]);

  const deleteUser = useCallback(async () => {
    try {
      await axios
        .delete(`http://localhost:3000/user/${userId}`, {
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
  }, [setTableData, userId]);

  const createUser = useCallback(async () => {
    try {
      await axios
        .post(
          "http://localhost:3000/user/",
          {
            name: userName,
            email: userEmail,
            password: userPassword,
            isAdmin: false,
            isSuspended: false,
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
    setCreatingUser(false);
    setCreate(false);
  }, [create]);

  useEffect(() => {
    if (suspendingUser && !suspendStatus) {
      suspendUser();
    } else if (deletingUser) {
      deleteUser();
    } else if (suspendingUser && suspendStatus) {
      unsuspendUser();
    } else if (create) {
      createUser();
    }
    setDeletingUser(false);
    setSuspendingUser(false);
  }, [
    suspendingUser,
    suspendStatus,
    deletingUser,
    suspendUser,
    unsuspendUser,
    deleteUser,
    creatingUser,
  ]);

  const handleSuspend = (userId: string, status: boolean) => {
    setSuspendingUser(true);
    setSuspendStatus(status);
    setUserId(userId);
  };

  const handleDelete = (userId: string) => {
    setDeletingUser(true);
    setUserId(userId);
  };

  const handleCreate = () => {
    setCreatingUser(false);
    setCreate(true);
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <UserForm
          close={() => setCreatingUser(false)}
          status={creatingUser}
          method={"Create new User"}
          username={(e: any) => setUserName(e.target.value)}
          useremail={(e: any) => setUserEmail(e.target.value)}
          userpassword={(e: any) => setUserPassword(e.target.value)}
          submit={handleCreate}
        ></UserForm>

        <Navbar />
        <Button
          variant="contained"
          color="success"
          onClick={() => setCreatingUser(true)}
        >
          <AddCircleIcon />
        </Button>
        <DefaultTable
          headers={["Name", "Email", "Role", "Account Status", "Last Login"]}
          data={tableData.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
              <TableCell>{user.isSuspended ? "Suspended" : "Active"}</TableCell>
              <TableCell>{user.lastLogin}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  id={user.id}
                  onClick={(e) => handleSuspend(user.id, user.isSuspended)}
                >
                  {user.isSuspended ? <PowerSettingsNewIcon /> : <BlockIcon />}
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  id={user.id}
                  onClick={(e) => handleDelete(user.id)}
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
