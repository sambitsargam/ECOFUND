import { useChain, useMoralis } from "react-moralis";
import { CircularProgress, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Typography, Box } from "@mui/material";

export const ALLOWED_NETWORK = process.env.REACT_APP_ALLOWED_NETWORK || "0x4";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const router = useLocation();
  const requireAuth = router.pathname !== "/";
  const { isAuthenticated, isInitialized, isWeb3Enabled, enableWeb3 } = useMoralis();
  const { chainId } = useChain();
  const [isAuthorized, setAuthorized] = useState(false);
  const [isInitializing, setInitializing] = useState(true);

  useEffect(() => {
    if (isAuthenticated && isInitialized && isWeb3Enabled && chainId === ALLOWED_NETWORK) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
    setInitializing(false);
  }, [isAuthenticated, isInitialized, isWeb3Enabled, chainId]);

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3().then();
    }
  }, [isWeb3Enabled]);

  if (isInitializing) {
    return <CircularProgress color="inherit" />;
  }

  if (!isAuthorized) {
    return (
      <>
        {requireAuth && (
          <Container disableGutters maxWidth="md" component="main" sx={{ py: 10, textAlign: "center" }}>
            <Typography component="h1" variant="h2" color="primary.light" gutterBottom>
              <Box sx={{ fontWeight: 900 }}>Log in to see this page</Box>
            </Typography>
            <Typography component="p" color="primary.light">
              <Box sx={{ fontWeight: 500 }}>
                To see this page you have to be logged in and connected to the correct network (Rinkeby).
              </Box>
            </Typography>
          </Container>
        )}
      </>
    );
  } else {
    return children;
  }
}
