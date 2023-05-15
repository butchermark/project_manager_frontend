import {
  Modal,
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { EStatus } from "../../shared/status.enum";

export const EditProjectPanel = (props: any) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [admins, setAdmins] = useState([]);
  const [addAdminButtonText, setAddAdminButtonText] = useState("Add admin");
  const [statusAnchorEl, setStatusAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const statusOpen = Boolean(statusAnchorEl);
  const [addStatusButtonText, setAddStatusButtonText] = useState("Add status");
  const open = Boolean(anchorEl);
  useEffect(() => {
    const gettAllAdmins = async () => {
      try {
        await axios
          .get("http://localhost:3000/user/admins/", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
          .then((res) => {
            setAdmins(res.data);
          });
      } catch (e) {
        console.log(e);
      }
    };
    gettAllAdmins();
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickOnDropDown = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSelectAdmin = (admin: any, adminName: string) => {
    props.projectmanager(admin);
    setAddAdminButtonText(adminName);
    setAnchorEl(null);
  };
  const handleSubmit = () => {
    props.submit();
    props.changeadminbuttontext(false);
  };
  const handleCloseStatus = () => {
    setStatusAnchorEl(null);
  };

  const handleSelectStatus = (status: string) => {
    props.projectstatus(status);
    setAddStatusButtonText(status);
    setStatusAnchorEl(null);
  };

  const handleClickOnStatusDropDown = (event: any) => {
    setStatusAnchorEl(event.currentTarget);
  };

  return (
    <Modal
      sx={{ display: "flex", alignItems: "center" }}
      open={props.status}
      onClose={props.close}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 400,
          maxHeight: 530,
          backgroundColor: "white",
          padding: 3,
          width: "100%",
          position: "relative",
        }}
        maxWidth={false}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: 2,
          }}
        >
          <Typography variant="h5">{props.method}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography>Name</Typography>
          <TextField
            sx={{ height: "30px", marginBottom: 3 }}
            onChange={(e) => props.projectname(e)}
          />
          <Typography>Description</Typography>
          <TextField
            sx={{ height: "30px", marginBottom: 3 }}
            onChange={(e) => props.projectdescription(e)}
          />
          <Typography>Status</Typography>
          <Tooltip title="Update" onClick={handleClickOnStatusDropDown}>
            <Button variant="contained">{addStatusButtonText}</Button>
          </Tooltip>
          <Menu
            anchorEl={statusAnchorEl}
            open={statusOpen}
            onClose={handleCloseStatus}
          >
            <MenuItem onClick={() => handleSelectStatus(EStatus.DONE)}>
              {EStatus.DONE}
            </MenuItem>
            <MenuItem onClick={() => handleSelectStatus(EStatus.TO_DO)}>
              {EStatus.TO_DO}
            </MenuItem>
            <MenuItem onClick={() => handleSelectStatus(EStatus.IN_PROGRESS)}>
              {EStatus.IN_PROGRESS}
            </MenuItem>
          </Menu>
          <Typography>Admin</Typography>
          <Tooltip title="Add to project">
            <Button
              variant="contained"
              onClick={(e) => handleClickOnDropDown(e)}
            >
              {props.changeadminbuttontext === false
                ? "Add admin"
                : addAdminButtonText}
            </Button>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
          >
            {admins.map((admin: any) => (
              <MenuItem
                key={admin.id}
                onClick={() => handleSelectAdmin(admin, admin.name)}
              >
                {admin.name}
              </MenuItem>
            ))}
          </Menu>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={handleSubmit}
              color="success"
              variant="contained"
              sx={{ width: 10, marginTop: 2 }}
              disabled={addAdminButtonText === "Add admin"}
            >
              Edit
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
};
