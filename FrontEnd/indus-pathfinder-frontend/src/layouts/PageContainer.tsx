import type {
  PropsWithChildren,
} from "react";

import {
  Box,
} from "@mui/material";

export default function PageContainer({
  children,
}: PropsWithChildren) {
  return (
    <Box
      sx={{
        width:
          "100%",

        maxWidth:
          "1540px",

        mx:
          "auto",

        px: {
          xs:
            2,

          sm:
            2.5,

          md:
            3,

          xl:
            4,
        },

        py: {
          xs:
            2,

          md:
            3,
        },
      }}
    >
      {children}
    </Box>
  );
}