import { FundRaiserStatus } from "../enums/FundRaiserStatus";
import { FundraiserType } from "../enums/FundRaiserType";
import { FundraiserDetailsData } from "../enums/FundRaiser";
import { FundRaiserCategory } from "../enums/FundRaiserCategory";
import { RecurringPayment } from "../enums/RecurringPayment";
import { RecurringPaymentStatus } from "../enums/RecurringPaymentStatus";

const FUNDRAISER_TYPES: any = {};
FUNDRAISER_TYPES[FundraiserType.LOAN] = "Loan";
FUNDRAISER_TYPES[FundraiserType.ONE_TIME_DONATION] = "One time donation";
FUNDRAISER_TYPES[FundraiserType.RECURRING_DONATION] = "Recurring donation";

const FUNDRAISER_STATUS: any = {};
FUNDRAISER_STATUS[FundRaiserStatus.ACTIVE] = "Active";
FUNDRAISER_STATUS[FundRaiserStatus.FULLY_FUNDED] = "Fully funded";
FUNDRAISER_STATUS[FundRaiserStatus.REPAYING] = "Repaying";
FUNDRAISER_STATUS[FundRaiserStatus.REPAID] = "Repaid";
FUNDRAISER_STATUS[FundRaiserStatus.CLOSED] = "Closed";

const FUNDRAISER_CATEGORY: any = {};
FUNDRAISER_CATEGORY[FundRaiserCategory.AGRI] = "Agriculture";
FUNDRAISER_CATEGORY[FundRaiserCategory.POL] = "Pollution Control";
FUNDRAISER_CATEGORY[FundRaiserCategory.PLANT] = "Plantation";
FUNDRAISER_CATEGORY[FundRaiserCategory.COMMUNITY] = "Community";
FUNDRAISER_CATEGORY[FundRaiserCategory.ANIMALS] = "Animals";
FUNDRAISER_CATEGORY[FundRaiserCategory.ENV] = "Environmental Conservation";

export const getFundRaiserType = (type: FundraiserType) => FUNDRAISER_TYPES[type] ?? "Unknown";
export const getFundRaiserStatus = (status: FundRaiserStatus) => FUNDRAISER_STATUS[status] ?? "Unknown";
export const getFundRaiserCategory = (category: FundRaiserCategory) => FUNDRAISER_CATEGORY[category] ?? "Unknown";
export const factoryAddress = process.env.REACT_APP_FACTORY_CONTRACT_ADDRESS!;
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const sameAddress = (a1: string, a2: string) => a1?.toLowerCase() === a2?.toLowerCase();

export const extractDetails = (data: any, address = ""): FundraiserDetailsData | undefined => {
  if (!data || !Array.isArray(data) || data?.length !== 12) {
    return undefined;
  }

  try {
    return {
      id: data[0],
      address,
      owner: data[1],
      type: data[2] as FundraiserType,
      category: data[3] as FundRaiserCategory,
      endDate: new Date(1000 * data[4].toNumber()),
      goalAmount: data[5].toNumber(),
      descriptions: data[6],
      images: data[7],
      defaultImage: data[8].toNumber(),
      name: data[9],
      status: data[10] as FundRaiserStatus,
      ethBalance: data[11],
    };
  } catch (e: any) {
    console.error(e);
    return undefined;
  }
};

export const extractRecurringPayments = (data: any): RecurringPayment[] => {
  console.log("extractRecurringPayments", data);
  if (!data || !Array.isArray(data) || data?.length === 0) {
    return [];
  }

  try {
    return data.map((item: any) => ({
      id: item[0],
      owner: item[1],
      target: item[2],
      tokenAddress: item[3],
      amount: item[4],
      intervalHours: Number(item[5]),
      lastExecution: new Date(1000 * item[6].toNumber()),
      status: item[7] as RecurringPaymentStatus,
    }));
  } catch (e: any) {
    console.error(e);
    return [];
  }
};