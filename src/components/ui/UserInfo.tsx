import {
  Button,
  CircularProgress,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PaidIcon from "@mui/icons-material/Paid";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { createStyles, makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useChain, useMoralis } from "react-moralis";
import makeBlockie from "ethereum-blockies-base64";
import { NotificationType, useGlobalContext } from "../../context/GlobalContext";
import { ALLOWED_NETWORK } from "./RequireAuth";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import ethereum from "../../images/ethereum.svg";
import Moralis from "moralis";

export const UserInfo = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    authenticate,
    isAuthenticated,
    user,
    logout,
    isAuthenticating,
    isInitialized,
    authError,
    hasAuthError,
    isWeb3Enabled,
  } = useMoralis();

  const { chainId, switchNetwork } = useChain();
  const { addNotification, ethBalance } = useGlobalContext();
  const [isWrongNetwork, setWrongNetwork] = useState(false);

  useEffect(() => {
    if (hasAuthError && authError) {
      addNotification(NotificationType.ERROR, "Sorry, could not authorize...");
    }
  }, [hasAuthError]);

  useEffect(() => {
    if (isAuthenticated && isWeb3Enabled && chainId !== ALLOWED_NETWORK) {
      addNotification(
        NotificationType.WARNING,
        "EcoFund currently works only on Ethereum Rinkeby testnet. Please switch to Rinkeby!"
      );
      setWrongNetwork(true);
    } else {
      setWrongNetwork(false);
    }
  }, [chainId]);

  const useStyles = makeStyles(() =>
    createStyles({
      avatar: {
        height: "32px",
        width: "32px",
        borderRadius: "47px",
      },
      account: {
        border: "1px solid #fff",
        borderRadius: "3px",
        display: "flex",
        height: "30px",
        alignItems: "center",
        padding: "5px",
      },
    })
  );

  const classes = useStyles();

  const btnStyles: any = makeStyles((theme: any) => ({
    root: {
      borderRadius: 35,
      width: "120px",
      fontSize: "13px",
      border: "0px",
      padding: "10px 0px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    darkBg: {
      background: theme.palette.primary.dark,
      color: theme.palette.primary.light,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    lightBg: {
      background: theme.palette.secondary.main,
      color: theme.palette.primary.light,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  }));

  const btnClasses = btnStyles();

  const loginHandler = () => {
    authenticate().then();
  };

  const logoutHandler = () => {
    logout().then();
  };

  const switchNetworkHandler = () => {
    switchNetwork(ALLOWED_NETWORK).then();
  };

  if (!isInitialized) {
    return null;
  }

  if (isAuthenticated && isWrongNetwork) {
    return (
      <Button onClick={switchNetworkHandler} variant="contained" color="success" sx={{ mr: 1.5, ml: 3 }}>
        Switch to Rinkeby
      </Button>
    );
  }

  if (isAuthenticating) {
    return (
      <div style={{ width: "120px", textAlign: "center" }}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && user ? (
        <>
          <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
            <Tooltip title="My Account">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <img
                  className={classes.avatar}
                  src={makeBlockie(user.get("ethAddress"))}
                  alt={user.get("ethAddress")}
                />
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <Link component={RouterLink} to="/account" mr="15px" sx={{ textDecoration: "none", color: "#000" }}>
                Account (deposit / withdraw)
              </Link>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <PaidIcon fontSize="small" />
              </ListItemIcon>
              <Link component={RouterLink} to="/recurring" mr="15px" sx={{ textDecoration: "none", color: "#000" }}>
                My recurring payments
              </Link>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <img src={ethereum} style={{ width: "24px", height: "24px" }} alt="eth icon" />
              </ListItemIcon>
              <Link component={RouterLink} to="/account" mr="15px" sx={{ textDecoration: "none", color: "#000" }}>
                Balance: {Moralis.Units.FromWei(ethBalance.toString())} ETH
              </Link>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <Link component={RouterLink} to="/create" mr="15px" sx={{ textDecoration: "none", color: "#000" }}>
                Create a new Fundraiser
              </Link>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <AutorenewIcon fontSize="small" />
              </ListItemIcon>
              <Link component={RouterLink} to="/fundraisers" mr="15px" sx={{ textDecoration: "none", color: "#000" }}>
                Active fundraisers
              </Link>
            </MenuItem>
            <Divider />
            <MenuItem onClick={logoutHandler}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </>
      ) : (
        <button onClick={loginHandler} className={btnClasses.lightBg + " " + btnClasses.root}>
          LOGIN
        </button>
      )}
    </>
  );
};
