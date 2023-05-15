import {
  Modal,
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Tooltip,
  Menu,
} from "@mui/material";
import { EStatus } from "../../shared/status.enum";
import React, { useState } from "react";

export const EditTaskPanel = (props: any) => {
  const [statusAnchorEl, setStatusAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const statusOpen = Boolean(statusAnchorEl);
  const [addStatusButtonText, setAddStatusButtonText] = useState("Add status");

  const handleSubmit = () => {
    props.submit();
  };

  const handleSelectStatus = (status: string) => {
    props.taskstatus(status);
    setAddStatusButtonText(status);
    setStatusAnchorEl(null);
  };

  const handleClickOnStatusDropDown = (event: any) => {
    setStatusAnchorEl(event.currentTarget);
  };

  const handleCloseStatus = () => {
    setStatusAnchorEl(null);
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
            onChange={(e) => props.taskname(e)}
          />
          <Typography>Description</Typography>
          <TextField
            sx={{ height: "30px", marginBottom: 3 }}
            onChange={(e) => props.taskdescription(e)}
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
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={handleSubmit}
              color="success"
              variant="contained"
              sx={{ width: 10, marginTop: 2 }}
            >
              Edit
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
};
