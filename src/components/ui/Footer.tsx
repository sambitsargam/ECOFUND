import { Box, Container } from "@mui/material";
import Typography from "@mui/material/Typography";

export const Footer = () => {
  return (
    <footer style={{ marginTop: 100 }}>
      <Box
        sx={{
          width: "100%",
          height: "66px",
          bgcolor: "primary.dark",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Container>
          <Typography component="div" variant="subtitle1" color="primary.light" gutterBottom>
            EcoFund is a decentralized, and autonomous platform made with &#128155;
          </Typography>
        </Container>
      </Box>
    </footer>
  );
};
