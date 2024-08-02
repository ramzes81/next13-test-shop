import Header from "../components/layout/Header";
import React from "react";
import AppProviders from "../lib/AppProviders";
import { fonts } from "../lib/theme/fonts";
import Content from "../components/layout/Content";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fonts.rubik.variable}>
      <body>
        <AppProviders>
          <Header />
          <Content>{children}</Content>
        </AppProviders>
      </body>
    </html>
  );
}
