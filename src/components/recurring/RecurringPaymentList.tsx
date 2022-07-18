import * as React from "react";
import Moralis from "moralis";
import { StyledPaper } from "../ui/StyledPaper";
import { Alert, Grid, Skeleton } from "@mui/material";
import { RecurringPayment } from "../../enums/RecurringPayment";
import { createStyles, makeStyles } from "@mui/styles";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { RecurringPaymentStatusBadge } from "../ui/RecurringPaymentStatusBadge";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { CancelRecurringPaymentButton } from "./CancelRecurringPaymentButton";
import { NiceTimeInterval } from "../ui/NiceTimeInterval";
import { PageHeader } from "../ui/PageHeader";

dayjs.extend(relativeTime);

interface RecurringPaymentListProps {
  user: Moralis.User | null;
  data: RecurringPayment[];
  onCancel?: () => void;
  isLoading: boolean;
}

export const RecurringPaymentList = ({ data, onCancel, isLoading }: RecurringPaymentListProps) => {
  const useStyles = makeStyles(() =>
    createStyles({
      label: {
        textAlign: "right",
      },
    })
  );
  const classes = useStyles();

  if (isLoading) {
    return <Skeleton variant="rectangular" height={200} />;
  }

  return (
    <>
      <PageHeader>List of your recurring payments</PageHeader>
      {data.length === 0 && <Alert severity="warning">Seems like you don't have any recurring payments yet</Alert>}
      {data.length > 0 && (
        <>
          {data.map((item: RecurringPayment, _idx: number) => (
            <StyledPaper key={_idx} sx={{ mb: 3 }}>
              <Grid container alignItems="flex-start" spacing={4}>
                <Grid item xs={3} className={classes.label}>
                  <strong>Status:</strong>
                </Grid>
                <Grid item xs={9}>
                  <RecurringPaymentStatusBadge status={item.status} />
                  <CancelRecurringPaymentButton payment={item} onCancel={onCancel} />
                </Grid>
                <Grid item xs={3} className={classes.label}>
                  <strong>Fundraiser:</strong>
                </Grid>
                <Grid item xs={9}>
                  <Link color="secondary" component={RouterLink} to={`/fundraiser/${item.target}`}>
                    <code>{item.target}</code>
                  </Link>
                </Grid>
                <Grid item xs={3} className={classes.label}>
                  <strong>Amount:</strong>
                </Grid>
                <Grid item xs={9}>
                  {Moralis.Units.FromWei(item.amount.toString())} ETH
                </Grid>
                <Grid item xs={3} className={classes.label}>
                  <strong>Frequency:</strong>
                </Grid>
                <Grid item xs={9}>
                  <NiceTimeInterval hours={item.intervalHours} />
                </Grid>
                <Grid item xs={3} className={classes.label}>
                  <strong>Last execution:</strong>
                </Grid>
                <Grid item xs={9}>
                  {dayjs(item.lastExecution).fromNow()} ({dayjs(item.lastExecution).format()})
                </Grid>
              </Grid>
            </StyledPaper>
          ))}
        </>
      )}
    </>
  );
};
