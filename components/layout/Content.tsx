"use client";

import { ReactNode } from "react";
import { Box } from "@chakra-ui/react";

export default function Content({ children }: { children: ReactNode }) {
  return (
    <Box maxWidth="900px" margin="0 auto">
      {children}
    </Box>
  );
}
