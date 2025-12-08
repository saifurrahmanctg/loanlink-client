import React, { useEffect, useState } from "react";
import Navbar from "../Components/Shared/Navbar";
import { Outlet, useNavigation } from "react-router";
import Footer from "../Components/Shared/Footer";
import Loader from "../Components/Shared/Loader";

const RootLayout = () => {
  const navigation = useNavigation();
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigation.state === "loading") {
      // Show loader immediately
      setLoading(true);
    } else {
      // Hide loader with slight delay for smoothness
      const timer = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 ">
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
