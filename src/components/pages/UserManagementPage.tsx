import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Navbar } from "../UI/Navbar";
import { DefaultTable } from "../UI/DefaultTable";
import { TableRow, TableCell, Button } from "@mui/material";

export const UserManagementPage = () => {
  const [tableData, setTableData] = useState([]);
  const [suspendStatus, setSuspendStatus] = useState(false);
  const [userId, setUserId] = useState("");
  const [deletingUser, setDeletingUser] = useState(false);
  const [suspendingUser, setSuspendingUser] = useState(false);

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

  useEffect(() => {
    const userAction = async () => {
      if (suspendingUser && !suspendStatus) {
        try {
          await axios
            .put(
              `http://localhost:3000/user/${userId}`,
              {
                isSuspended: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            )
            .then((res) => {
              setTableData(res.data);
              console.group(res.data);
            });
        } catch (err) {
          console.log(err);
        }
      } else if (deletingUser) {
        try {
          await axios
            .delete(`http://localhost:3000/user/${userId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            })
            .then((res) => {
              setTableData(res.data);
              console.log(res.data);
            });
        } catch (err) {
          console.log(err);
        }
      } else if (suspendingUser && suspendStatus) {
        try {
          await axios
            .put(
              `http://localhost:3000/user/${userId}`,
              {
                isSuspended: false,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            )
            .then((res) => {
              setTableData(res.data);
              console.log(typeof res.data);
            });
        } catch (err) {
          console.log(err);
        }
      }
    };
    userAction();
    setDeletingUser(false);
    setSuspendingUser(false);
  }, [suspendStatus, userId]);

  const handleSuspend = (userId: string, status: boolean) => {
    setSuspendingUser(true);
    setSuspendStatus(status);
    setUserId(userId);
    console.log(status);
  };

  const handleDelete = (userId: string) => {
    setDeletingUser(true);
    setUserId(userId);
  };

  return (
    <React.Fragment>
      <Navbar />
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
                {user.isSuspended ? "Re-activate" : "Suspend"}
              </Button>
              <Button
                color="warning"
                variant="outlined"
                id={user.id}
                onClick={(e) => handleDelete(user.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      ></DefaultTable>
    </React.Fragment>
  );
};
