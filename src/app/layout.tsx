import type { Metadata } from "next";
import { Google_Sans_Flex } from "next/font/google";
import "./globals.css";

const googleSans = Google_Sans_Flex({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://imtisalem.in"),
  title: "IMTI — Indian Montessori Training Institute | Salem, Tamil Nadu",
  description:
    "Government-approved, WSC dual-certified Montessori teacher training institute in Salem, Tamil Nadu. Diploma courses in Montessori, Nursery, Primary & Pre-School Management, led by Mrs. P. Rooba.",
  keywords: [
    "Montessori Teacher Training Institute in Salem",
    "BSS Montessori Course",
    "WSC Certified Montessori Training",
    "Government Approved Montessori Institute",
    "Dual Certification Teacher Training",
    "Early Childhood Education Course",
    "Preschool Teacher Training",
    "Montessori Diploma Course",
    "Pre School Management Course",
    "Montessori Training in Tamil Nadu",
    "Best Montessori Institute in Salem",
    "Inclusive Education Course",
    "Special Education Teacher Training",
    "Autism Teacher Training",
    "Early Intervention Course",
  ],
  openGraph: {
    title: "IMTI — Indian Montessori Training Institute",
    description:
      "Artisanal excellence in Montessori teacher training. Government & WSC dual-certified diploma courses in Salem, Tamil Nadu.",
    locale: "en_IN",
    type: "website",
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
      className={`h-full antialiased font-sans ${googleSans.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
