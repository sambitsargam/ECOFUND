import { FundraiserType } from "./FundRaiserType";
import { FundRaiserCategory } from "./FundRaiserCategory";
import { FundRaiserStatus } from "./FundRaiserStatus";
import BigNumber from "bignumber.js";

export interface FundraiserDetailsData {
  id: BigNumber;
  address: string;
  owner: string;
  type: FundraiserType;
  category: FundRaiserCategory;
  endDate: Date;
  goalAmount: number;
  descriptions: string[];
  images: string[];
  defaultImage: number;
  name: string;
  status: FundRaiserStatus;
  ethBalance: BigNumber;
}
