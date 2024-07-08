import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import "./styles/login.styles.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../helpers/auth.helpers";
import { login } from "../../services/auth.service";
import { Lock, Mail } from "react-feather";

function Login() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    setLoading(true);
    setError(false);
    e.preventDefault();

    try {
      setLoading(true);
      const user = await login({ username: email, password: password });
      localStorage.setItem(ACCESS_TOKEN, user.access);
      localStorage.setItem(REFRESH_TOKEN, user.refresh);
      navigate("/");
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            minWidth: "30vw",
            maxWidth: "40vw",
            minHeight: "60vh",
            maxHeight: "85vh",
            backgroundColor: "white",
            borderRadius: 3,
          }}
        >
          <Grid
            container
            sx={{
              minWidth: "30vw",
              maxWidth: "40vw",
              minHeight: "60vh",
              maxHeight: "80vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pl: "4rem",
              pr: "4rem",
              pb: "2rem",
            }}
          >
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: "2rem",
              }}
            >
              <Typography variant="h4" color="#5a5a5a">
                <b>Sign In</b>
              </Typography>
            </Grid>
            {error && (
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: "2rem",
                }}
              >
                <Alert severity="error">
                  <Typography variant="body2">
                    <b>Username</b> or <b>Password</b> are incorrect or your
                    account has <b>not</b> been activated!
                  </Typography>
                </Alert>{" "}
              </Grid>
            )}
            <Grid item xs={12} sx={{ mt: "2rem" }}>
              <TextField
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                variant="outlined"
                fullWidth
                size="small"
                sx={{
                  borderRadius: 2,
                  mt: "1vh",
                  background: "#f5f5f5",
                  "& fieldset": { border: "none" },
                }}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter") {
                    handleSubmit(ev);
                  }
                }}
                placeholder="Email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                variant="outlined"
                type="password"
                fullWidth
                size="small"
                sx={{
                  borderRadius: 2,
                  mt: "1vh",
                  background: "#f5f5f5",
                  "& fieldset": { border: "none" },
                }}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter") {
                    handleSubmit(ev);
                  }
                }}
                placeholder="Password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: "4vh",
              }}
            >
              <Button
                onClick={(e: any) => handleSubmit(e)}
                variant="outlined"
                size="large"
                fullWidth
                style={{
                  border: "none",
                  background: "#5a5a5a",
                  outline: "none",
                  borderRadius: 6,
                }}
                sx={{ textTransform: "false" }}
              >
                <Stack direction="row" spacing={2}>
                  {loading && (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  )}
                  <Typography variant="body2" color="white">
                    <b>Sign in</b>
                  </Typography>
                </Stack>
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: "2rem",
              }}
            >
              <Typography variant="body2" color={theme.palette.primary.dark}>
                You are new here?{" "}
                {
                  <Link to={"/register"}>
                    <b>Create Account</b>
                  </Link>
                }
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            position: "absolute",
            bottom: 5,
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" color="white">
            <b>THAII</b> by LEAPS Research Group and Chair of Applied Software
            Engineering at <b>TUM</b>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default Login;
