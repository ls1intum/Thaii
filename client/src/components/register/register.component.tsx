import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import "./styles/register.styles.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { InputError } from "../../types/general/general.types";
import EmailField from "./email-field/email-field.component";
import PasswordFields from "./password-fields/password-fields.component";
import { register } from "../../services/auth.service";
import ErrorAlert from "./error-alert/error-alert.component";
import SuccessAlert from "./success-alert/success-alert.component";

function Register() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<InputError>({
    error: false,
    errorMessage: "",
  });
  const [emailError, setEmailError] = useState<InputError>({
    error: false,
    errorMessage: "",
  });
  const [passwordError, setPasswordError] = useState<InputError>({
    error: false,
    errorMessage: "",
  });

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: any) => {
    setLoading(true);
    setSuccess(false);
    e.preventDefault();

    if (!isValidEmail(email)) {
      setEmailError({
        error: true,
        errorMessage: "Please provide a valid email.",
      });
      setLoading(false)
      return;
    }
    if (password !== confirmedPassword) {
      setPasswordError({
        error: true,
        errorMessage: "Password and confirmed password are not the same.",
      });
      setLoading(false)
      return;
    }
    if (!isValidPassword(password)) {
      setPasswordError({
        error: true,
        errorMessage:
          "Password does not fullfill the password strength constraints.",
      });
      setLoading(false)
      return;
    }
    register({ username: email, password: password })
      .then(() => setSuccess(true))
      .catch((error: any) => {
        setError({
          error: true,
          errorMessage: error,
        });
      })
      .finally(() => {
        setLoading(false);
        setPasswordError({
          error: false,
          errorMessage: "",
        });
        setEmailError({
          error: false,
          errorMessage: "",
        });
      });
  };

  return (
    <div className="register">
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
                <b>Sign Up</b>
              </Typography>
            </Grid>
            {error.error && <ErrorAlert errorMsg={error.errorMessage} />}
            {success && <SuccessAlert />}
            <Grid item xs={12} sx={{ mt: "2rem" }}>
              <EmailField
                email={email}
                setEmail={setEmail}
                error={emailError}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: "1rem" }}>
              <PasswordFields
                password={password}
                setPassword={setPassword}
                confirmedPassword={confirmedPassword}
                setConfirmedPassword={setConfirmedPassword}
                error={passwordError}
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
                disabled={loading}
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
                    <b>Sign up</b>
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
              <Typography variant="body2">
                Already have an account?{" "}
                {
                  <Link to={"/login"}>
                    <b>Sign In</b>
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

export default Register;
