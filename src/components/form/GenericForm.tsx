import { Button, Grid } from "@mui/material";
import { Form } from "react-final-form";
import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { StyledPaper } from "../ui/StyledPaper";

export interface GenericFormField {
  size: number;
  field: JSX.Element;
  hide?: (values: any) => boolean;
}

export interface CreateFundraiserFormProps {
  isDisabled?: boolean;
  showResetButton?: boolean;
  validate?: (values: any) => any;
  onSubmit?: (values: any) => void;
  initialValues?: any;
  fields: GenericFormField[];
}

export const GenericForm = ({
  fields,
  validate = () => {},
  onSubmit = () => {},
  initialValues = {},
  isDisabled = false,
  showResetButton = false,
}: CreateFundraiserFormProps): React.ReactElement => {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      validate={validate}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit} noValidate>
          <StyledPaper>
            <Grid container alignItems="flex-start" spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                {fields
                  .filter((item) => (typeof item.hide === "function" ? !item.hide(values) : true))
                  .map((item, idx) => (
                    <Grid item xs={item.size} key={idx}>
                      {item.field}
                    </Grid>
                  ))}
              </LocalizationProvider>
              {showResetButton ? (
                <Grid item style={{ marginTop: 16 }}>
                  <Button type="button" variant="contained" onClick={form.reset} disabled={submitting || pristine}>
                    Reset
                  </Button>
                </Grid>
              ) : (
                ""
              )}
              <Grid item style={{ marginTop: 16 }}>
                <Button variant="contained" color="primary" type="submit" disabled={submitting || isDisabled}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </StyledPaper>
        </form>
      )}
    />
  );
};
