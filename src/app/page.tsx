import Hero from "@/components/Hero";
import FeaturedProperty from "@/components/FeaturedProperty";
import Listings from "@/components/Listings";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProperty />
      <Listings />
      <About />
      <Contact />
    </>
  );
}
