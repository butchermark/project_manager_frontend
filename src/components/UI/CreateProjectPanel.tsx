import {
  Container,
  Typography,
  TextField,
  Modal,
  Box,
  Button,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import AddCircleOutLineIcon from "@mui/icons-material/AddCircle";
import React, { useState } from "react";
import { EStatus } from "../../shared/status.enum";

export const CreateProjectPanel = (props: any) => {
  const [statusAnchorEl, setStatusAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const statusOpen = Boolean(statusAnchorEl);
  const [addStatusButtonText, setAddStatusButtonText] = useState("Add status");

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
          maxHeight: 500,
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
          <TextField onChange={(e) => props.projectname(e)} />
          <Typography>Description</Typography>
          <TextField onChange={(e) => props.projectdescription(e)} />
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
              color="success"
              variant="contained"
              sx={{ width: 10, marginTop: 2 }}
              onClick={props.submit}
            >
              <AddCircleOutLineIcon />
            </Button>
          </Box>
        </Box>
      </Container>
    </Modal>
  );
};
