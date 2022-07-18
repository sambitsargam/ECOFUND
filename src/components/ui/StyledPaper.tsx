import React from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Paper } from "@mui/material";
import { PaperProps } from "@mui/material/Paper/Paper";

export const StyledPaper = ({ children, ...rest }: PaperProps): React.ReactElement => {
  const useStyles = makeStyles(() =>
    createStyles({
      styledPaper: {
        padding: 16,
      },
    })
  );
  const classes = useStyles();

  return (
    <Paper className={classes.styledPaper} {...rest}>
      {children}
    </Paper>
  );
};
