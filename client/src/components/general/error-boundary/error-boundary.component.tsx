import { Box, Typography } from "@mui/material";

function ErrorBoundaryFallback() {
  return (
    <Box>
      <Typography>Error has happened</Typography>
    </Box>
  );
}

export default ErrorBoundaryFallback;
