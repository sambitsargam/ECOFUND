import { RecurringPaymentStatus } from "../../enums/RecurringPaymentStatus";
import { Button } from "@mui/material";
import * as React from "react";
import { RecurringPayment } from "../../enums/RecurringPayment";
import { NotificationType, useGlobalContext } from "../../context/GlobalContext";
import * as factoryAbi from "../../artifacts/contracts/EcoFundFactory.sol/EcoFundFactory.json";
import { factoryAddress } from "../../utils/FundRaiserUtils";
import Moralis from "moralis";

interface CancelRecurringPaymentButtonProps {
  payment: RecurringPayment;
  onCancel?: () => void;
}

export const CancelRecurringPaymentButton = ({ payment, onCancel }: CancelRecurringPaymentButtonProps) => {
  const { addNotification, setLoading, setLoadingMessage } = useGlobalContext();

  const handleMoralisError = (err: string[] | Error | any) => {
    if (Array.isArray(err)) {
      err = err[0];
    }

    addNotification(NotificationType.ERROR, err?.message || err?.error || "" + err);
  };

  const handleMoralisSuccess = () => {
    addNotification(NotificationType.SUCCESS, "Deposit successful!");
  };

  const onClick = async () => {
    setLoading(true);
    try {
      const options = {
        contractAddress: factoryAddress,
        abi: factoryAbi.abi,
        functionName: "cancelRecurringPayment",
        params: {
          _id: payment.id,
        },
      };
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
        if (typeof onCancel === "function") {
          onCancel();
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

  if (payment.status !== RecurringPaymentStatus.ACTIVE) {
    return null;
  }

  return (
    <Button variant="outlined" color="error" onClick={onClick} sx={{ ml: 5 }}>
      Cancel
    </Button>
  );
};
