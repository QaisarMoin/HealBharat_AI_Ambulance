import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 pt-24">
        <div className="fixed left-0 top-24 bottom-0 w-64 bg-white shadow-lg">
          <Sidebar />
        </div>
        <main className="flex-1 ml-64 overflow-y-auto p-4">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
