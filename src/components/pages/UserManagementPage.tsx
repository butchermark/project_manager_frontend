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
    const changeUserStatus = async () => {
      if (suspendStatus === false) {
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
              console.group(typeof res.data);
            });
        } catch (err) {
          console.log(err);
        }
      } else {
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
              setTableData(res.data); //Ez az ami hianyzott
              console.log(typeof res.data);
            });
        } catch (err) {
          console.log(err);
        }
      }
    };
    changeUserStatus();
  }, [suspendStatus, userId]);

  const handleSuspend = (userId: string, status: boolean) => {
    setSuspendStatus(status);
    setUserId(userId);
    console.log(userId);
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
            <TableCell>{user.isSuspended ? "Active" : "Suspended"}</TableCell>
            <TableCell>{user.lastLogin}</TableCell>
            <TableCell>
              <Button
                variant="contained"
                id={user.id}
                onClick={(e) => handleSuspend(user.id, user.isSuspended)}
              >
                {user.isSuspended ? "Re-activate" : "Suspend"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      ></DefaultTable>
    </React.Fragment>
  );
};
