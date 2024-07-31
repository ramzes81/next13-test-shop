import Header from "../components/Header";
import React from "react";
import AppProviders from "../lib/AppProviders";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviders>
      <html lang="en">
        <body>
          <Header />
          <main>{children}</main>
        </body>
      </html>
    </AppProviders>
  );
}
