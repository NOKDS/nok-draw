import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { useTheme } from "../context/ThemeContext";

function Copyright() {
  const { theme } = useTheme();

  return (
    <Container>
      <Typography
        variant="body2"
        color={theme.palette.secondary.main}
        align="center"
      >
        {"Copyright © "}
        <Link
          color={theme.palette.secondary.main}
          href="https://github.com/NOKDS/nok-draw"
        >
          NOK
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Container>
  );
}

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div>
      <Container
        sx={{
          position: "sticky",
          left: 0,
          bottom: 0,
        }}
        component="footer"
      >
        <Typography
          variant="subtitle1"
          align="center"
          // color="text.secondary"
          component="p"
          color={theme.palette.secondary.main}
        >
          Play & learn!
        </Typography>
        <Copyright />
      </Container>
    </div>
  );
};

export default Footer;
