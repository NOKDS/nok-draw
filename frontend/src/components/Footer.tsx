import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

function Copyright() {
  return (
    <Container>
      <Typography
        variant="body2"
        color="#fff"
        align="center"
        sx={{
          fontFamily: "'Lilita One', sans-serif",
          fontSize: { xs: "0.4rem", sm: "0.5rem", md: "0.6rem" },
        }}
      >
        {"Copyright © "}
        <Link color="#fff" href="https://github.com/NOKDS/nok-draw">
          NOK
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Container>
  );
}

const Footer: React.FC = () => {
  return (
    <div>
      <Container
        sx={{
          left: 0,
          bottom: 0,
        }}
        component="footer"
      >
        <Typography
          variant="subtitle1"
          align="center"
          component="p"
          color="#fff"
          sx={{
            fontFamily: "'Lilita One', sans-serif",

            fontSize: { xs: "0.4rem", sm: "0.5rem", md: "0.6rem" },
          }}
        >
          Play & learn!
        </Typography>
        <Copyright />
      </Container>
    </div>
  );
};

export default Footer;
