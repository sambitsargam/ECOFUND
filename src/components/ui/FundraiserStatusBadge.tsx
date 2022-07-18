import { Chip } from "@mui/material";
import { FundRaiserStatus } from "../../enums/FundRaiserStatus";

export const FundraiserStatusBadge = ({ status }: { status: FundRaiserStatus }) => {
  switch (status) {
    case FundRaiserStatus.ACTIVE:
      return <Chip label="ACTIVE" color="success" />;
    case FundRaiserStatus.FULLY_FUNDED:
      return <Chip label="FULLY FUNDED" color="warning" />;
    case FundRaiserStatus.CLOSED:
      return <Chip label="CLOSED" color="error" />;
    default:
      return <Chip label="UNKNOWN" />;
  }
};
