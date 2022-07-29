import "date-fns";
import * as React from "react";
import * as factoryAbi from "../artifacts/contracts/EcoFundFactory.sol/EcoFundFactory.json";
import { MenuItem } from "@mui/material";
import { useWeb3Contract } from "react-moralis";
import { NotificationType, useGlobalContext } from "../context/GlobalContext";
import * as Yup from "yup";
import { DateTimePicker, makeRequired, makeValidate, Radios, Select, TextField } from "mui-rff";
import { FundraiserType } from "../enums/FundRaiserType";
import { FundRaiserCategory } from "../enums/FundRaiserCategory";
import { GenericForm, GenericFormField } from "../components/form/GenericForm";
import dayjs from "dayjs";
import { useWeb3Storage } from "../hooks/useWeb3Storage";
import { v4 as uuidv4 } from "uuid";
import { factoryAddress } from "../utils/FundRaiserUtils";
import { PageHeader } from "../components/ui/PageHeader";

const schema = Yup.object({
  fundraiserType: Yup.string().required(),
  fundraiserCategory: Yup.string().required(),
  fundraiserName: Yup.string().required(),
  fundraiserDescription: Yup.string().required(),
  fundraiserEndDate: Yup.date().nullable().default(null),
  fundraiserGoalAmount: Yup.number().default(0),
});

const validate = makeValidate(schema);
const required = makeRequired(schema);
const formFields: GenericFormField[] = [
  {
    size: 12,
    field: (
      <Radios
        label="Type of fundraiser"
        name="fundraiserType"
        formControlProps={{ margin: "none" }}
        required={required.fundraiserType}
        data={[
          { label: "Standard, one-time fundraiser (Under Maintainance)", disabled: true, value: String(FundraiserType.ONE_TIME_DONATION) },
          {
            label: "Continuous fundraiser accepting recurring payments!",
            value: String(FundraiserType.RECURRING_DONATION),
          },
          { label: "Loan that you'll pay back", value: String(FundraiserType.LOAN), disabled: true },
        ]}
      />
    ),
  },
  {
    size: 12,
    field: (
      <Select
        name="fundraiserCategory"
        label="Select a category"
        formControlProps={{ margin: "none" }}
        required={required.fundraiserCategory}
      >
        <MenuItem value={String(FundRaiserCategory.AGRI)}>Agriculture</MenuItem>
        <MenuItem value={String(FundRaiserCategory.POL)}>Pollution Control</MenuItem>
        <MenuItem value={String(FundRaiserCategory.PLANT)}>Plantation</MenuItem>
        <MenuItem value={String(FundRaiserCategory.COMMUNITY)}>Community support</MenuItem>
        <MenuItem value={String(FundRaiserCategory.ANIMALS)}>Helping animals</MenuItem>
        <MenuItem value={String(FundRaiserCategory.ENV)}>Environmental Conservation</MenuItem>
      </Select>
    ),
  },
  {
    size: 12,
    field: (
      <TextField
        label="Title of your fundraiser"
        name="fundraiserName"
        margin="none"
        required={required.fundraiserName}
        helperText="Title of your fundraiser can make or break your campaign!"
      />
    ),
  },
  {
    size: 12,
    field: (
      <TextField
        multiline
        label="Description"
        helperText="You can use Markdown to format the text of the description"
        name="fundraiserDescription"
        margin="none"
        required={required.fundraiserDescription}
      />
    ),
  },
  {
    size: 6,
    field: (
      <DateTimePicker
        label="Optionally pick fundraiser end date"
        name="fundraiserEndDate"
        required={required.fundraiserEndDate}
      />
    ),
    hide: (values: any) => values.fundraiserType === String(FundraiserType.RECURRING_DONATION),
  },
  {
    size: 6,
    field: (
      <TextField
        label="Goal amount in US Dollars"
        helperText="If you provide this value, the fundraiser will close once total value of donations exceeds this value"
        name="fundraiserGoalAmount"
        margin="none"
        required={required.fundraiserGoalAmount}
      />
    ),
    hide: (values: any) => values.fundraiserType === String(FundraiserType.RECURRING_DONATION),
  },
];

export const CreateFundraiserPage = () => {
  const { addNotification, setLoading, setLoadingMessage } = useGlobalContext();
  const { runContractFunction, isFetching, isLoading } = useWeb3Contract({
    contractAddress: factoryAddress,
    functionName: "createFundraiser",
    abi: factoryAbi.abi,
  });
  const { storeAsJson } = useWeb3Storage();

  const handleMoralisError = (err: string[] | Error | any) => {
    if (Array.isArray(err)) {
      err = err[0];
    }

    addNotification(NotificationType.ERROR, err?.message || err?.error || "" + err);
    setLoading(false);
    setLoadingMessage("");
  };

  const handleMoralisSuccess = async (tx: any) => {
    setLoadingMessage("Waiting for transaction confirmation...");
    await tx?.wait(1);
    addNotification(NotificationType.SUCCESS, "The fundraiser has been created!");
    setLoading(false);
    setLoadingMessage("");
  };

  const onSubmit = async (values: any) => {
    setLoading(true);

    try {
      setLoadingMessage("Saving data to IPFS...");
      const fileName = `${uuidv4()}.json`;
      const descriptionCid = await storeAsJson(values.fundraiserDescription, fileName);

      setLoadingMessage("Executing transaction...");
      await runContractFunction({
        params: {
          params: {
            _type: Number(values.fundraiserType),
            _category: Number(values.fundraiserCategory),
            _name: values.fundraiserName,
            _description: descriptionCid,
            _endDate: values.fundraiserEndDate ? dayjs(values.fundraiserEndDate).unix() : 0,
            _goalAmount: Math.round((values.fundraiserGoalAmount || 0) * 100),
          },
        },
        onError: handleMoralisError,
        onSuccess: handleMoralisSuccess,
      });
    } catch (e: any) {
      console.error(e);
      addNotification(
        NotificationType.ERROR,
        "An error has occurred while calling the contract. Please check browser console for details."
      );
    }
  };

  return (
    <>
      <PageHeader>Create a fundraiser</PageHeader>
      <GenericForm onSubmit={onSubmit} validate={validate} isDisabled={isFetching || isLoading} fields={formFields} />
    </>
  );
};
