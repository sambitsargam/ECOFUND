import { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import * as React from "react";

export const PageHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Typography component="h1" variant="h4" color="text.primary" gutterBottom>
      {children}
    </Typography>
  );
};
