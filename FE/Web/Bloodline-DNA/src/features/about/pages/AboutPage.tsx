import React from "react";
import { Footer, Header } from "../../../components";
import {
  HeroSection,
  HistorySection,
  MissionVisionSection,
  ValuesSection,
  TeamSection,
  AchievementsSection,
  TechnologySection
} from "../components";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <Header />
      <HeroSection />
      <HistorySection />
      <MissionVisionSection />
      <ValuesSection />
      <TeamSection />
      <AchievementsSection />
      <TechnologySection />
      <Footer />
    </div>
  );
};

export default AboutPage; 