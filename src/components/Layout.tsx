import { Providers } from "@/app/providers";
import React from "react";
import LargeWithAppLinksAndSocial from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Box, ColorModeScript } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import "../app/globals.css";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Banner from "@/components/NewsBanner";
import PageHelpful from "@/components/PageHelpful";
import ViewsShare from "@/components/ViewsNShare";
// import ViewsShare from "@/components/ViewsNShare";

const mont = Inter({ subsets: ["latin"] });
const AllLayout = ({ children }: { children: React.ReactNode }) => {
  const router = usePathname();
  return (
    <motion.div
      key={router}
      initial="initialState"
      animate="animateState"
      exit="exitState"
      transition={{
        duration: 0.75,
      }}
      variants={{
        initialState: {
          opacity: 0,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        },
        animateState: {
          opacity: 1,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        },
        exitState: {
          clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
        },
      }}
      className={`${mont.className} base-page-size`}
    >
      <Head>
        <title>EIPs Insights</title>
        <link rel="icon" href="/eipFavicon.png" />
      </Head>
      <ColorModeScript initialColorMode="light" />
      <Providers>
        <Navbar />
        {/*<Banner />*/}
        {children}
        {/* <Box className={"flex justify-center mb-6"}>
          <PageHelpful pageName={router ? router.split("/")[1] : ""} />
        </Box> */}
        {/* <ViewsShare path={`${router}`}/> */}
        <LargeWithAppLinksAndSocial />
      </Providers>
    </motion.div>
  );
};

export default AllLayout;
