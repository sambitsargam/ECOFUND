import "date-fns";
import * as React from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { NotificationType, useGlobalContext } from "../context/GlobalContext";
import { useEffect, useState } from "react";
import * as factoryAbi from "../artifacts/contracts/EcoFundFactory.sol/EcoFundFactory.json";
import { extractRecurringPayments, factoryAddress } from "../utils/FundRaiserUtils";
import { RecurringPayment } from "../enums/RecurringPayment";
import { RecurringPaymentList } from "../components/recurring/RecurringPaymentList";

export const MyRecurringPaymentsPage = () => {
  const { addNotification, setLoading } = useGlobalContext();
  const { user, isWeb3Enabled, isAuthenticated, isInitialized } = useMoralis();
  const [data, setData] = useState<RecurringPayment[]>([]);

  const { runContractFunction, isFetching, isLoading } = useWeb3Contract({
    abi: factoryAbi.abi,
    functionName: "getMyRecurringPayments",
    contractAddress: factoryAddress,
  });

  const handleMoralisError = (err: string[] | Error | any) => {
    if (Array.isArray(err)) {
      err = err[0];
    }

    addNotification(NotificationType.ERROR, err?.message || err?.error || "" + err);
    setLoading(false);
  };

  const handleMoralisSuccess = (successData: any) => {
    setData(extractRecurringPayments(successData));
    setLoading(false);
  };

  const refreshData = () => {
    runContractFunction({
      onError: handleMoralisError,
      onSuccess: handleMoralisSuccess,
    }).then();
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      refreshData();
    }
  }, [isWeb3Enabled, user?.get("ethAddress")]);

  useEffect(() => {
    setLoading(isFetching || isLoading);
  }, [isFetching, isLoading]);

  if (!(isWeb3Enabled && isAuthenticated && isInitialized)) {
    return <></>;
  }

  return (
    <>
      <RecurringPaymentList data={data} user={user} onCancel={refreshData} isLoading={isFetching || isLoading} />
    </>
  );
};
