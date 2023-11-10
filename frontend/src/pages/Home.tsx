import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Typewriter from "typewriter-effect";
import { useTheme } from "../context/ThemeContext";
import Footer from "../components/Footer";
import RenderVideoBackground from "../components/RenderVideoBackground";

// @ts-ignore
import Video1 from "../assets/BackgroundVideo10.mp4";
// @ts-ignore
import Video2 from "../assets/BackgroundVideo1.mp4";

const cardsData = [
  {
    id: 1,
    title: "Single Mode",
    description: "Challenge yourself",
    imageUrl: "https://source.unsplash.com/random?wallpapers",
  },
  {
    id: 2,
    title: "Multipler Mode",
    description: "Challenge your friends",
    imageUrl: "https://source.unsplash.com/random?nature",
  },
];

export default function Home() {
  const { darkMode } = useTheme();

  const renderHeaderSection = () => (
    <Box sx={{ pt: 40 }}>
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{
            color: darkMode === true ? "lime" : "yellow",
          }}
        >
          <div className="">
            <Typewriter
              options={{
                strings: [
                  "NOK-Draw",
                  "Dive into artistry!",
                  "Draw for victory!",
                ],
                autoStart: true,
                loop: true,
                delay: 100,
                deleteSpeed: 20,
              }}
            />
          </div>
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          paragraph
          sx={{
            color: darkMode === true ? "white" : "white",
            p: 1,
          }}
        >
          Will your creations conquer the machine's judgment? Get ready to
          sketch, astonish, and claim your artistic triumph!
        </Typography>
        <Stack
          sx={{ pt: 4 }}
          direction="row"
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="outlined"
            sx={{
              fontWeight: "bold",
              color: darkMode === true ? "white" : "black",
              borderColor: darkMode === true ? "white" : "black",
              "&:hover": {
                bgcolor: darkMode === true ? "red" : "pink",
                borderColor: darkMode === true ? "white" : "skyblue",
              },
            }}
          >
            Play as a guest
          </Button>
          <Button variant="contained" href="/login">
            Login
          </Button>
        </Stack>
      </Container>
    </Box>
  );

  const renderFeaturesSection = () => (
    <Container sx={{ pt: 25 }} maxWidth="md">
      <Typography
        variant="h3"
        align="center"
        color="text.secondary"
        paragraph
        sx={{
          mb: 5,
          fontWeight: "bold",
          color: darkMode === true ? "#fff" : "#fff",
        }}
      >
        Features
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        paragraph
        sx={{
          m: 3,
          color: darkMode === true ? "#fff" : "#fff",
        }}
      >
        Discover Powerful Features
      </Typography>
      <Grid container spacing={4}>
        {cardsData.map((card) => (
          <Grid item key={card.id} xs={12} sm={6} md={6}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              elevation={8}
            >
              <CardMedia
                component="div"
                sx={{
                  pt: "60%",
                }}
                image={card.imageUrl}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.title}
                </Typography>
                <Typography gutterBottom variant="subtitle1" component="p">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  return (
    <div>
      <RenderVideoBackground videoSource={Video1} low={30} high={70} />
      <Container>
        <CssBaseline />
        <section className="section1" style={{ height: "100vh" }}>
          {renderHeaderSection()}
        </section>
      </Container>
      <div style={{ position: "relative" }}>
        <RenderVideoBackground videoSource={Video2} low={30} high={70} />
        <Container>
          <CssBaseline />
          <section className="section2" style={{ height: "100vh" }}>
            {renderFeaturesSection()}
          </section>
          <Footer />
        </Container>
      </div>
    </div>
  );
}
