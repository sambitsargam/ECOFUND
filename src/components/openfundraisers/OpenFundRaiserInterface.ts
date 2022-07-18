import { FundRaiserStatus } from "../../enums/FundRaiserStatus";
import { FundraiserType } from "../../enums/FundRaiserType";

export interface OpenFundRaiser {
  _id: string;
  _owner: string;
  _type: FundraiserType;
  _category: string;
  _endDate: number;
  _name: string;
  _initialDescription: string;
  _status: FundRaiserStatus;
}
