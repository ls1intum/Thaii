import { Box, Typography } from "@mui/material";
import { SidebarParams } from "../sidebar/types/sidebar.types";

function Documentation({ open }: SidebarParams) {
  return (
    <div className={open ? "chat open" : "chat close"}>
      <Box
        style={{ width: "100%", height: "100%" }}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Typography variant="h4">Coming soon</Typography>
      </Box>
    </div>
  );
}

export default Documentation;
