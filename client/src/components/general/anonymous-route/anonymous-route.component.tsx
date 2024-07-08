import { Navigate, Outlet } from "react-router-dom";
import { ACCESS_TOKEN } from "../../../helpers/auth.helpers";

function AnonymousRoute() {
  const token = localStorage.getItem(ACCESS_TOKEN);
  return token ? <Navigate to="/" replace /> : <Outlet />;
}

export default AnonymousRoute;