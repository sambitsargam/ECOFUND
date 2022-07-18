import * as React from "react";
import Moralis from "moralis";
import { FundraiserDetailsData } from "../../enums/FundRaiser";
import { StyledPaper } from "../ui/StyledPaper";
import { Alert, Grid, Skeleton, Typography } from "@mui/material";
import { getFundRaiserCategory, getFundRaiserType, sameAddress } from "../../utils/FundRaiserUtils";
import { FundraiserType } from "../../enums/FundRaiserType";
import { OneTimeDonation } from "../donation/OneTimeDonation";
import { ContentMarkdown } from "../ipfs-content/ContentMarkdown";
import { ContentImage } from "../ipfs-content/ContentImage";
import { CreateRecurringDonation } from "../donation/CreateRecurringDonation";
import { FundraiserWithdrawFunds } from "./FundraiserWithdrawFunds";
import { PageHeader } from "../ui/PageHeader";
import { FundraiserStatusBadge } from "../ui/FundraiserStatusBadge";
import makeBlockie from "ethereum-blockies-base64";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AddImage } from "./AddImage";
import { Masonry } from "@mui/lab";

dayjs.extend(relativeTime);

interface FundraiserDetailsProps {
  user: Moralis.User | null;
  data?: FundraiserDetailsData;
  refreshFundraiserDetails?: () => void;
  isLoading: boolean;
}

export const FundraiserDetails = ({ data, user, refreshFundraiserDetails, isLoading }: FundraiserDetailsProps) => {
  if (isLoading) {
    return <Skeleton variant="rectangular" height={200} />;
  }
  if (!data) {
    return <Alert severity="error">Sorry, we couldn't fetch this fundraiser's details :(</Alert>;
  }

  const isOwner = sameAddress(data.owner, user?.get("ethAddress"));

  return (
    <>
      <PageHeader>{data.name}</PageHeader>
      <Grid container spacing={2}>
        {isOwner && (
          <Grid item sm={12}>
            <Alert sx={{ mb: 2 }} severity="info">
              You are an owner of this fundraiser.
            </Alert>
            <AddImage fundraiser={data!} onUploaded={refreshFundraiserDetails} />
          </Grid>
        )}
        <Grid item sm={12} md={9}>
          <Typography component="h1" variant="h6" gutterBottom>
            Description and updates:
          </Typography>
          <StyledPaper>
            {data.descriptions?.length > 0 && (
              <>
                {data.descriptions.map((item: string, _idx: number) => (
                  <React.Fragment key={_idx}>
                    <ContentMarkdown cid={item} />
                    <hr />
                  </React.Fragment>
                ))}
              </>
            )}
          </StyledPaper>
          {data.images?.length > 0 && (
            <>
              <Typography component="h1" variant="h6" sx={{ mt: 3 }} gutterBottom>
                Images:
              </Typography>
              <StyledPaper>
                <Masonry columns={data.images.length > 2 ? 3 : data.images.length} spacing={2}>
                  {data.images.map((item: string, _idx: number) => (
                    <React.Fragment key={_idx}>
                      <ContentImage cid={item} />
                    </React.Fragment>
                  ))}
                </Masonry>
              </StyledPaper>
            </>
          )}
        </Grid>
        <Grid item sm={12} md={3}>
          <Typography component="h1" variant="h6">
            Details:
          </Typography>
          <StyledPaper>
            <Grid container>
              <Grid item xs={4} sx={{ mb: 3 }}>
                Status:
              </Grid>
              <Grid item xs={8}>
                <FundraiserStatusBadge status={data.status} />
              </Grid>

              <Grid item xs={4} sx={{ mb: 3 }}>
                Type:
              </Grid>
              <Grid item xs={8}>
                {getFundRaiserType(data.type)}
              </Grid>

              <Grid item xs={4} sx={{ mb: 3 }}>
                Category:
              </Grid>
              <Grid item xs={8}>
                {getFundRaiserCategory(data.category)}
              </Grid>

              <Grid item xs={4} sx={{ mb: 3 }}>
                Organizer:
              </Grid>
              <Grid item xs={8}>
                <a href={`https://rinkeby.etherscan.io/address/${data.owner}`} target="_blank">
                  <img style={{ width: 28 }} src={makeBlockie(data.owner)} alt={data.owner} />
                </a>
              </Grid>

              <Grid item xs={4} sx={{ mb: 3 }}>
                Donations:
              </Grid>
              <Grid item xs={8}>
                {Moralis.Units.FromWei(data.ethBalance.toString())} ETH
              </Grid>

              {data.goalAmount > 0 && (
                <>
                  <Grid item xs={4} sx={{ mb: 3 }}>
                    Goal:
                  </Grid>
                  <Grid item xs={8}>
                    {`$${data.goalAmount / 100}`}
                  </Grid>
                </>
              )}

              {data.endDate.valueOf() > 0 && (
                <>
                  <Grid item xs={4} sx={{ mb: 3 }}>
                    End date:
                  </Grid>
                  <Grid item xs={8}>
                    {dayjs(data.endDate).fromNow()}
                  </Grid>
                </>
              )}
            </Grid>
          </StyledPaper>
        </Grid>
      </Grid>
      {user && data.type !== FundraiserType.LOAN && (
        <OneTimeDonation fundraiser={data} onDonation={refreshFundraiserDetails} />
      )}
      {user && data.type === FundraiserType.RECURRING_DONATION && (
        <CreateRecurringDonation fundraiser={data} onDonation={refreshFundraiserDetails} />
      )}
      {isOwner && data.ethBalance.gt(0) && (
        <FundraiserWithdrawFunds fundraiser={data!} user={user!} onWithdrawal={refreshFundraiserDetails} />
      )}
    </>
  );
};
