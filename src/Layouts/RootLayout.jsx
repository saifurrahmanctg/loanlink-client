import { useEffect, useState } from "react";
import Navbar from "../Components/Shared/Navbar";
import {
  Outlet,
  useMatches,
  useNavigation,
  useParams,
  useLocation,
} from "react-router";
import Footer from "../Components/Shared/Footer";
import Loader from "../Components/Shared/Loader";

const RootLayout = () => {
  const navigation = useNavigation();
  const matches = useMatches();
  const params = useParams();
  const location = useLocation(); // ✅ Needed for route change
  const [loading, setLoading] = useState(true); // show loader initially

  /* -------------------- Dynamic Document Title -------------------- */
  useEffect(() => {
    const match = matches.find(
      (m) => m.handle?.title || m.handle?.dynamicTitle
    );

    if (!match) {
      document.title = "LoanLink";
      return;
    }

    if (match.handle.title) {
      let title = match.handle.title;
      Object.keys(params).forEach((key) => {
        title = title.replace(`:${key}`, params[key]);
      });
      document.title = `${title} | LoanLink`;
      return;
    }

    if (match.handle.dynamicTitle) {
      const loan = match.data?.loan;
      const routeTitle = match.handle.routeTitle || "Loan Details";
      if (loan) {
        const loanTitle = loan.title || loan.loanTitle || loan.name || "Loan";
        document.title = `${loanTitle} | ${routeTitle} | LoanLink`;
      } else {
        document.title = `Loading Loan... | ${routeTitle} | LoanLink`;
      }
    }
  }, [matches, params]);

  /* -------------------- Route Change Loader -------------------- */
  useEffect(() => {
    setLoading(true); // start loader on route change
    const timer = setTimeout(() => setLoading(false), 800); // 1s minimum loader
    return () => clearTimeout(timer);
  }, [location.pathname]); // trigger on route change

  return (
    <div className="flex flex-col min-h-screen">
      {loading ? (
        <Loader />
      ) : (
        <div>
          {/* Navbar */}
          <header className="sticky top-0 z-50">
            <Navbar />
          </header>

          {/* Main */}
          <main className="flex-grow">
            <Outlet />
          </main>

          {/* Footer */}
          <footer>
            <Footer />
          </footer>
        </div>
      )}
    </div>
  );
};

export default RootLayout;
