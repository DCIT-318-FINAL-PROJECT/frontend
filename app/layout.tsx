import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import FindMyID from "./findmyid";
export const metadata: Metadata = {
  title: "FindMyID · University of Ghana",
  description:
    "Find your ID. Help someone find theirs. A University of Ghana student ID recovery prototype.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <FindMyID />
      </body>
    </html>
  );
}
