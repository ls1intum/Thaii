import { InputAdornment, TextField, Typography } from "@mui/material";
import { EmailFieldParams } from "../../../types/register/register.types";
import { Mail } from "react-feather";

function EmailField({ email, setEmail, error }: EmailFieldParams) {
  return (
    <>
      <TextField
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        placeholder="Email"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Mail />
            </InputAdornment>
          ),
        }}
        variant="outlined"
        fullWidth
        size="small"
        sx={{
          borderRadius: 2,
          border: error.error ? "solid 1px red" : 0,
          mt: "0.5rem",
          background: "#f5f5f5",
          "& fieldset": { border: "none" },
        }}
      />
      {error.error && (
        <Typography variant="caption" color="red">
          {error.errorMessage}
        </Typography>
      )}
    </>
  );
}

export default EmailField;
