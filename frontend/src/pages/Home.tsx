import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/NOKDS">
        NOKDS
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Home() {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Typography
        component="h6"
        variant="h2"
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        Home
      </Typography>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
