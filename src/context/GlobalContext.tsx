import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import BigNumber from "bignumber.js";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ADDRESS_ZERO, factoryAddress } from "../utils/FundRaiserUtils";
import * as factoryAbi from "../artifacts/contracts/EcoFundFactory.sol/EcoFundFactory.json";

export enum NotificationType {
  ERROR,
  WARNING,
  INFO,
  SUCCESS,
}

export interface SystemNotification {
  id: string;
  message: string;
  header?: string;
  type: NotificationType;
  keepOpen: boolean;
}

interface IGlobalContext {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (msg: string) => void;
  addNotification: (type: NotificationType, message: string, header?: string) => void;
  closeNotification: (id: string) => void;
  notifications: SystemNotification[];
  ethBalance: BigNumber;
  ethBalanceReady: boolean;
  refreshBalance: () => void;
}

export const defaultGlobalContext: IGlobalContext = {
  isLoading: false,
  setLoading: () => {},
  loadingMessage: "",
  setLoadingMessage: () => {},
  addNotification: () => {},
  closeNotification: () => {},
  notifications: [],
  ethBalance: new BigNumber(0),
  ethBalanceReady: false,
  refreshBalance: () => {},
};

export const GlobalContext = createContext<IGlobalContext>(defaultGlobalContext);

// @ts-ignore
export const GlobalContextProvider: React.FC = ({ children }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [ethBalanceReady, setEthBalanceReady] = useState(false);
  const [ethBalance, setEthBalance] = useState<BigNumber>(new BigNumber(0));
  const { user, isWeb3Enabled, isWeb3EnableLoading, isInitialized, isInitializing, isAuthenticated, isAuthenticating } =
    useMoralis();

  const addNotification = (type: NotificationType, message: string, header?: string, keepOpen = false) => {
    const newNotification: SystemNotification = {
      id: uuidv4(),
      type,
      message,
      header,
      keepOpen,
    };
    setNotifications([...notifications, newNotification]);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const closeNotification = (id: string) => {
    const notificationToDelete = notifications.find((n: SystemNotification) => n.id === id);
    if (!notificationToDelete) {
      return;
    }
    const notificationIdx = notifications.indexOf(notificationToDelete);
    if (notificationIdx > -1) {
      const notificationsCopy = [...notifications];
      notificationsCopy.splice(notificationIdx, 1);
      setNotifications(notificationsCopy);
    }
  };

  const {
    runContractFunction,
    isFetching,
    isLoading: isBalanceLoading,
  } = useWeb3Contract({
    abi: factoryAbi.abi,
    contractAddress: factoryAddress,
    functionName: "getMyBalance",
  });

  const handleMoralisError = (err: string[] | Error | any) => {
    if (Array.isArray(err)) {
      err = err[0];
    }

    addNotification(NotificationType.ERROR, err?.message || err?.error || "" + err);
    setEthBalanceReady(true);
  };

  const handleMoralisSuccess = (data: any) => {
    setEthBalance(data);
    setEthBalanceReady(true);
  };

  useEffect(() => {
    setEthBalanceReady(!isFetching && !isLoading);
  }, [isFetching, isBalanceLoading]);

  const refreshBalance = () => {
    if (!user?.id) {
      return;
    }
    runContractFunction({
      params: {
        params: {
          _token: ADDRESS_ZERO,
        },
      },
      onError: handleMoralisError,
      onSuccess: handleMoralisSuccess,
    }).then();
  };

  useEffect(() => {
    if (
      isWeb3Enabled &&
      !isAuthenticating &&
      !isWeb3EnableLoading &&
      isInitialized &&
      !isInitializing &&
      isAuthenticated
    ) {
      refreshBalance();
    }
  }, [isAuthenticating, isWeb3Enabled, isWeb3EnableLoading, isInitialized, isInitializing, isAuthenticated, user?.id]);

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setLoading,
        loadingMessage,
        setLoadingMessage,
        addNotification,
        closeNotification,
        notifications,
        ethBalance,
        ethBalanceReady,
        refreshBalance,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
