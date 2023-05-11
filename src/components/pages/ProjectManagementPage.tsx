import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import React from "react";
import { Navbar } from "../UI/Navbar";

export const ProjectManagementPage = () => {
  const managerId = JSON.parse(localStorage.getItem("user") ?? "").id;
  const managerName = JSON.parse(localStorage.getItem("user") ?? "").name;
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
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Navbar />
      </ThemeProvider>
    </React.Fragment>
  );
};
