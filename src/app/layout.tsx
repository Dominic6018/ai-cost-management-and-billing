import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  PRODUCT_DESCRIPTION,
  PRODUCT_NAME,
  PRODUCT_TITLE,
} from "@/lib/product";
import { parseSiteVerification } from "@/lib/site-verification";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Read when the pages are built, so set it before deploying.
const googleSiteVerification = parseSiteVerification(
  process.env.GOOGLE_SITE_VERIFICATION,
);

export const metadata: Metadata = {
  // Pages set their own title ("Prices"); the brand follows it in the tab.
  title: { default: PRODUCT_TITLE, template: `%s · ${PRODUCT_NAME}` },
  description: PRODUCT_DESCRIPTION,
  applicationName: PRODUCT_NAME,
  // Link previews. No URL or image is set: the app's address is the
  // deployment's own, and there's no brand artwork yet.
  openGraph: {
    type: "website",
    siteName: PRODUCT_NAME,
    title: PRODUCT_TITLE,
    description: PRODUCT_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: PRODUCT_TITLE,
    description: PRODUCT_DESCRIPTION,
  },
  // Google Search Console's ownership check, when it's set up.
  ...(googleSiteVerification && {
    verification: { google: googleSiteVerification },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
