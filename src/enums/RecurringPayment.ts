import BigNumber from "bignumber.js";
import { RecurringPaymentStatus } from "./RecurringPaymentStatus";

export interface RecurringPayment {
  id: BigNumber;
  owner: string;
  target: string;
  tokenAddress: string;
  amount: BigNumber;
  intervalHours: number;
  lastExecution: Date;
  status: RecurringPaymentStatus;
}
