import "@/styles/globals.css";

import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { Inter as FontSans } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Header from "./_components/layout/Header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      className={cn(
        "bg-background box-border min-h-screen font-sans antialiased",
        fontSans.variable,
      )}
    >
      <body
        // className={`font-sans ${inter.variable} m-0 bg-black bg-opacity-5 p-0 text-base`}
        className={` m-0 bg-black bg-opacity-5 p-0 text-base`}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <Header />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
};

export default RootLayout;
