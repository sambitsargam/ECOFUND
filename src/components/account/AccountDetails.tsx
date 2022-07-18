import React from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Grid, Button } from "@mui/material";
import Moralis from "moralis";
import { MoralisContextValue } from "react-moralis";
import { StyledPaper } from "../ui/StyledPaper";
import BigNumber from "bignumber.js";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

interface AccountDetailsProps {
  user: Moralis.User | null;
  chainId: MoralisContextValue["chainId"];
  network: MoralisContextValue["network"];
  ethBalance: BigNumber;
}

export const AccountDetails = ({ user, chainId, network, ethBalance }: AccountDetailsProps): React.ReactElement => {
  const useStyles = makeStyles(() =>
    createStyles({
      label: {
        textAlign: "right",
      },
      payments: {
        textAlign: "center",
      },
    })
  );
  const classes = useStyles();
  return (
    <StyledPaper>
      <Grid container alignItems="flex-start" spacing={4}>
        <Grid item xs={2} className={classes.label}>
          <strong>User ID:</strong>
        </Grid>
        <Grid item xs={5}>
          <code>{user?.getUsername()}</code>
        </Grid>
        <Grid item xs={2} className={classes.label}>
          <strong>Network:</strong>
        </Grid>
        <Grid item xs={3}>
          <code>{network}</code>
        </Grid>

        <Grid item xs={2} className={classes.label}>
          <strong>Eth account:</strong>
        </Grid>
        <Grid item xs={5}>
          <code>{user?.get("ethAddress")}</code>
        </Grid>

        <Grid item xs={2} className={classes.label}>
          <strong>Chain ID:</strong>
        </Grid>
        <Grid item xs={3}>
          <code>{chainId}</code>
        </Grid>

        <Grid item xs={2} className={classes.label}>
          <strong>Your balance:</strong>
        </Grid>
        <Grid item xs={5}>
          <code>{Moralis.Units.FromWei(ethBalance.toString(10))} ETH</code>
        </Grid>

        <Grid item xs={12} className={classes.payments}>
          <Link sx={{ textDecoration: "none" }} component={RouterLink} to="/recurring">
            <Button color="secondary" variant="contained">
              My recurring payments
            </Button>
          </Link>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};
