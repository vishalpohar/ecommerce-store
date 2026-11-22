import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 mt-[78px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
