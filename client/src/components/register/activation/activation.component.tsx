import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle } from "react-feather";
import { useNavigate } from "react-router-dom";
import { activate } from "../../../services/auth.service";
import LoadingComponent from "../../general/loading-component/loading.component";

function Activation() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const queryParameters = new URLSearchParams(window.location.search);
  const uidb64 = queryParameters.get("uidb64") ?? "";
  const token = queryParameters.get("token") ?? "";

  useEffect(() => {
    const activateUser = () => {
      setLoading(true)
      setSuccess(false);
      setError(false);
      setErrorMsg("");
      activate({ uidb64, token })
        .then(() => setSuccess(true))
        .catch((err: any) => {
          setError(true);
          setErrorMsg(err);
        }).finally(() => setLoading(false));
    };
    activateUser();
  }, []);

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
            maxWidth: "35vw",
            minHeight: "45vh",
            maxHeight: "50vh",
            backgroundColor: "white",
            borderRadius: 3,
          }}
        >
          <Grid
            container
            sx={{
              minWidth: "30vw",
              maxWidth: "30vw",
              minHeight: "40vh",
              maxHeight: "45vh",
              display: "flex",
              justifyContent: "center",
              pl: "2rem",
              pr: "2rem",
            }}
          >
            <Grid
              item
              xs={12}
              sx={{ mt: "5rem", display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  width: "20vw",
                  height: "15vh",
                  backgroundColor: success ? "#E0FBE2" : error ? "#FFB0B0" : "",
                  border: success
                    ? "solid 2px green"
                    : error
                    ? "solid 2px red"
                    : "",
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  pl: "2rem",
                  pr: "2rem",
                }}
              >
                {loading ? (
                  <LoadingComponent />
                ) : (
                  <Stack direction="row" spacing={2} sx={{display: "flex", alignItems: "center"}}>
                    {success ? (
                      <>
                        <CheckCircle color="green" size="5rem" />
                        <Typography variant="body1">
                          You successfully activated your account! Click on the
                          button below to login.
                        </Typography>
                      </>
                    ) : error ? (
                      <>
                        <AlertCircle color="red" size="5rem" />
                        <Typography variant="body1">{errorMsg}</Typography>
                      </>
                    ) : ""}
                  </Stack>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={() => navigate("/login")}
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
                <Typography variant="body2" color="white">
                  <b>Go to Sign in</b>
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </div>
  );
}

export default Activation;
