import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { authRoutes } from "../static/route";
import { getSession } from "../hooks/getSession";

export const AuthMiddleware = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user: sessionUser } = await getSession();
        setUser(sessionUser);

        if (!sessionUser && !authRoutes.includes(pathname)) {
          navigate("/");
        } else if (authRoutes.includes(pathname) && sessionUser) {
          navigate("/home");
        }
      } catch {
        if (!authRoutes.includes(pathname)) {
          navigate("/");
        }
      }
    };

    checkAuth();
  }, [pathname, navigate]);

  if ((!user && !authRoutes.includes(pathname)) || (authRoutes.includes(pathname) && user)) return null;

  return <Outlet />;
};
