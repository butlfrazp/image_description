import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./rotuer";
import { createTheme, ThemeProvider } from "@mui/material";


function App() {
  return (
    <ThemeProvider theme={createTheme()}>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App;
