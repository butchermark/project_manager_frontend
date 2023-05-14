import {
  Modal,
  Container,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

export const EditUserPanel = (props: any) => {
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
            onChange={(e) => props.username(e)}
          />
          <Typography>Email</Typography>
          <TextField
            sx={{ height: "30px", marginBottom: 3 }}
            onChange={(e) => props.useremail(e)}
          />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={props.submit}
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
