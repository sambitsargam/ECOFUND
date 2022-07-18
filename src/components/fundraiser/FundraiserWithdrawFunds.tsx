import React from "react";
import { Alert, AlertTitle, Button, Typography } from "@mui/material";
import Moralis from "moralis";
import { NotificationType, useGlobalContext } from "../../context/GlobalContext";
import { ADDRESS_ZERO } from "../../utils/FundRaiserUtils";
import * as fundraiserAbi from "../../artifacts/contracts/EcoFund.sol/EcoFund.json";
import { StyledPaper } from "../ui/StyledPaper";
import { FundraiserDetailsData } from "../../enums/FundRaiser";

interface FundraiserWithdrawFundsProps {
  fundraiser: FundraiserDetailsData;
  user: Moralis.User;
  onWithdrawal?: () => void;
}

export const FundraiserWithdrawFunds = ({
  fundraiser,
  user,
  onWithdrawal,
}: FundraiserWithdrawFundsProps): JSX.Element | null => {
  const { addNotification, setLoading, setLoadingMessage } = useGlobalContext();

  const handleMoralisError = (err: string[] | Error | any) => {
    if (Array.isArray(err)) {
      err = err[0];
    }

    addNotification(NotificationType.ERROR, err?.message || err?.error || "" + err);
  };

  const handleMoralisSuccess = () => {
    addNotification(NotificationType.SUCCESS, "Withdrawal has been successful!");
  };

  const onClick = async () => {
    setLoading(true);
    try {
      const options = {
        contractAddress: fundraiser.address,
        abi: fundraiserAbi.abi,
        functionName: "withdrawFunds",
        params: {
          _amount: fundraiser.ethBalance,
          _tokenAddress: ADDRESS_ZERO,
        },
      };
      console.log(options);
      try {
        const tx = await (Moralis as any).executeFunction(options);
        setLoadingMessage("Waiting for transaction confirmation...");
        await tx.wait(1);
        handleMoralisSuccess();
      } catch (e: any) {
        handleMoralisError(e);
      } finally {
        setLoading(false);
        setLoadingMessage("");
        if (typeof onWithdrawal === "function") {
          onWithdrawal();
        }
      }
    } catch (e: any) {
      console.error(e);
      addNotification(
        NotificationType.ERROR,
        "An error has occurred while calling the contract. Please check browser console for details."
      );
    }
  };

  return (
    <StyledPaper sx={{ mt: 3 }}>
      <Typography component="h1" variant="h5">
        Withdraw funds
      </Typography>
      <Typography component="p">
        As this fundraiser's owner you can withdraw its current balance of{" "}
        {Moralis.Units.FromWei(fundraiser.ethBalance.toString(10))} ETH. Click the button below to withdraw those funds.
      </Typography>
      <Alert severity="warning" sx={{ my: 2 }}>
        <AlertTitle>Warning!</AlertTitle>
        Your funds will be sent to the wallet that you're currently signed in with:{" "}
        <code>{user?.get("ethAddress")}</code>!
      </Alert>
      <Button size="large" color="primary" variant="contained" onClick={onClick}>
        Withdraw funds
      </Button>
    </StyledPaper>
  );
};
