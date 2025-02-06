"use client";

import Navbar from "../src/components/layout/Navbar";
import CallToAction from "@/components/layout/CallToAction";
import Hero1 from "./home/Hero1";


export default function HomePage() {
  return (
    <>
      <Navbar />
          <Hero1 />
      <CallToAction />
    </>
  );
}
