import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { SidebarParams } from "../sidebar/types/sidebar.types";
import AdminTitle from "./admin-title/admin-title.component";
import { getUsers, getWhitelist } from "../../services/user.service";
import { UserDTO, WhitelistDTO } from "../../types/register/register.types";
import { lazy, Suspense, useEffect, useState } from "react";
import LoadingComponent from "../general/loading-component/loading.component";
import { GridExpandMoreIcon } from "@mui/x-data-grid";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryFallback from "../general/error-boundary/error-boundary.component";

const UserTable = lazy(() => import("./user-table/user-table.component"));
const WhitelistTable = lazy(
  () => import("./whitelist-table/whitelist-table.component")
);

function AdminTable({ open }: SidebarParams) {
  const theme = useTheme();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [whitelist, setWhitelist] = useState<WhitelistDTO[]>([]);
  const [, setError] = useState([]);

  const fetchUsersData = async () => {
    getUsers()
      .then((res: UserDTO[]) => setUsers(res))
      .catch((error) => {
        setError(error);
      });
  };

  const fetchWhitelistData = async () => {
    getWhitelist()
      .then((res: WhitelistDTO[]) => setWhitelist(res))
      .catch((error) => setError(error));
  };

  useEffect(() => {
    fetchUsersData();
    fetchWhitelistData();
  }, []);

  return (
    <div className={open ? "chat open" : "chat close"}>
      <Box>
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              ml: "2rem",
              mr: "2rem",
              borderBottom: `1px solid ${theme.palette.secondary.light}`,
            }}
          >
            <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
              <Suspense fallback={<LoadingComponent />}>
                <AdminTitle />
              </Suspense>
            </ErrorBoundary>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              ml: "2rem",
              mr: "2rem",
              mt: "2rem",
              mb: "1rem",
            }}
          >
            <Accordion>
              <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                <Typography
                  variant="body1"
                  color={theme.palette.secondary.dark}
                >
                  <b>Whitelist Users</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
                  <Suspense fallback={<LoadingComponent />}>
                    <WhitelistTable
                      whitelisted_emails={whitelist}
                      fetchWhitelist={fetchWhitelistData}
                    />
                  </Suspense>
                </ErrorBoundary>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              ml: "2rem",
              mr: "2rem",
              mb: "1rem",
            }}
          >
            <Accordion>
              <AccordionSummary expandIcon={<GridExpandMoreIcon />}>
                <Typography
                  variant="body1"
                  color={theme.palette.secondary.dark}
                >
                  <b>Manage Users</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ErrorBoundary fallback={<ErrorBoundaryFallback />}>
                  <Suspense fallback={<LoadingComponent />}>
                    <UserTable users={users} fetchUsers={fetchUsersData} />
                  </Suspense>
                </ErrorBoundary>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default AdminTable;
