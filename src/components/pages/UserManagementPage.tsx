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
  Container,
  Typography,
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
  const [userId, setUserId] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [userName, setCreateUserName] = useState("");
  const [userEmail, setCreateUserEmail] = useState("");
  const [userPassword, setCreateUserPassword] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editingUser, setEditingUser] = useState(false);
  const [originalUserName, setOriginalUserName] = useState("");
  const [originalUserEmail, setOriginalUserEmail] = useState("");
  const [isReload, setIsReload] = useState(true);
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
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
            setIsReload(false);
          });
      } catch (err) {
        console.log(err);
      }
    };
    getAllUsers();
  }, [isReload]);

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
          setIsReload(true);
        });
    } catch (err) {
      console.log(err);
    }
    setCreatingUser(false);
  }, [userName, userEmail, userPassword]);

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
          setIsReload(true);
        });
    } catch (err) {
      console.log(err);
    }
    setEditingUser(false);
  }, [userId, editUserEmail, editUserName]);

  const deleteUser = useCallback(
    async (userId: string) => {
      try {
        await axios
          .delete(`http://localhost:3000/user/${userId}`, {
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
    },
    [userId]
  );

  const suspendUser = useCallback(async (userId: string) => {
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
          setIsReload(true);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const unsuspendUser = useCallback(async (userId: string) => {
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
          setIsReload(true);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleSuspend = (userId: string, status: boolean) => {
    if (status) {
      unsuspendUser(userId);
    } else {
      suspendUser(userId);
    }
  };

  const handleDelete = (userId: string) => {
    deleteUser(userId);
  };

  const handleCreate = () => {
    if (!userName || !userEmail || !userPassword) {
      window.alert("Please fill all the fields");
    } else if (regexExp.test(userEmail)) {
      createUser();
    } else {
      window.alert("Please enter a valid email");
    }
  };

  const handleStartEdit = (user: any) => {
    setUserId(user.id);
    setOriginalUserName(user.name);
    setOriginalUserEmail(user.email);
    setEditingUser(true);
  };

  const handleEdit = () => {
    if (regexExp.test(editUserEmail)) {
      editUser();
    } else {
      window.alert("Please enter a valid email");
    }
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
        <Container sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
          <Typography color="primary" variant="h4">
            User Management
          </Typography>
        </Container>
        <Container sx={{ mt: 5 }}>
          <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ padding: 0 }}
              variant="contained"
              color="success"
              onClick={() => setCreatingUser(true)}
            >
              <Container sx={{ padding: 0 }}>
                <Typography>Add New User</Typography>
                <AddCircleIcon />
              </Container>
            </Button>
          </Container>
          <DefaultTable
            headers={[
              "Name",
              "Email",
              "Role",
              "Account Status",
              "Last Login",
              "",
            ]}
            data={tableData.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
                <TableCell>
                  {user.isSuspended ? "Suspended" : "Active"}
                </TableCell>
                <TableCell>
                  {user.lastLogin === "2000-01-01"
                    ? "Not logged yet"
                    : user.lastLogin}
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
                    {user.isSuspended ? (
                      <PowerSettingsNewIcon />
                    ) : (
                      <BlockIcon />
                    )}
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
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
};
