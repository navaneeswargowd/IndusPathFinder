import {
  AssessmentOutlined,
  CloseRounded,
  DescriptionOutlined,
  DownloadRounded,
  FolderOutlined,
  GridOnRounded,
  HubOutlined,
  InsertDriveFileOutlined,
  PictureAsPdfOutlined,
  ScheduleOutlined,
  TableChartOutlined,
  TimelineOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  useState,
} from "react";

import {
  useMutation,
} from "@tanstack/react-query";

import {
  useSnackbar,
} from "notistack";

import {
  generateReportApi,
} from "../../api/report.api";

import {
  ExportFormat,
  ReportType,
} from "../../enums/report.enums";

import type {
  GeneratedReport,
  ReportRequest,
} from "../../types/report.types";

import {
  getErrorMessage,
} from "../../utils/error.utils";

interface ReportsTabProps {
  projectId:
    number;

  projectCode:
    string;

  projectName:
    string;
}

export default function ReportsTab({
  projectId,
  projectCode,
  projectName,
}: ReportsTabProps) {
  const {
    enqueueSnackbar,
  } =
    useSnackbar();

  const [
    reportType,
    setReportType,
  ] =
    useState<ReportType>(
      ReportType.PROJECT
    );

  const [
    exportFormat,
    setExportFormat,
  ] =
    useState<ExportFormat>(
      ExportFormat.PDF
    );

  /*
   * Generated report is kept here.
   *
   * Important:
   * We DO NOT download automatically anymore.
   */
  const [
    lastGenerated,
    setLastGenerated,
  ] =
    useState<GeneratedReport | null>(
      null
    );

  /*
   * Preview dialog
   */
  const [
    previewOpen,
    setPreviewOpen,
  ] =
    useState(
      false
    );

  const [
    previewUrl,
    setPreviewUrl,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    csvPreview,
    setCsvPreview,
  ] =
    useState(
      ""
    );

  const mutation =
    useMutation<
      GeneratedReport,
      unknown,
      ReportRequest
    >({
      mutationFn:
        generateReportApi,

      onSuccess:
        (
          report
        ) => {
          /*
           * Store generated report.
           *
           * Do not download automatically.
           */
          setLastGenerated(
            report
          );

          enqueueSnackbar(
            `${formatReportType(
              reportType
            )} generated successfully. Preview or download the file.`,
            {
              variant:
                "success",
            }
          );
        },

      onError:
        (
          error
        ) => {
          enqueueSnackbar(
            getErrorMessage(
              error
            ),
            {
              variant:
                "error",
            }
          );
        },
    });

  /*
   * ==========================================================
   * GENERATE REPORT
   * ==========================================================
   */

  const handleGenerate =
    () => {
      /*
       * Clear previous generated report.
       */
      closePreview();

      setLastGenerated(
        null
      );

      mutation.mutate({
        projectId,

        reportType,

        exportFormat,
      });
    };

  /*
   * ==========================================================
   * PREVIEW
   * ==========================================================
   */

  const handlePreview =
    async () => {
      if (
        !lastGenerated
      ) {
        return;
      }

      closePreview();

      /*
       * PDF
       *
       * Browser can render PDF directly.
       */
      if (
        exportFormat ===
        ExportFormat.PDF
      ) {
        const url =
          window.URL.createObjectURL(
            lastGenerated.blob
          );

        setPreviewUrl(
          url
        );

        setPreviewOpen(
          true
        );

        return;
      }

      /*
       * CSV
       *
       * Read text directly from Blob.
       */
      if (
        exportFormat ===
        ExportFormat.CSV
      ) {
        try {
          const text =
            await lastGenerated
              .blob
              .text();

          setCsvPreview(
            text
          );

          setPreviewOpen(
            true
          );
        } catch {
          enqueueSnackbar(
            "Unable to preview CSV file.",
            {
              variant:
                "error",
            }
          );
        }

        return;
      }

      /*
       * EXCEL
       *
       * Browser cannot reliably render XLSX
       * without an Excel parsing library.
       *
       * We still open the preview dialog and
       * show file information.
       */
      setPreviewOpen(
        true
      );
    };

  /*
   * ==========================================================
   * CLOSE PREVIEW
   * ==========================================================
   */

  const closePreview =
    () => {
      if (
        previewUrl
      ) {
        window.URL.revokeObjectURL(
          previewUrl
        );
      }

      setPreviewUrl(
        null
      );

      setCsvPreview(
        ""
      );

      setPreviewOpen(
        false
      );
    };

  /*
   * ==========================================================
   * DOWNLOAD
   * ==========================================================
   */

  const handleDownload =
    () => {
      if (
        !lastGenerated
      ) {
        return;
      }

      downloadFileWithCurrentDate(
        lastGenerated
      );

      enqueueSnackbar(
        "Report downloaded successfully.",
        {
          variant:
            "success",
        }
      );
    };

  const selectedReport =
    reportOptions.find(
      (
        option
      ) =>
        option.value ===
        reportType
    );

  return (
    <Box>
      {/* ================================================== */}
      {/* PAGE INTRO */}
      {/* ================================================== */}

      <Paper
        elevation={0}
        sx={{
          mb:
            2,

          p: {
            xs:
              2,

            md:
              2.5,
          },

          display:
            "flex",

          flexDirection: {
            xs:
              "column",

            md:
              "row",
          },

          justifyContent:
            "space-between",

          alignItems: {
            xs:
              "flex-start",

            md:
              "center",
          },

          gap:
            2,

          border:
            "1px solid",

          borderColor:
            "divider",

          borderRadius:
            2.5,

          background:
            "linear-gradient(135deg, #F8FAFC 0%, #EEF7F8 100%)",
        }}
      >
        <Box
          sx={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              1.4,
          }}
        >
          <Box
            sx={{
              width:
                46,

              height:
                46,

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              flexShrink:
                0,

              borderRadius:
                2.2,

              color:
                "#078E91",

              backgroundColor:
                "#E8F7F7",
            }}
          >
            <AssessmentOutlined />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize:
                  "0.95rem",

                fontWeight:
                  750,
              }}
            >
              Project Reports
            </Typography>

            <Typography
              sx={{
                mt:
                  0.25,

                color:
                  "text.secondary",

                fontSize:
                  "0.72rem",

                lineHeight:
                  1.6,
              }}
            >
              Generate project planning
              and analysis reports in PDF,
              Excel or CSV format.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display:
              "flex",

            gap:
              0.7,

            flexWrap:
              "wrap",
          }}
        >
          <Chip
            label={
              projectCode
            }
            size="small"
            sx={{
              fontWeight:
                700,
            }}
          />

          <Chip
            label="Jasper Reports"
            size="small"
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* ================================================== */}
      {/* CONTENT GRID */}
      {/* ================================================== */}

      <Box
        sx={{
          display:
            "grid",

          gridTemplateColumns: {
            xs:
              "1fr",

            lg:
              "minmax(0, 1.5fr) minmax(300px, 0.7fr)",
          },

          gap:
            2,
        }}
      >
        {/* ================================================= */}
        {/* REPORT TYPES */}
        {/* ================================================= */}

        <Box>
          <Typography
            sx={{
              mb:
                1,

              fontSize:
                "0.75rem",

              color:
                "text.secondary",

              fontWeight:
                700,

              textTransform:
                "uppercase",

              letterSpacing:
                "0.05em",
            }}
          >
            Choose Report
          </Typography>

          <Box
            sx={{
              display:
                "grid",

              gridTemplateColumns: {
                xs:
                  "1fr",

                sm:
                  "repeat(2, minmax(0, 1fr))",
              },

              gap:
                1.2,
            }}
          >
            {reportOptions.map(
              (
                option
              ) => {
                const selected =
                  option.value ===
                  reportType;

                return (
                  <Paper
                    key={
                      option.value
                    }
                    component="button"
                    type="button"
                    elevation={0}
                    onClick={() => {
                      setReportType(
                        option.value
                      );

                      /*
                       * Old generated file belongs
                       * to previous selection.
                       */
                      setLastGenerated(
                        null
                      );

                      closePreview();
                    }}
                    sx={{
                      p:
                        2,

                      width:
                        "100%",

                      display:
                        "flex",

                      alignItems:
                        "flex-start",

                      gap:
                        1.4,

                      textAlign:
                        "left",

                      cursor:
                        "pointer",

                      appearance:
                        "none",

                      fontFamily:
                        "inherit",

                      border:
                        "1px solid",

                      borderColor:
                        selected
                          ? "#078E91"
                          : "divider",

                      borderRadius:
                        2.5,

                      backgroundColor:
                        selected
                          ? "#F0FAFA"
                          : "#FFFFFF",

                      boxShadow:
                        selected
                          ? "0 8px 25px rgba(7,142,145,0.08)"
                          : "none",

                      transition:
                        "all 150ms ease",

                      "&:hover":
                        {
                          borderColor:
                            "#078E91",

                          transform:
                            "translateY(-1px)",
                        },
                    }}
                  >
                    <Box
                      sx={{
                        width:
                          40,

                        height:
                          40,

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        flexShrink:
                          0,

                        borderRadius:
                          2,

                        color:
                          selected
                            ? "#FFFFFF"
                            : "#078E91",

                        backgroundColor:
                          selected
                            ? "#078E91"
                            : "#E8F7F7",

                        "& svg":
                          {
                            fontSize:
                              21,
                          },
                      }}
                    >
                      {
                        option.icon
                      }
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontWeight:
                            720,

                          fontSize:
                            "0.82rem",
                        }}
                      >
                        {
                          option.label
                        }
                      </Typography>

                      <Typography
                        sx={{
                          mt:
                            0.35,

                          color:
                            "text.secondary",

                          fontSize:
                            "0.68rem",

                          lineHeight:
                            1.55,
                        }}
                      >
                        {
                          option.description
                        }
                      </Typography>
                    </Box>
                  </Paper>
                );
              }
            )}
          </Box>
        </Box>

        {/* ================================================= */}
        {/* GENERATE PANEL */}
        {/* ================================================= */}

        <Paper
          elevation={0}
          sx={{
            p:
              2.5,

            alignSelf:
              "start",

            border:
              "1px solid",

            borderColor:
              "divider",

            borderRadius:
              2.5,
          }}
        >
          <Typography
            sx={{
              fontWeight:
                750,

              fontSize:
                "0.9rem",
            }}
          >
            Generate Report
          </Typography>

          <Typography
            sx={{
              mt:
                0.4,

              mb:
                2.2,

              color:
                "text.secondary",

              fontSize:
                "0.69rem",

              lineHeight:
                1.6,
            }}
          >
            Choose the export format,
            generate the report, preview it
            and then download.
          </Typography>

          {/* PROJECT */}

          <Box
            sx={{
              p:
                1.6,

              mb:
                2,

              borderRadius:
                2,

              backgroundColor:
                "#F8FAFC",

              border:
                "1px solid #E7EDF4",
            }}
          >
            <Typography
              sx={{
                color:
                  "text.secondary",

                fontSize:
                  "0.63rem",

                fontWeight:
                  700,

                textTransform:
                  "uppercase",

                letterSpacing:
                  "0.04em",
              }}
            >
              Project
            </Typography>

            <Typography
              sx={{
                mt:
                  0.5,

                fontWeight:
                  700,

                fontSize:
                  "0.8rem",
              }}
            >
              {projectName}
            </Typography>

            <Typography
              sx={{
                mt:
                  0.2,

                color:
                  "text.secondary",

                fontSize:
                  "0.66rem",
              }}
            >
              {projectCode}
            </Typography>
          </Box>

          {/* SELECTED REPORT */}

          <Box
            sx={{
              mb:
                2,
            }}
          >
            <Typography
              sx={{
                mb:
                  0.7,

                color:
                  "text.secondary",

                fontSize:
                  "0.66rem",

                fontWeight:
                  650,
              }}
            >
              Report Type
            </Typography>

            <TextField
              fullWidth
              size="small"
              value={
                formatReportType(
                  reportType
                )
              }
              disabled
            />
          </Box>

          {/* FORMAT */}

          <Box
            sx={{
              mb:
                2.5,
            }}
          >
            <Typography
              sx={{
                mb:
                  0.7,

                color:
                  "text.secondary",

                fontSize:
                  "0.66rem",

                fontWeight:
                  650,
              }}
            >
              Export Format
            </Typography>

            <TextField
              select
              fullWidth
              size="small"
              value={
                exportFormat
              }
              onChange={(
                event
              ) => {
                setExportFormat(
                  event.target
                    .value as ExportFormat
                );

                /*
                 * Previous generated file has
                 * another format.
                 */
                setLastGenerated(
                  null
                );

                closePreview();
              }}
            >
              <MenuItem
                value={
                  ExportFormat.PDF
                }
              >
                <Box
                  sx={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      1,
                  }}
                >
                  <PictureAsPdfOutlined
                    fontSize="small"
                  />

                  PDF Document
                </Box>
              </MenuItem>

              <MenuItem
                value={
                  ExportFormat.EXCEL
                }
              >
                <Box
                  sx={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      1,
                  }}
                >
                  <GridOnRounded
                    fontSize="small"
                  />

                  Excel Workbook
                </Box>
              </MenuItem>

              <MenuItem
                value={
                  ExportFormat.CSV
                }
              >
                <Box
                  sx={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      1,
                  }}
                >
                  <TableChartOutlined
                    fontSize="small"
                  />

                  CSV File
                </Box>
              </MenuItem>
            </TextField>
          </Box>

          {/* GENERATE */}

          <Button
            fullWidth
            variant="contained"
            startIcon={
              mutation.isPending
                ? undefined
                : <InsertDriveFileOutlined />
            }
            disabled={
              mutation.isPending
            }
            onClick={
              handleGenerate
            }
            sx={{
              minHeight:
                42,

              backgroundColor:
                "#078E91",

              fontWeight:
                700,

              "&:hover":
                {
                  backgroundColor:
                    "#067A7D",
                },
            }}
          >
            {mutation.isPending
              ? "Generating..."
              : `Generate ${exportFormat}`}
          </Button>

          {/* GENERATING */}

          {mutation.isPending && (
            <Box
              sx={{
                mt:
                  2,

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                gap:
                  1,
              }}
            >
              <CircularProgress
                size={
                  17
                }
              />

              <Typography
                sx={{
                  color:
                    "text.secondary",

                  fontSize:
                    "0.67rem",
                }}
              >
                Preparing{" "}
                {
                  selectedReport
                    ?.label
                }
                ...
              </Typography>
            </Box>
          )}

          {/* ================================================= */}
          {/* GENERATED FILE */}
          {/* ================================================= */}

          {lastGenerated && (
            <Box
              sx={{
                mt:
                  2,

                p:
                  1.5,

                borderRadius:
                  2,

                backgroundColor:
                  "#ECFDF3",

                border:
                  "1px solid #ABEFC6",
              }}
            >
              <Typography
                sx={{
                  color:
                    "#067647",

                  fontSize:
                    "0.68rem",

                  fontWeight:
                    700,
                }}
              >
                Report ready
              </Typography>

              <Typography
                sx={{
                  mt:
                    0.4,

                  color:
                    "#344054",

                  fontSize:
                    "0.68rem",

                  wordBreak:
                    "break-word",
                }}
              >
                {getFileNameWithCurrentDate(
                  lastGenerated.fileName
                )}
              </Typography>

              {/* PREVIEW + DOWNLOAD */}

              <Box
                sx={{
                  mt:
                    1.5,

                  display:
                    "grid",

                  gridTemplateColumns:
                    "1fr 1fr",

                  gap:
                    1,
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={
                    <VisibilityOutlined />
                  }
                  onClick={
                    handlePreview
                  }
                >
                  Preview
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  startIcon={
                    <DownloadRounded />
                  }
                  onClick={
                    handleDownload
                  }
                  sx={{
                    backgroundColor:
                      "#078E91",

                    "&:hover":
                      {
                        backgroundColor:
                          "#067A7D",
                      },
                  }}
                >
                  Download
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      {/* ================================================== */}
      {/* FORMAT INFO */}
      {/* ================================================== */}

      <Paper
        elevation={0}
        sx={{
          mt:
            2,

          p:
            2,

          display:
            "flex",

          alignItems:
            "flex-start",

          gap:
            1.2,

          border:
            "1px solid",

          borderColor:
            "divider",

          borderRadius:
            2.5,

          backgroundColor:
            "#FBFCFD",
        }}
      >
        <InsertDriveFileOutlined
          sx={{
            mt:
              0.1,

            color:
              "text.secondary",

            fontSize:
              20,
          }}
        />

        <Box>
          <Typography
            sx={{
              fontSize:
                "0.73rem",

              fontWeight:
                700,
            }}
          >
            Export formats
          </Typography>

          <Typography
            sx={{
              mt:
                0.3,

              color:
                "text.secondary",

              fontSize:
                "0.67rem",

              lineHeight:
                1.65,
            }}
          >
            PDF reports can be previewed
            directly. CSV content can be
            previewed as text. Excel files
            require an Excel viewer or
            spreadsheet application for
            full rendering.
          </Typography>
        </Box>
      </Paper>

      {/* ================================================== */}
      {/* PREVIEW DIALOG */}
      {/* ================================================== */}

      <Dialog
        open={
          previewOpen
        }
        onClose={
          closePreview
        }
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight:
                  750,

                fontSize:
                  "1rem",
              }}
            >
              Report Preview
            </Typography>

            {lastGenerated && (
              <Typography
                sx={{
                  mt:
                    0.25,

                  color:
                    "text.secondary",

                  fontSize:
                    "0.68rem",
                }}
              >
                {getFileNameWithCurrentDate(
                  lastGenerated.fileName
                )}
              </Typography>
            )}
          </Box>

          <Tooltip title="Close">
            <IconButton
              onClick={
                closePreview
              }
            >
              <CloseRounded />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p:
              0,
          }}
        >
          {/* PDF PREVIEW */}

          {exportFormat ===
            ExportFormat.PDF &&
            previewUrl && (
            <Box
              component="iframe"
              src={
                previewUrl
              }
              title="PDF Report Preview"
              sx={{
                width:
                  "100%",

                height:
                  "70vh",

                border:
                  0,

                display:
                  "block",
              }}
            />
          )}

          {/* CSV PREVIEW */}

          {exportFormat ===
            ExportFormat.CSV && (
            <Box
              component="pre"
              sx={{
                m:
                  0,

                p:
                  2.5,

                minHeight:
                  400,

                maxHeight:
                  "70vh",

                overflow:
                  "auto",

                whiteSpace:
                  "pre",

                fontFamily:
                  "monospace",

                fontSize:
                  "0.75rem",

                backgroundColor:
                  "#F8FAFC",
              }}
            >
              {csvPreview}
            </Box>
          )}

          {/* EXCEL PREVIEW */}

          {exportFormat ===
            ExportFormat.EXCEL && (
            <Box
              sx={{
                minHeight:
                  360,

                px:
                  3,

                py:
                  6,

                display:
                  "flex",

                flexDirection:
                  "column",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                textAlign:
                  "center",
              }}
            >
              <GridOnRounded
                sx={{
                  fontSize:
                    54,

                  color:
                    "#078E91",
                }}
              />

              <Typography
                sx={{
                  mt:
                    2,

                  fontWeight:
                    750,

                  fontSize:
                    "1rem",
                }}
              >
                Excel report is ready
              </Typography>

              <Typography
                sx={{
                  mt:
                    0.7,

                  maxWidth:
                    480,

                  color:
                    "text.secondary",

                  fontSize:
                    "0.75rem",

                  lineHeight:
                    1.7,
                }}
              >
                Excel workbooks cannot be
                reliably rendered directly
                by the browser without an
                Excel parsing library. You
                can download the generated
                workbook and open it in
                Excel or another spreadsheet
                application.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px:
              2.5,

            py:
              1.5,
          }}
        >
          <Button
            onClick={
              closePreview
            }
          >
            Close
          </Button>

          <Button
            variant="contained"
            startIcon={
              <DownloadRounded />
            }
            onClick={
              handleDownload
            }
            sx={{
              backgroundColor:
                "#078E91",

              "&:hover":
                {
                  backgroundColor:
                    "#067A7D",
                },
            }}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/*
 * ==========================================================
 * DOWNLOAD FILE WITH CURRENT DATE
 * ==========================================================
 */

