import dayjs from "dayjs";

const customParseFormat = require("dayjs/plugin/customParseFormat");
const AdvancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(AdvancedFormat);
const advancedDayjs: any = dayjs;
const dayJsCustomParser: any = dayjs;
dayJsCustomParser.extend(customParseFormat);

export const formatDate = (date: string, format: string) => {
  return advancedDayjs(date).format(format);
};

export const formatTimestamp = (date: number, format: string) => {
  return advancedDayjs(advancedDayjs.unix(date).toString()).format(format);
};
