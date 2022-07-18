import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from "react-moralis";

export const useAPIContract = (options: any) => {
  const { native } = useMoralisWeb3Api();

  const {
    fetch: runContractFunction,
    data: contractResponse,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(native.runContractFunction, { ...options });

  return { runContractFunction, contractResponse, error, isLoading };
};
