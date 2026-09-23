import {
  Breadcrumbs,
  Link,
  Typography,
} from "@mui/material";

import {
  NavigateNextRounded,
} from "@mui/icons-material";

import {
  Link as RouterLink,
  useLocation,
} from "react-router-dom";

import {
  ROUTES,
} from "../config/routes.config";

function formatSegment(
  segment:
    string
): string {
  return segment
    .replace(
      /-/g,
      " "
    )
    .replace(
      /\b\w/g,
      character =>
        character.toUpperCase()
    );
}

export default function BreadcrumbNavigation() {
  const location =
    useLocation();

  const pathnames =
    location.pathname
      .split("/")
      .filter(
        Boolean
      );

  if (
    pathnames.length ===
    0
  ) {
    return null;
  }

  const root =
    pathnames[0];

  const isPm =
    root ===
    "pm";

  const isAdmin =
    root ===
    "admin";

  const homePath =
    isPm
      ? ROUTES
          .PROJECT_MANAGER
          .DASHBOARD
      : isAdmin
        ? ROUTES
            .ADMIN
            .DASHBOARD
        : ROUTES.ROOT;

  const rootLabel =
    isPm
      ? "PM"
      : isAdmin
        ? "Admin"
        : formatSegment(
            root
          );

  /*
   * If currently on Dashboard:
   *
   * PM > Dashboard
   *
   * PM is clickable.
   */
  const remainingSegments =
    pathnames.slice(
      1
    );

  return (
    <Breadcrumbs
      separator={
        <NavigateNextRounded
          sx={{
            fontSize:
              16,
          }}
        />
      }
      sx={{
        mb:
          2.5,

        "& .MuiBreadcrumbs-separator":
          {
            mx:
              0.5,

            color:
              "text.disabled",
          },
      }}
    >
      {/* ROOT */}

      <Link
        component={
          RouterLink
        }
        to={
          homePath
        }
        underline="hover"
        sx={{
          fontSize:
            "0.78rem",

          fontWeight:
            650,

          color:
            "primary.main",
        }}
      >
        {rootLabel}
      </Link>

      {/* REMAINING PATH */}

      {remainingSegments.map(
        (
          value,
          index
        ) => {
          const actualIndex =
            index +
            1;

          const last =
            actualIndex ===
            pathnames.length -
              1;

          const to =
            `/${pathnames
              .slice(
                0,
                actualIndex +
                  1
              )
              .join("/")}`;

          const isNumeric =
            /^\d+$/.test(
              value
            );

          const label =
            isNumeric
              ? `Project ${value}`
              : formatSegment(
                  value
                );

          if (
            last
          ) {
            return (
              <Typography
                key={
                  to
                }
                sx={{
                  fontSize:
                    "0.78rem",

                  fontWeight:
                    700,

                  color:
                    "text.primary",
                }}
              >
                {label}
              </Typography>
            );
          }

          return (
            <Link
              key={
                to
              }
              component={
                RouterLink
              }
              to={
                to
              }
              underline="hover"
              sx={{
                fontSize:
                  "0.78rem",

                color:
                  "text.secondary",

                "&:hover":
                  {
                    color:
                      "primary.main",
                  },
              }}
            >
              {label}
            </Link>
          );
        }
      )}
    </Breadcrumbs>
  );
}