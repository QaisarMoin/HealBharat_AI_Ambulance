import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-neutral-gray">
            © 2024 HealBharat Emergency Operations. All rights reserved.
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-sm text-neutral-gray hover:text-dark-navy transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-neutral-gray hover:text-dark-navy transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-neutral-gray hover:text-dark-navy transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
