import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/NOKDS/nok-draw">
        NOK
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Footer() {
  return (
    <div>
      <Container
        sx={{
          position: "relative",
          left: 0,
          bottom: 0,
        }}
        component="footer"
      >
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Play & learn!
        </Typography>
        <Copyright />
      </Container>
    </div>
  );
}
