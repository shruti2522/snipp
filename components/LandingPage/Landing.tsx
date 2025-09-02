
import AboutSection from "./About";
import Features from "./Features";
import Hero1 from "./Hero";
import Footer from "./Footer";
import Footer1 from "./Footer";

const Landing = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black">
    <Hero1 />
	<Features />
	<AboutSection />
	<Footer1 />
    </div>
  );
};

export default Landing;
