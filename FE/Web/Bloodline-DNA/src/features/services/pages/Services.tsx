import React from "react";
import { Footer, Header } from "../../../components";
import { ContactSection } from "../sections/ContactSection/ContactSection";
import { ServicesHeaderSection } from "../sections/ServicesHeaderSection/ServicesHeaderSection";
import { ServicesSection } from "../sections/ServicesSection/ServicesSection";

export const Services = (): React.JSX.Element => {
  return (
    <div className="bg-gradient-to-b from-[#fcfefe] to-gray-50 min-h-screen w-full">
      <div className="relative w-full max-w-none">
        {/* Header with proper spacing */}
        <div className="fixed z-50 w-full">
          <Header />
        </div>

        {/* Main content with improved spacing */}
        <main className="relative">
          {/* Hero section */}
          <div className="relative">
            <ServicesHeaderSection />
          </div>

          {/* Services section with spacing */}
          <div className="relative -mt-8 md:-mt-12 lg:-mt-16">
            <ServicesSection />
          </div>

          {/* Contact section with spacing */}
          <div className="relative -mt-4 md:-mt-8">
            <ContactSection />
          </div>
        </main>

        {/* Footer with proper spacing */}
        <div className="relative mt-8 md:mt-12 lg:mt-16">
          <Footer />
        </div>
      </div>
    </div>
  );
};
