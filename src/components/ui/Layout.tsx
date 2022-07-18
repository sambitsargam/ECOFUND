import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { Container } from "@mui/material";
import { useGlobalContext } from "../../context/GlobalContext";
import { Notifications } from "./Notifications";
import { useMoralis } from "react-moralis";
import { makeStyles } from "@mui/styles";
import { RequireAuth } from "./RequireAuth";
import { useLocation } from "react-router-dom";
import Image from "../../images/shokunin_World_Map.svg";
import { isRoutePublic } from "../../utils/Auth";
import { useEffect } from "react";
import { GlobalSpinner } from "./GlobalSpinner"; // Import using relative path

const useStyles: any = makeStyles((theme: any) => ({
  root: {
    maxWidth: "1200px",
  },
  darkBg: {
    background: theme.palette.primary.main,
  },
  secondaryBg: {
    background: theme.palette.secondary.light,
  },
  greyBg: {
    background: "#e4e4e4",
  },
  "@keyframes animate": {
    "100%": {
      backgroundPosition: "-3000px 0",
    },
  },
  mapContainer: {
    backgroundImage: `url(${Image})`,
    minHeight: "calc(100vh - 130px)",
    width: "100%",
    backgroundRepeat: "repeat",
    backgroundPosition: "0 0",
    backgroundSize: "auto 100%",
    margin: "0 auto",
    animation: `$animate 100s linear infinite`,
  },
  container: {
    minHeight: "calc(100vh - 130px)",
    width: "100%",
    margin: "0 auto",
  },
}));

export const Layout = () => {
  const router = useLocation();
  const requireAuth = !isRoutePublic(router.pathname);
  const { isAuthenticated, user, isWeb3Enabled, enableWeb3 } = useMoralis();
  const { isLoading } = useGlobalContext();
  const classes = useStyles();

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3()
        .then()
        .catch((err: any) => console.error(err));
    }
  }, [isWeb3Enabled]);

  return (
    <div className={isAuthenticated ? classes.greyBg : classes.darkBg}>
      <Navigation />
      {isLoading && <GlobalSpinner />}
      <div className={isAuthenticated && user ? classes.container : classes.mapContainer}>
        <Notifications />
        <Container disableGutters maxWidth="lg" component="main" sx={{ py: 0 }}>
          {requireAuth && !isAuthenticated && !user ? (
            <RequireAuth>
              <Outlet />
            </RequireAuth>
          ) : (
            <Outlet />
          )}
        </Container>
      </div>
      <Footer />
    </div>
  );
};
