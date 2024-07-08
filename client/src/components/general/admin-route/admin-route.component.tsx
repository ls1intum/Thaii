import { useEffect, useState } from "react";
import { getUserPermissions } from "../../../services/user.service";
import { ACCESS_TOKEN } from "../../../helpers/auth.helpers";
import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const token = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    if (token) {
      getUserPermissions().then((res) => setIsAdmin(res));
    }
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

export default AdminRoute;
