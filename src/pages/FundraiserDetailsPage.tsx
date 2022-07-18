import "date-fns";
import * as React from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { NotificationType, useGlobalContext } from "../context/GlobalContext";
import * as fundraiserAbi from "../artifacts/contracts/EcoFund.sol/EcoFund.json";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FundraiserDetails } from "../components/fundraiser/FundraiserDetails";
import { FundraiserDetailsData } from "../enums/FundRaiser";
import { extractDetails } from "../utils/FundRaiserUtils";

export const FundraiserDetailsPage = () => {
  const { address } = useParams();
  const { addNotification, setLoading } = useGlobalContext();
  const { user, isWeb3Enabled } = useMoralis();
  const [data, setData] = useState<FundraiserDetailsData>();

  const { runContractFunction, isFetching, isLoading } = useWeb3Contract({
    abi: fundraiserAbi.abi,
    functionName: "getAllDetails",
  });

  const handleMoralisError = (err: string[] | Error | any) => {
    if (Array.isArray(err)) {
      err = err[0];
    }

    addNotification(NotificationType.ERROR, err?.message || err?.error || "" + err);
    setLoading(false);
  };

  const handleMoralisSuccess = (successData: any) => {
    setData(extractDetails(successData, address));
    setLoading(false);
  };

  const refreshFundraiserDetails = () => {
    runContractFunction({
      params: {
        contractAddress: address,
      },
      onError: handleMoralisError,
      onSuccess: handleMoralisSuccess,
    }).then();
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      refreshFundraiserDetails();
    }
  }, [isWeb3Enabled, address]);

  useEffect(() => {
    setLoading(isFetching || isLoading);
  }, [isFetching, isLoading]);

  return (
    <>
      <FundraiserDetails
        data={data}
        user={user}
        refreshFundraiserDetails={refreshFundraiserDetails}
        isLoading={isFetching || isLoading}
      />
    </>
  );
};