function downloadFileWithCurrentDate(
  report:
    GeneratedReport
) {
  const url =
    window.URL.createObjectURL(
      report.blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href =
    url;

  /*
   * Example:
   *
   * ProjectReport.pdf
   *
   * becomes:
   *
   * ProjectReport_2026-08-13.pdf
   */
  link.download =
    getFileNameWithCurrentDate(
      report.fileName
    );

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  window.URL.revokeObjectURL(
    url
  );
}

/*
 * ==========================================================
 * FILE NAME + CURRENT DATE
 * ==========================================================
 */

function getFileNameWithCurrentDate(
  fileName:
    string
): string {
  const date =
    new Date();

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() +
        1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  const currentDate =
    `${year}-${month}-${day}`;

  /*
   * Find last extension.
   *
   * Example:
   *
   * CPMReport.pdf
   */
  const lastDot =
    fileName.lastIndexOf(
      "."
    );

  /*
   * File has no extension.
   */
  if (
    lastDot <=
    0
  ) {
    return `${fileName}_${currentDate}`;
  }

  const name =
    fileName.substring(
      0,
      lastDot
    );

  const extension =
    fileName.substring(
      lastDot
    );

  return `${name}_${currentDate}${extension}`;
}

/*
 * ==========================================================
 * REPORT LABEL
 * ==========================================================
 */

function formatReportType(
  value:
    ReportType
) {
  switch (
    value
  ) {
    case ReportType.PROJECT:
      return "Project Report";

    case ReportType.ACTIVITY:
      return "Activity Report";

    case ReportType.DEPENDENCY:
      return "Dependency Report";

    case ReportType.CPM:
      return "CPM Analysis Report";

    case ReportType.FLOAT:
      return "Float Analysis Report";

    default:
      return "Report";
  }
}

/*
 * ==========================================================
 * REPORT OPTIONS
 * ==========================================================
 */

const reportOptions: Array<{
  value:
    ReportType;

  label:
    string;

  description:
    string;

  icon:
    React.ReactNode;
}> = [
  {
    value:
      ReportType.PROJECT,

    label:
      "Project Report",

    description:
      "Project details, schedule, priority and current project status.",

    icon:
      <FolderOutlined />,
  },

  {
    value:
      ReportType.ACTIVITY,

    label:
      "Activity Report",

    description:
      "Complete activity schedule including duration, dates, priority and status.",

    icon:
      <ScheduleOutlined />,
  },

  {
    value:
      ReportType.DEPENDENCY,

    label:
      "Dependency Report",

    description:
      "Predecessor-successor relationships and dependency types.",

    icon:
      <HubOutlined />,
  },

  {
    value:
      ReportType.CPM,

    label:
      "CPM Analysis Report",

    description:
      "EST, EFT, LST, LFT, critical activities, project duration and critical path.",

    icon:
      <TimelineOutlined />,
  },

  {
    value:
      ReportType.FLOAT,

    label:
      "Float Analysis Report",

    description:
      "Total Float, Free Float, Independent Float and critical activity status.",

    icon:
      <DescriptionOutlined />,
  },
];