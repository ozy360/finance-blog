import type { Metadata } from "next";
import {
  IBM_Plex_Serif,
  Source_Serif_4,
  Playfair_Display,
  Schibsted_Grotesk,
} from "next/font/google";
import "./globals.css";
import "./color.css";
import { Theme } from "@radix-ui/themes";

const heading = Schibsted_Grotesk({
  variable: "--font-heading-sans",
  // weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  // weight: ["400", "700"],

  subsets: ["latin"],
});

const body = IBM_Plex_Serif({
  variable: "--font-body-serif",
  weight: ["200", "300", "400", "500", "600", "700"],
  // weight: ["400", "700"],

  subsets: ["latin"],
});

const logo = Playfair_Display({
  variable: "--font-logo-serif",
  weight: ["400", "500", "600", "700", "800", "900"],
  // weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BusinessDisrupts",
  description:
    "Stay updated with the latest in finance, business news, investing, and personal finance tips at BusinessDisrupts.",
  icons: {
    icon: "/logo3.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="mx-auto max-w-screen-2xl 4xl:mx-auto 4xl:max-w-screen-4x bg-white"
    >
      <body
        className={`${logo.variable} ${body.variable} ${heading.variable} antialiased `}
      >
        <Theme accentColor="blue" grayColor="mauve">
          {children}
        </Theme>
      </body>
    </html>
  );
}
