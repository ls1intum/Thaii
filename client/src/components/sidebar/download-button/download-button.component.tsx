import { Button, Typography, useTheme } from "@mui/material";
import { getEventLogs } from "../../../services/interactions.service";
import { Download } from "react-feather";

const DownloadButton = () => {
  const theme = useTheme();

  const handleDownload = async () => {
    try {
      const response = await getEventLogs();

      // Create a link element, set its href to the blob URL, and trigger a click to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_interaction_data.xlsx"); // The file name you want to save as
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<Download />}
      sx={{ background: theme.palette.primary.dark, textTransform: "none" }}
      onClick={handleDownload}
    >
      <Typography variant="body2">Download Data</Typography>
    </Button>
  );
};

export default DownloadButton;
