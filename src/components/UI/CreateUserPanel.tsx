import {
  Container,
  Typography,
  TextField,
  Modal,
  Box,
  Button,
} from "@mui/material";
import AddCircleOutLineIcon from "@mui/icons-material/AddCircle";

export const CreateUserPanel = (props: any) => {
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
          maxHeight: 400,
          backgroundColor: "white",
          padding: 3,
          width: "100%",
          position: "relative",
        }}
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
          <TextField onChange={(e) => props.username(e)} />
          <Typography>E-mail</Typography>
          <TextField onChange={(e) => props.useremail(e)} />
          <Typography>Password</Typography>
          <TextField onChange={(e) => props.userpassword(e)} />
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
