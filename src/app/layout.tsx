import type { Metadata } from "next";
import "./globals.css";
import LoaderComponent from "@/components/UI/LoaderComponent";

export const metadata: Metadata = {
  title: "EduSpark",
  description: "EduSpark - A Learning Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LoaderComponent />
        {children}
      </body>
    </html>
  );
}
