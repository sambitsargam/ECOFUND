import React from "react";
import { MenuItem, Typography } from "@mui/material";
import Moralis from "moralis";
import { GenericForm, GenericFormField } from "../form/GenericForm";
import * as Yup from "yup";
import { makeRequired, makeValidate, Select, TextField } from "mui-rff";
import { NotificationType, useGlobalContext } from "../../context/GlobalContext";
import { ADDRESS_ZERO, factoryAddress } from "../../utils/FundRaiserUtils";
import * as factoryAbi from "../../artifacts/contracts/EcoFundFactory.sol/EcoFundFactory.json";
import { StyledPaper } from "../ui/StyledPaper";

const schema = Yup.object({
  token: Yup.string().required(),
  amount: Yup.number().required(),
});

const validate = makeValidate(schema);
const required = makeRequired(schema);
const formFields: GenericFormField[] = [
  {
    size: 6,
    field: (
      <Select
        name="token"
        label="Select a token to deposit"
        formControlProps={{ margin: "none" }}
        required={required.token}
      >
        <MenuItem value={ADDRESS_ZERO}>TCRO</MenuItem>
        <MenuItem value="" disabled={true}>
          LINK
        </MenuItem>
      </Select>
    ),
  },
  {
    size: 6,
    field: (
      <TextField
        label="Amount to deposit"
        name="amount"
        margin="none"
        required={required.amount}
        helperText="For example to deposit 0.34 TCRO, type 0.34 in this field"
      />
    ),
  },
];

interface DepositFundsProps {
  onDeposit?: () => void;
}

export const DepositFunds = ({ onDeposit }: DepositFundsProps): React.ReactElement => {
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

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const options = {
        contractAddress: factoryAddress,
        abi: factoryAbi.abi,
        functionName: "depositFunds",
        msgValue: Moralis.Units.ETH(values.amount),
        params: {
          _amount: Moralis.Units.ETH(values.amount),
          _tokenAddress: ADDRESS_ZERO,
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
        if (typeof onDeposit === "function") {
          onDeposit();
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
        Deposit funds (TCRO)
      </Typography>
      <GenericForm
        onSubmit={onSubmit}
        validate={validate}
        fields={formFields}
        initialValues={{ token: ADDRESS_ZERO }}
      />
    </StyledPaper>
  );
};
