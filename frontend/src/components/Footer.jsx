import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            © 2026 HealBharat Emergency Operations. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-[#10B981] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#10B981] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-[#10B981] transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
