import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../../helpers/auth.helpers";
import { useState, useEffect } from "react";
import { refreshToken } from "../../api/auth.api";
import { useAuthStore } from "../../states/global.store";

function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const { authenticated, setAuthenticated } = useAuthStore();

  useEffect(() => {
    const auth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }
      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp || Date.now() / 1000;
      const now = Date.now() / 1000;

      if (tokenExpiration < now) {
        try {
          await tokenRefresh();
          setAuthenticated(true);
        } catch (error) {
          setAuthenticated(false);
        }
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    };
    auth();
  }, [setAuthenticated]);

  const tokenRefresh = async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    refreshToken(String(refresh))
      .then((res: any) => {
        localStorage.setItem(ACCESS_TOKEN, res);
        setAuthenticated(true);
      })
      .catch(() => {
        setAuthenticated(false);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
