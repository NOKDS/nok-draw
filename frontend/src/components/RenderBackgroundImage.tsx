import { useTheme } from "../context/ThemeContext";

interface ImageBackgroundProps {
  imageSource: string;
  low: number;
  high: number;
}

const ImageBackground: React.FC<ImageBackgroundProps> = ({
  imageSource,
  low,
  high,
}) => {
  const { darkMode } = useTheme();

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundImage: `url(${imageSource})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        zIndex: -1,
        filter:
          darkMode === true ? `brightness(${low}%)` : `brightness(${high}%)`,
      }}
    ></div>
  );
};

export default ImageBackground;
