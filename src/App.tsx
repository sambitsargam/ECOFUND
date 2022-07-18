import * as React from "react";
import { GlobalContextProvider } from "./context/GlobalContext";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/ui/Layout";
import { HomePage } from "./pages/HomePage";
import { Error404 } from "./pages/Error404";
import { CreateFundraiserPage } from "./pages/CreateFundraiserPage";
import { OpenFundRaisersPage } from "./pages/OpenFundraisersPage";
import { AccountPage } from "./pages/AccountPage";
import { FundraiserDetailsPage } from "./pages/FundraiserDetailsPage";
import { MyRecurringPaymentsPage } from "./pages/MyRecurringPaymentsPage";

export default function App() {
  return (
    // @ts-ignore
    <GlobalContextProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/create" element={<CreateFundraiserPage />} />
          <Route path="/fundraisers" element={<OpenFundRaisersPage />} />
          <Route path="/fundraiser/:address" element={<FundraiserDetailsPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/recurring" element={<MyRecurringPaymentsPage />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </GlobalContextProvider>
  );
}
