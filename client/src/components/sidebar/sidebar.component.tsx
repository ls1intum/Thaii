import "./styles/sidebar.styles.css";
import {
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { menu_items } from "./helpers/sidebar.helpers";
import { MenuItem, SidebarParams } from "../../types/types/sidebar.types";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  Sidebar as SidebarIcon,
  MessageSquare,
  Archive,
  BarChart,
  HelpCircle,
  LogOut,
  User,
} from "react-feather";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserPermissions } from "../../services/user.service";
import { addEventLog } from "../../services/interactions.service";
import DownloadButton from "./download-button/download-button.component";

function Sidebar({ open, setOpen }: SidebarParams) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    getUserPermissions().then((res) => setIsAdmin(res));
  }, []);

  function getMenuItemIcon(itemName: string) {
    switch (itemName) {
      case "Chat":
        return <MessageSquare color="#5a5a5a" />;
      case "Pages":
        return <Archive color="#5a5a5a" />;
      case "Insights":
        return <BarChart color="#5a5a5a" />;
      case "Admin":
        return <User color="#5a5a5a" />;
      case "Docs":
        return <HelpCircle color="#5a5a5a" />;
    }
    return <ChatBubbleOutlineIcon htmlColor="#5a5a5a" />;
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <nav className={open ? "sidebar" : "sidebar close"}>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: open ? "flex-end" : "center",
          }}
        >
          <IconButton
            onClick={() => setOpen(open ? false : true)}
            style={{
              border: "none",
              outline: "none",
            }}
          >
            {open ? (
              <SidebarIcon />
            ) : (
              <Tooltip title="Open Sidebar" arrow placement="right">
                <SidebarIcon />
              </Tooltip>
            )}
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {open && (
          <Grid item xs={12} sx={{ ml: "1vw", mt: "4vh", mb: "3vh" }}>
            <Stack direction={"row"} gap="1vw">
              <WavingHandIcon htmlColor="#ffd700" />
              <Typography variant="body1" color="#5a5a5a">
                <b>Hello there!</b>
              </Typography>
            </Stack>
          </Grid>
        )}
        {menu_items
          .filter((item: MenuItem) => item.name !== "Admin" || isAdmin)
          .map((item: MenuItem) => {
            return (
              <Grid
                item
                key={item.link}
                xs={12}
                sx={{
                  ml: open ? "1vw" : 0,
                  mt: "1vh",
                  display: "flex",
                  justifyContent: open ? "flex-start" : "center",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  navigate(item.link);
                  if (
                    (import.meta.env.VITE_ENABLE_TRACKING as string) == "true"
                  ) {
                    if (item.name == "Insights") {
                      addEventLog({
                        location: item.name + " - Behavioral Indicators",
                      });
                    } else {
                      addEventLog({ location: item.name });
                    }
                  }
                }}
              >
                <Stack
                  direction={"row"}
                  gap="1vw"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {open ? (
                    getMenuItemIcon(item.name)
                  ) : (
                    <Tooltip title={item.name} arrow placement="right">
                      {getMenuItemIcon(item.name)}
                    </Tooltip>
                  )}
                  {open && (
                    <Typography variant="body1" color="#5a5a5a">
                      {window.location.pathname == item.link ? (
                        <b>{item.name}</b>
                      ) : (
                        item.name
                      )}
                    </Typography>
                  )}
                </Stack>
              </Grid>
            );
          })}
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            ml: "1rem",
            mr: "1rem",
            mt: "3vh",
          }}
        >
          <DownloadButton />
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          position: "fixed",
          top: "90vh",
          left: 0,
          width: open ? "14vw" : "4vw",
        }}
      >
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid
          item
          onClick={() => {
            handleLogout();
          }}
          xs={12}
          sx={{
            display: "flex",
            justifyContent: open ? "flex-end" : "center",
            alignItems: "center",
            mr: open ? "1vw" : 0,
            mt: "1vh",
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          <Stack direction="row" spacing={2}>
            {open && (
              <Typography variant="body1" color="#5a5a5a">
                Sign out
              </Typography>
            )}
            {open ? (
              <LogOut color="#5a5a5a" />
            ) : (
              <Tooltip title={"Sign out"} arrow placement="right">
                <LogOut color="#5a5a5a" />
              </Tooltip>
            )}
          </Stack>
        </Grid>
      </Grid>
    </nav>
  );
}

export default Sidebar;
