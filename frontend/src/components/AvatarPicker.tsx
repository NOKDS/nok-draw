import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUserThunk } from "../redux/user/user.actions";
import {
  Grid,
  Button,
  CssBaseline,
  IconButton,
  Container,
} from "@mui/material";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../redux/rootReducer";
import { AnyAction } from "redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface AvatarProps {}

const Avatar: React.FC<AvatarProps> = () => {
  const avatarArray: string[] = [
    "https://i.imgur.com/ILNEfjt.png",
    "https://i.imgur.com/TF9TEjr.png",
    "https://i.imgur.com/dpMYaXu.png",
    "https://i.imgur.com/Y412yO8.png",
    "https://i.imgur.com/DToTkDh.png",
    "https://i.imgur.com/7P3Ncsk.png",
    "https://i.imgur.com/ky6Fjc0.png",
    "https://i.imgur.com/WnjTXAa.png",
    "https://i.imgur.com/BWasaAA.png",
    "https://i.imgur.com/8laaP4z.png",
    "https://i.imgur.com/Ed34k87.png",
    "https://i.imgur.com/xUW73LZ.jpg",
    "https://i.imgur.com/RnzsTJw.jpg",
    "https://i.imgur.com/oCdKdbc.jpg",
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch() as ThunkDispatch<RootState, null, AnyAction>;

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (avatar: string) => {
    const newAvatar = {
      image: avatar,
    };

    try {
      await dispatch(updateUserThunk(newAvatar));
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <CssBaseline />
      <Container sx={{ pt: 20 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon sx={{ fontSize: 32 }} />
        </IconButton>
        <Grid container spacing={2} justifyContent="center" sx={{ pt: 5 }}>
          {avatarArray.map((avatar, index) => (
            <Grid item key={index} xs="auto" sm="auto" md="auto">
              <div className="avatar-element">
                <Button
                  onClick={() => handleSubmit(avatar)}
                  className="avatar-submit-btn"
                  sx={{
                    width: "100%",
                    borderRadius: "50%",
                    "&:hover": {
                      border: "2px solid #007BFF",
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <img
                    src={avatar}
                    alt={`user profile ${index}`}
                    className="avatar-image"
                    style={{
                      width: "15rem",
                      height: "15rem",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </Button>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Avatar;
