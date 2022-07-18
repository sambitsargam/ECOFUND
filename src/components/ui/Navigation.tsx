import { AppBar, Toolbar } from "@mui/material";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useMoralis } from "react-moralis";
import * as React from "react";
import { makeStyles } from "@mui/styles";
import { UserInfo } from "./UserInfo";

export const Navigation = () => {
  const useStyles: any = makeStyles((theme: any) => ({
    root: {
      maxWidth: "1200px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "calc(100% - 120px)",
      margin: "0 auto",
    },
    darkBg: {
      background: theme.palette.primary.main,
    },
    lightBg: {
      background: theme.palette.primary.light,
    },
    logoOrange: {
      color: theme.palette.secondary,
    },
    logoLight: {
      color: theme.palette.primary.light,
    },
  }));

  const classes = useStyles();

  const { isAuthenticated } = useMoralis();

  return (
    <AppBar position="static" style={{ marginBottom: 30 }} color="primary" elevation={isAuthenticated ? 2 : 0}>
      <Toolbar>
        <nav className={classes.root}>
          <Link
            component={RouterLink}
            variant="h5"
            to="/"
            sx={{
              flexGrow: 1,
              marginRight: "auto",
              textDecoration: "none",
              fontWeight: "bold",
              maxWidth: "80px",
              "&:hover": { color: "primary.light" },
              color: !isAuthenticated ? "secondary.main" : "primary.light",
            }}
          >
            EcoFund
          </Link>
          <Link
            component={RouterLink}
            variant="button"
            color="primary.light"
            to="/fundraisers"
            sx={{
              my: 1,
              mx: 3.5,
              textDecoration: "none",
              "&:hover": { color: !isAuthenticated ? "secondary.main" : "primary.light" },
            }}
          >
            List of active fundraisers
          </Link>
          {isAuthenticated && (
            <Link
              component={RouterLink}
              variant="button"
              color="primary.light"
              to="/create"
              sx={{
                my: 1,
                textDecoration: "none",
                "&:hover": { color: !isAuthenticated ? "secondary.main" : "primary.light" },
              }}
            >
              Create a fundraiser
            </Link>
          )}
          <UserInfo />
        </nav>
      </Toolbar>
    </AppBar>
  );
};
