import {
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { PasswordFieldsParams } from "../../../types/register/register.types";
import { Lock } from "react-feather";
import PasswordStrengthInfo from "./password-strength-info/password-strength-info.components";

function PasswordFields({
  password,
  setPassword,
  confirmedPassword,
  setConfirmedPassword,
  error,
}: PasswordFieldsParams) {

  return (
    <Grid container>
      <Grid item xs={12}>
        <TextField
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          placeholder="Password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          type="password"
          fullWidth
          size="small"
          sx={{
            borderRadius: 2,
            border: error.error ? "solid 1px red" : 0,
            mt: "1vh",
            background: "#f5f5f5",
            "& fieldset": { border: "none" },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          value={confirmedPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setConfirmedPassword(e.target.value)
          }
          placeholder="Confirm your password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          type="password"
          fullWidth
          size="small"
          sx={{
            borderRadius: 2,
            border: error.error ? "solid 1px red" : 0,
            mt: "1vh",
            background: "#f5f5f5",
            "& fieldset": { border: "none" },
          }}
        />
        {error.error && (
          <Typography variant="caption" color="red">
            {error.errorMessage}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end", mt: "0.75rem" }}>
        <PasswordStrengthInfo />
      </Grid>
    </Grid>
  );
}

export default PasswordFields;
