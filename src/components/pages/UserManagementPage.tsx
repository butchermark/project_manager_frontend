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
import { CreateUserPanel } from "../UI/CreateUserPanel";
import { EditUserPanel } from "../UI/EditUserPanel";
import EditIcon from "@mui/icons-material/Edit";

export const UserManagementPage = () => {
  const [tableData, setTableData] = useState([]);
  const [suspendStatus, setSuspendStatus] = useState(false);
  const [userId, setUserId] = useState("");
  const [deletingUser, setDeletingUser] = useState(false);
  const [suspendingUser, setSuspendingUser] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [userName, setCreateUserName] = useState("");
  const [userEmail, setCreateUserEmail] = useState("");
  const [userPassword, setCreateUserPassword] = useState("");
  const [create, setCreate] = useState(false);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editingUser, setEditingUser] = useState(false);
  const [edit, setEdit] = useState(false);
  const [originalUserName, setOriginalUserName] = useState("");
  const [originalUserEmail, setOriginalUserEmail] = useState("");
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

  const editUser = useCallback(async () => {
    try {
      await axios
        .put(
          `http://localhost:3000/user/${userId}`,
          {
            name: editUserName || originalUserName,
            email: editUserEmail || originalUserEmail,
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
    setEdit(false);
    setEditingUser(false);
  }, [edit]);

  useEffect(() => {
    switch (true) {
      case suspendingUser && !suspendStatus:
        suspendUser();
        break;
      case deletingUser:
        deleteUser();
        break;
      case suspendingUser && suspendStatus:
        unsuspendUser();
        break;
      case create:
        createUser();
        break;
      case edit:
        editUser();
        break;
      default:
        break;
    }
    setDeletingUser(false);
    setSuspendingUser(false);
  }, [
    suspendingUser,
    suspendStatus,
    deletingUser,
    edit,
    suspendUser,
    unsuspendUser,
    deleteUser,
    createUser,
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

  const handleStartEdit = (user: any) => {
    setUserId(user.id);
    setOriginalUserName(user.name);
    setOriginalUserEmail(user.email);
    setEditingUser(true);
  };

  const handleEdit = () => {
    setEdit(true);
  };

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <EditUserPanel
          close={() => setEditingUser(false)}
          status={editingUser}
          method={"Edit user"}
          submit={handleEdit}
          username={(e: any) => setEditUserName(e.target.value)}
          useremail={(e: any) => setEditUserEmail(e.target.value)}
        ></EditUserPanel>
        <CreateUserPanel
          close={() => setCreatingUser(false)}
          status={creatingUser}
          method={"Create new User"}
          username={(e: any) => setCreateUserName(e.target.value)}
          useremail={(e: any) => setCreateUserEmail(e.target.value)}
          userpassword={(e: any) => setCreateUserPassword(e.target.value)}
          submit={handleCreate}
        ></CreateUserPanel>

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
              <TableCell>
                {user.lastLogin === "2000-01-01"
                  ? "Not logged yet"
                  : user.lastLogin}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleStartEdit(user)}
                >
                  <EditIcon />
                </Button>
                <Button
                  variant="contained"
                  id={user.id}
                  onClick={() => handleSuspend(user.id, user.isSuspended)}
                  title={user.isSuspended ? "Unsuspend" : "Suspend"}
                >
                  {user.isSuspended ? <PowerSettingsNewIcon /> : <BlockIcon />}
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  id={user.id}
                  onClick={() => handleDelete(user.id)}
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
