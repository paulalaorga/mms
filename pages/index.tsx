import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../next-i18next.config.cjs"; // 👈 Importación explícita de la config

import Navbar from "../src/components/layout/Navbar";
import CallToAction from "@/components/layout/CallToAction";
import Hero1 from "./home/Hero1";
import Hero2 from "./home/Hero2";
import Hero3 from "./home/Hero3";
import Hero4 from "./home/Hero4";
import Hero5 from "./home/Hero5";
import Footer from "@/components/layout/Footer";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  console.log("🟡 Cargando traducciones para locale:", locale); // 👈 Verifica qué idioma se está pasando

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "es", ["hero1"], nextI18NextConfig)), 
    },
  };
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero1 />
      <Hero2 />
      <Hero3 />
      <Hero4 />
      <Hero5 />
      <Footer />
      <CallToAction />
    </>
  );
}