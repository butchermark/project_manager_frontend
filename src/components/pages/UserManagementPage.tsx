import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Navbar } from "../UI/Navbar";
import { DefaultTable } from "../UI/DefaultTable";
import {
  TableRow,
  TableCell,
  Tooltip,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

export const UserManagementPage = () => {
  const [tableData, setTableData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const asd = () => {
    console.log("ASD");
  };
  return (
    <React.Fragment>
      <Navbar />
      <DefaultTable
        headers={["Name", "Email", "Role", "Suspended", "Last Login"]}
        data={tableData.map((user: any) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
            <TableCell>{user.isSuspended ? "Suspended" : "Active "}</TableCell>
            <TableCell>{user.lastLogin}</TableCell>
            <TableCell>
              <Tooltip title="Update">
                <Button id={user.id} onClick={asd}>
                  Update
                </Button>
              </Tooltip>
              <Menu anchorEl={anchorEl} open={open} onClose={asd}>
                <MenuItem id={user.id} onClick={asd}>
                  In Progress
                </MenuItem>
                <MenuItem id={user.id} onClick={asd}>
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
