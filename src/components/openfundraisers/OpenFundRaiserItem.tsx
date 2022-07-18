import { Card, CardContent, CardHeader, CardMedia, Grid } from "@mui/material";
import { memo } from "react";
import { getFundRaiserCategory, getFundRaiserType } from "../../utils/FundRaiserUtils";

import { formatTimestamp } from "../../utils/DateUtils";
import { BigNumber } from "ethers";
import { Link } from "react-router-dom";
import { FundRaiserStatus } from "../../enums/FundRaiserStatus";
import { FundraiserStatusBadge } from "../ui/FundraiserStatusBadge";
import { FundraiserItemDetail } from "./FundraiserItemDetail";

interface FundraiserItemInterface {
  category: number;
  addr: string;
  defaultImage: string;
  description: string;
  endDate: BigNumber;
  fType: number;
  goalAmount: BigNumber;
  id: BigNumber;
  name: string;
  status: FundRaiserStatus;
}

export const OpenFundRaiserItem = memo(({ item }: { item: FundraiserItemInterface }) => {
  const { category, defaultImage, endDate, fType, goalAmount, name, status } = item;
  const randomId = Math.floor(Math.random() * (400 - 1 + 1) + 1);
  const randomPictureUrl = `https://picsum.photos/id/${randomId}/340/340`;

  const renderEndDate = () => {
    const iEndDate = endDate.toNumber();
    if (iEndDate === 0) {
      return null;
    }
    const formattedEndDate = formatTimestamp(iEndDate, "YYYY-MM-DD HH:mm:ss");
    return <FundraiserItemDetail label="Until" value={formattedEndDate} />;
  };

  return (
    <Grid item xs={12} md={4}>
      <Link to={`/fundraiser/${item.addr}`} style={{ textDecoration: "none" }}>
        <Card sx={{ height: 384 }}>
          <CardHeader avatar={<FundraiserStatusBadge status={status} />} title={name} />
          <CardMedia
            component="img"
            height={200}
            width={200}
            image={defaultImage?.length > 0 ? `https://${defaultImage}.ipfs.dweb.link` : randomPictureUrl}
            alt={name}
          />
          <CardContent>
            <FundraiserItemDetail label="Type" value={getFundRaiserType(fType)} />
            <FundraiserItemDetail label="Category" value={getFundRaiserCategory(category)} />
            {goalAmount.toNumber() > 0 && (
              <FundraiserItemDetail label="Goal" value={`$${goalAmount.toNumber() / 100}`} />
            )}
            {renderEndDate()}
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
});
