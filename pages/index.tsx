"use client";

import Navbar from "../src/components/Navbar";
import CallToAction from "@/components/CallToAction";
import Hero1 from "../src/components/hero/Hero1";


export default function HomePage() {
  return (
    <>
      <Navbar />
          <Hero1 />
      <CallToAction />
    </>
  );
}
