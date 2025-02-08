"use client";

import Navbar from "../src/components/layout/Navbar";
import CallToAction from "@/components/layout/CallToAction";
import Hero1 from "./home/Hero1";
import Hero2 from "./home/Hero2";
import Hero3 from "./home/Hero3";
import Hero4 from "./home/Hero4";
import Hero5 from "./home/Hero5";


export default function HomePage() {
  return (
    <>
      <Navbar />
          <Hero1 />
          <Hero2 />
          <Hero3 />
          <Hero4 />
          <Hero5 />
      <CallToAction />
    </>
  );
}
