import { Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles(() =>
  createStyles({
    label: {
      display: "inline-block",
      width: "80px",
      textAlign: "right",
    },
    value: {
      paddingLeft: 10,
    },
  })
);
export const FundraiserItemDetail = ({ label, value }: { label: string; value: string }) => {
  const classes = useStyles();
  return (
    <Typography variant="caption" component="p">
      <span className={classes.label}>{label}:</span> <span className={classes.value}>{value}</span>
    </Typography>
  );
};
