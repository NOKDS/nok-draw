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
import avatars from "./RenderAvatars";

const Avatar: React.FC = () => {
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
      navigate(-1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <CssBaseline />
      <Container sx={{ pt: 15 }}>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon sx={{ fontSize: 32 }} />
        </IconButton>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 2, textAlign: "center", width: "100%" }}
        >
          {avatars.map((avatar, index) => (
            <Grid item key={index} xs={6} sm={6} md={4} lg={4} xl={4}>
              <Button
                onClick={() => handleSubmit(avatar)}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  borderRadius: "50%",
                  "&:hover": {
                    "& img": {
                      transform: "scale(1.05)",
                    },
                    border: "2px solid #007BFF",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <img
                  key={index}
                  src={avatar}
                  alt={`user profile ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    transition: "transform 0.2s ease-in-out",
                  }}
                />
              </Button>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default Avatar;
