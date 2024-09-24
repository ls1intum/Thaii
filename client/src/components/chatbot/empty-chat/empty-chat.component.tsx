import { Alert, Box, Typography } from "@mui/material";

function EmptyChat({message}: any) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Alert severity="info">
        <Typography>
          {message}
        </Typography>
      </Alert>
    </Box>
  );
}

export default EmptyChat;
