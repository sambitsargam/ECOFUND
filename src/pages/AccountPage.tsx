import "date-fns";
import * as React from "react";
import { useMoralis } from "react-moralis";
import { AccountDetails } from "../components/account/AccountDetails";
import { DepositFunds } from "../components/account/DepositFunds";
import { WithdrawFunds } from "../components/account/WithdrawFunds";
import { useGlobalContext } from "../context/GlobalContext";
import { PageHeader } from "../components/ui/PageHeader";

export const AccountPage = () => {
  const { ethBalance, refreshBalance } = useGlobalContext();
  const { user, chainId, network, isWeb3Enabled, isAuthenticated, isInitialized } = useMoralis();

  if (!(isWeb3Enabled && isAuthenticated && isInitialized)) {
    return <></>;
  }

  return (
    <>
      <PageHeader>Your account</PageHeader>
      <AccountDetails user={user} chainId={chainId} network={network} ethBalance={ethBalance} />
      <DepositFunds onDeposit={refreshBalance} />
      {!ethBalance.isZero() && (
        <WithdrawFunds ethBalance={ethBalance} address={user?.get("ethAddress")} onWithdrawal={refreshBalance} />
      )}
    </>
  );
};
