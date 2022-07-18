import * as React from "react";
import { Typography, Container, Grid } from "@mui/material";
import diagram from "../images/diagram.png";
import chainlink from "../images/chainlink.png";
import logo from "../images/logo.png";
import web3storage from "../images/web3storage.png";
import { useMoralis } from "react-moralis";
import { StyledPaper } from "../components/ui/StyledPaper";

export const HomePage = () => {
  const { isAuthenticated } = useMoralis();
  const color = isAuthenticated ? "primary.dark" : "primary.light";
  return (
    <Container disableGutters maxWidth="lg" component="main" sx={{ py: 5 }}>
      <Typography component="h1" variant="h2" color={color} gutterBottom >
        Welcome to EcoFund!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Typography component="p" color={color} sx={{ mb: 2 }}>
            EcoFund (as in: <strong>De</strong>centralized <strong>Fund</strong>raisers) is a decentralized platform for
           fundraising of all Environmental problem & solutions. As any dApp, it runs on blockchain and ensures full automation, security, transparency and fairness. EcoFund currently supports two types of fundraisers:
            <ol>
              <li>
                <strong>one-time fundraiser</strong> where the organizer describes the goal of the fundraiser and
                optional the goal amount (in USD) and end date. Donors may choose to fund a one-time fundraiser as long
                as it's in open status and they have funds in their wallet.
              </li>
              <li>
                <strong>recurring fundraiser</strong> where donors may pledge to donate a set amount at a given interval
                - this can be used for all kinds of cyclical donations.
              </li>
            </ol>
          </Typography>
          <Typography component="p" color={color} sx={{ mb: 2 }}>
           The smart contracts behind this web3 dApp are
            currently deployed on Ethereum Rinkeby testnet. Please <strong>DO NOT</strong> use on mainnet, this is a proof
            of concept and has not been audited!
          </Typography>
          <Typography component="p" color={color} sx={{ mb: 2 }}>
            EcoFund relies on the following technologies:
            <ul>
              <li>
                <strong>Chainlink price feeds</strong> are used to securely convert donations made in crypto to fiat
                goals, e.g. ETH &rarr; USD.
              </li>
              <li>
                <strong>Chainlink Keepers</strong> are used to automate recurring payments made from donors to
                fundraisers.
              </li>
              <li>
                <strong>Moralis</strong> is used for smooth web3 experience.
              </li>
              <li>
                <strong>Web3.Storage powered by Filecoin</strong> is used to store fundraiser descriptions and images in
                a decentralized manner without the cost of on-chain storage.
              </li>
            </ul>
            If you're interested in technical aspects of the project, visit our GitHub: <a href="https://github.com/sambitsargam/EcoFund">https://github.com/sambitsargam/EcoFund</a>.
          </Typography>
        </Grid>
        <Grid item xs={12} lg={6}>
          <StyledPaper>
            <img src={diagram} alt="EcoFund" style={{ width: "100%" }} />
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center", mt: 5 }}>
          <img src={chainlink} alt="Chainlink" style={{ height: 80, marginRight: 30 }} />
          <img src={logo} alt="logo" style={{ height: 150, marginRight: 30 }} />
          <img src={web3storage} alt="Web3.Storage" style={{ height: 80 }} />
        </Grid>
      </Grid>
    </Container>
  );
};
