import Image from "../assets/background.jpg";
import { styled } from "@mui/system";

const image = `url(${Image})`;

const Background = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  backgroundImage: image,
  backgroundPosition: "center",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});

export default function backgroundImage() {
  return <Background />;
}
