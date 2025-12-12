import React, { useEffect, useState } from "react";
import Navbar from "../Components/Shared/Navbar";
import { Outlet, useMatches, useNavigation, useParams } from "react-router";
import Footer from "../Components/Shared/Footer";
import Loader from "../Components/Shared/Loader";

const RootLayout = () => {
  const navigation = useNavigation();
  const matches = useMatches();
  const params = useParams();
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    const match = matches.find(
      (m) => m.handle?.title || m.handle?.dynamicTitle
    );

    if (!match) {
      document.title = "LoanLink";
      return;
    }

    // ----------------------------------------
    //        STATIC TITLES (normal pages)
    // ----------------------------------------
    if (match.handle.title) {
      let title = match.handle.title;

      // Replace dynamic params (:id, :slug, etc.)
      Object.keys(params).forEach((key) => {
        title = title.replace(`:${key}`, params[key]);
      });

      document.title = `${title} | LoanLink`;
      return;
    }

    // ----------------------------------------
    //        DYNAMIC LOAN TITLES
    // ----------------------------------------
    if (match.handle.dynamicTitle) {
      const loan = match.data?.loan;

      // choose routeTitle from handle if provided, otherwise fallback
      const routeTitle = match.handle.routeTitle || "Loan Details";

      // Loan found → use loan title
      if (loan) {
        const loanTitle = loan.title || loan.loanTitle || loan.name || "Loan";

        // Final format: Loan Title | <Route Title> | LoanLink
        document.title = `${loanTitle} | ${routeTitle} | LoanLink`;
      } else {
        // still waiting for loader data
        document.title = `Loading Loan... | ${routeTitle} | LoanLink`;
      }
    }
  }, [matches, params]);

  // Loader logic
  useEffect(() => {
    if (navigation.state === "loading") {
      setLoading(true);
    } else {
      const timer = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>

      <main className="flex-grow relative">
        {Loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <Loader />
          </div>
        )}

        <Outlet />
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default RootLayout;
