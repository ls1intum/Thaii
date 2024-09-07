import { Grid } from "@mui/material";
import Sidebar from "../sidebar/sidebar.component";
import { Outlet } from "react-router-dom";
import { SidebarParams } from "../../types/types/sidebar.types";
import Footer from "../footer/footer.component";

function PageLayout({ open, setOpen }: SidebarParams) {
  return (
    <Grid container className="box">
      <Grid item>
        <Sidebar open={open} setOpen={setOpen} />
      </Grid>
      <Grid item>
        <Outlet />
      </Grid>
      <Grid item>
        <Footer />
      </Grid>
    </Grid>
  );
}

export default PageLayout;
