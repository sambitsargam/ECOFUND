import { RecurringPaymentStatus } from "../../enums/RecurringPaymentStatus";
import { Chip } from "@mui/material";

export const RecurringPaymentStatusBadge = ({ status }: { status: RecurringPaymentStatus }) => {
  switch (status) {
    case RecurringPaymentStatus.ACTIVE:
      return <Chip label="ACTIVE" color="success" />;
    case RecurringPaymentStatus.CANCELLED:
      return <Chip label="CANCELLED" color="error" />;
    default:
      return <Chip label="UNKNOWN" />;
  }
};
