import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />
      <div className="flex flex-1 pt-16">
        <div className="fixed left-0 top-16 bottom-0 w-64 bg-black border-r border-white/10 hidden lg:block z-30">
          <Sidebar />
        </div>
        <main className="flex-1 lg:ml-64 overflow-y-auto p-4 md:p-6 bg-black">
          {children}
        </main>
      </div>
      <div className="lg:ml-64">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
