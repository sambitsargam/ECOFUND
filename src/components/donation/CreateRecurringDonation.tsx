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
import { FundraiserDetailsData } from "../../enums/FundRaiser";
import { RecurringInterval } from "../../enums/RecurringInterval";

const schema = Yup.object({
  token: Yup.string().required(),
  amount: Yup.number().required(),
  intervalNumber: Yup.number()
    .required()
    .min(1)
    .max(24 * 365 * 100),
  // @ts-ignore
  interval: Yup.mixed<RecurringInterval>().oneOf(Object.values(RecurringInterval)).required(),
});

const validate = makeValidate(schema);
const required = makeRequired(schema);
const formFields: GenericFormField[] = [
  {
    size: 6,
    field: (
      <Select
        name="token"
        label="Select a token to donate"
        formControlProps={{ margin: "none" }}
        required={required.token}
      >
        <MenuItem value={ADDRESS_ZERO}>ETH</MenuItem>
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
        label="Amount to donate"
        name="amount"
        margin="none"
        required={required.amount}
        helperText="This amount (e.g. 0.01) will be automatically sent from your EcoFund wallet to this fundraiser with interval set below"
      />
    ),
  },
  {
    size: 6,
    field: <TextField name="intervalNumber" margin="none" type="number" required={required.intervalNumber} />,
  },
  {
    size: 6,
    field: (
      <Select
        name="interval"
        label="Select interval"
        formControlProps={{ margin: "none" }}
        required={required.interval}
      >
        <MenuItem value={RecurringInterval.HOUR}>Hour(s)</MenuItem>
        <MenuItem value={RecurringInterval.DAY}>Day(s)</MenuItem>
        <MenuItem value={RecurringInterval.WEEK}>Week(s)</MenuItem>
        <MenuItem value={RecurringInterval.MONTH}>Month(s)</MenuItem>
        <MenuItem value={RecurringInterval.YEAR}>Year(s)</MenuItem>
      </Select>
    ),
  },
];

interface CreateRecurringDonationProps {
  fundraiser: FundraiserDetailsData;
  onDonation?: () => void;
}

export const CreateRecurringDonation = ({
  fundraiser,
  onDonation,
}: CreateRecurringDonationProps): React.ReactElement => {
  const { addNotification, setLoading, setLoadingMessage, ethBalance, refreshBalance } = useGlobalContext();

  const handleMoralisError = (err: string[] | Error | any) => {
    if (Array.isArray(err)) {
      err = err[0];
    }

    addNotification(NotificationType.ERROR, err?.message || err?.error || "" + err);
  };

  const handleMoralisSuccess = () => {
    addNotification(NotificationType.SUCCESS, "Recurring donation successfully created!");
    refreshBalance();
    if (typeof onDonation === "function") {
      onDonation();
    }
  };

  const onSubmit = async (values: any) => {
    if (ethBalance.lt(Moralis.Units.ETH(values.amount))) {
      addNotification(
        NotificationType.ERROR,
        `Your wallet balance of ${Moralis.Units.FromWei(
          ethBalance.toString(10)
        )} ETH is not enough to cover first installment! Deposit more funds by clicking on your account name in navbar.`
      );
      return;
    }

    let intervalHours = values.intervalNumber;

    switch (values.interval) {
      case RecurringInterval.DAY:
        intervalHours *= 24;
        break;
      case RecurringInterval.WEEK:
        intervalHours *= 24 * 7;
        break;
      case RecurringInterval.MONTH:
        intervalHours *= 24 * 30;
        break;
      case RecurringInterval.YEAR:
        intervalHours *= 24 * 365;
        break;
    }

    if (intervalHours <= 0 || intervalHours > 24 * 365 * 100) {
      addNotification(NotificationType.ERROR, "That seems excessively long to be honest.");
      return;
    }

    setLoading(true);
    try {
      const options = {
        contractAddress: factoryAddress,
        abi: factoryAbi.abi,
        functionName: "createRecurringPayment",
        params: {
          _targetFundraiser: fundraiser.address,
          _amount: Moralis.Units.ETH(values.amount),
          _tokenAddress: ADDRESS_ZERO,
          _intervalHours: intervalHours,
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
        Create a recurring payment to this fundraiser
      </Typography>
      <GenericForm
        onSubmit={onSubmit}
        validate={validate}
        fields={formFields}
        initialValues={{ token: ADDRESS_ZERO, interval: RecurringInterval.HOUR, intervalNumber: 1 }}
      />
    </StyledPaper>
  );
};
