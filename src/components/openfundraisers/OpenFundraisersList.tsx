import { Grid, Skeleton } from "@mui/material";
import { OpenFundRaiserItem } from "./OpenFundRaiserItem";

export const OpenFundRaisersList = ({
  fundraisers,
  isLoading,
}: {
  fundraisers: any[];
  isLoading: boolean;
}): JSX.Element => {
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" height={300} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" height={300} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" height={300} />
        </Grid>
      </Grid>
    );
  }

  if (!Array.isArray(fundraisers) || fundraisers.length === 0) {
    return <h1>There are no open fundraisers</h1>;
  }

  return (
    <Grid container spacing={3}>
      {fundraisers.map((fundRaiserItem: any) => (
        <OpenFundRaiserItem key={fundRaiserItem.id} item={fundRaiserItem} />
      ))}
    </Grid>
  );
};
