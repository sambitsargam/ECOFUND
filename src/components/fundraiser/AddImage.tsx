import Moralis from "moralis";
import { FundraiserDetailsData } from "../../enums/FundRaiser";
import { StyledPaper } from "../ui/StyledPaper";
import { Button, CircularProgress, Typography } from "@mui/material";
import React, { useRef } from "react";
import { useWeb3Storage } from "../../hooks/useWeb3Storage";
import { NotificationType, useGlobalContext } from "../../context/GlobalContext";
import * as fundraiserAbi from "../../artifacts/contracts/EcoFund.sol/EcoFund.json";

interface AddImageProps {
  fundraiser: FundraiserDetailsData;
  onUploaded?: () => void;
}

export const AddImage = ({ fundraiser, onUploaded }: AddImageProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const { storeImage } = useWeb3Storage();
  const { addNotification, isLoading, setLoading, setLoadingMessage } = useGlobalContext();

  const handleMoralisError = (err: string[] | Error | any) => {
    if (Array.isArray(err)) {
      err = err[0];
    }

    addNotification(NotificationType.ERROR, err?.message || err?.error || "" + err);
  };

  const handleMoralisSuccess = () => {
    addNotification(NotificationType.SUCCESS, "Deposit successful!");
  };

  const onSubmit = async () => {
    if (ref?.current?.files?.length !== 1) {
      return;
    }
    setLoading(true);
    setLoadingMessage("Saving image to IPFS...");
    try {
      const cid = await storeImage(ref.current.files[0]);
      setLoadingMessage("Executing transaction...");
      const options = {
        contractAddress: fundraiser.address,
        abi: fundraiserAbi.abi,
        functionName: "addImage",
        params: {
          _picture: cid,
          _makeDefault: true,
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
        if (typeof onUploaded === "function") {
          onUploaded();
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
    <StyledPaper>
      <Typography component="h1" variant="h6">
        Upload an image
      </Typography>
      {isLoading ? (
        <CircularProgress color="primary" />
      ) : (
        <>
          <input type="file" id="upload-image-file" ref={ref} />
          <Button onClick={onSubmit} variant="contained" color="primary" disabled={isLoading}>
            Upload
          </Button>
        </>
      )}
    </StyledPaper>
  );
};
