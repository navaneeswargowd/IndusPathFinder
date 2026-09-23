import {
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import {
  ArrowBackRounded,
  ArrowForwardRounded,
  BusinessOutlined,
  DomainOutlined,
  LocationOnOutlined,
  PersonOutlineRounded,
} from "@mui/icons-material";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Controller,
  useForm,
  type SubmitHandler,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  useSnackbar,
} from "notistack";

import {
  Country,
  State,
  City,
} from "country-state-city";

import {
  registrationSchema,
  type RegistrationFormValues,
} from "../../schemas/registration.schema";

import {
  createOrganizationApi,
} from "../../api/organization.api";

import {
  getActiveCategoriesApi,
} from "../../api/category.api";

import {
  getErrorMessage,
} from "../../utils/error.utils";

import {
  ROUTES,
} from "../../config/routes.config";

import {
  allowAddressInput,
  allowCinInput,
  allowEmailInput,
  allowGstInput,
  //allowLogoInput,
  allowNameInput,
  allowNumbersOnly,
  allowOrganizationName,
  allowPanInput,
  allowRegistrationNumberInput,
  allowUsernameInput,
  allowWebsiteInput,
  upperCaseNoSpaces,
  allowDistrictInput,
} from "../../utils/validation.utils";

import PrimaryButton
  from "../../components/buttons/PrimaryButton";

 


/*
 * ============================================================
 * STEP FIELDS
 * ============================================================
 */

const STEP_ONE_FIELDS:
  (keyof RegistrationFormValues)[] = [
    "orgName",
    "categoryId",
    "orgEmail",
    "orgPhone",
    "website",
  ];


const STEP_TWO_FIELDS:
  (keyof RegistrationFormValues)[] = [
    "country",
    "state",
    "city",
    "dist",
    "pin",
    "address",
    "logo",
  ];


const STEP_THREE_FIELDS:
  (keyof RegistrationFormValues)[] = [
    "cin",
    "regNum",
    "pan",
    "gst",
  ];


// const STEP_FOUR_FIELDS:
//   (keyof RegistrationFormValues)[] = [
//     "firstName",
//     "lastName",
//     "userName",
//     "email",
//     "contact",
//   ];


/*
 * ============================================================
 * COMPONENT
 * ============================================================
 */

export default function RegisterPage() {

  const navigate =
    useNavigate();


  const {
    enqueueSnackbar,
  } = useSnackbar();


  const [
    currentStep,
    setCurrentStep,
  ] = useState(1);


  /*
   * ==========================================================
   * COUNTRY / STATE
   * ==========================================================
   */

  const [
    selectedCountryCode,
    setSelectedCountryCode,
  ] = useState("IN");


  const [
    selectedStateCode,
    setSelectedStateCode,
  ] = useState("");


  /*
   * ==========================================================
   * FORM
   * ==========================================================
   */

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
  } = useForm<RegistrationFormValues>({
    resolver:
      zodResolver(
        registrationSchema
      ),

    mode:
      "onTouched",

    defaultValues: {

      categoryId: 0,

      orgName: "",

      orgEmail: "",

      orgPhone: "",

      contact: "",

      website: "",

      country: "India",

      state: "",

      city: "",

      dist: "",

      pin: "",

      address: "",

      logo: "",

      cin: "",

      regNum: "",

      pan: "",

      gst: "",

      firstName: "",

      lastName: "",

      userName: "",

      email: "",
    },
  });


  /*
   * ==========================================================
   * CATEGORY
   * ==========================================================
   */

  const categoryQuery =
    useQuery({
      queryKey: [
        "registration-categories",
      ],

      queryFn:
        getActiveCategoriesApi,

      retry:
        false,
    });


  const categoryOptions =
    (
      categoryQuery.data ??
      []
    ).map(
      (category) => ({
        label:
          category.categoryName,

        value:
          category.categoryId,
      })
    );


  /*
   * ==========================================================
   * COUNTRIES
   * ==========================================================
   */

  const countryOptions =
    useMemo(
      () =>
        Country
          .getAllCountries()
          .map(
            (country) => ({
              label:
                country.name,

              value:
                country.isoCode,
            })
          ),
      []
    );


  /*
   * ==========================================================
   * STATES
   * ==========================================================
   */

  const stateOptions =
    useMemo(
      () => {

        if (
          !selectedCountryCode
        ) {
          return [];
        }

        return State
          .getStatesOfCountry(
            selectedCountryCode
          )
          .map(
            (state) => ({
              label:
                state.name,

              value:
                state.isoCode,
            })
          );
      },
      [
        selectedCountryCode,
      ]
    );


  /*
   * ==========================================================
   * CITIES
   * ==========================================================
   */

  const cityOptions =
    useMemo(
      () => {

        if (
          !selectedCountryCode ||
          !selectedStateCode
        ) {
          return [];
        }

        return City
          .getCitiesOfState(
            selectedCountryCode,
            selectedStateCode
          )
          .map(
            (city) => ({
              label:
                city.name,

              value:
                city.name,
            })
          );
      },
      [
        selectedCountryCode,
        selectedStateCode,
      ]
    );


  /*
   * ==========================================================
   * REGISTER API
   * ==========================================================
   */

  const registerMutation =
    useMutation({

      mutationFn:
        createOrganizationApi,

      onSuccess:
        (
          response
        ) => {

          enqueueSnackbar(
            `${response.orgName} registered successfully.`,
            {
              variant:
                "success",
            }
          );


          navigate(
            ROUTES.LOGIN,
            {
              replace:
                true,
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
   * STEP 1
   * ==========================================================
   */

  const handleStepOneNext =
    async () => {

      const valid =
        await trigger(
          STEP_ONE_FIELDS
        );


      if (!valid) {
        return;
      }


      setCurrentStep(2);


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };


  /*
   * ==========================================================
   * STEP 2
   * ==========================================================
   */

  const handleStepTwoNext =
    async () => {

      const valid =
        await trigger(
          STEP_TWO_FIELDS
        );


      if (!valid) {
        return;
      }


      setCurrentStep(3);


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };


  /*
   * ==========================================================
   * STEP 3
   * ==========================================================
   */

  const handleStepThreeNext =
    async () => {

      const valid =
        await trigger(
          STEP_THREE_FIELDS
        );


      if (!valid) {
        return;
      }


      setCurrentStep(4);


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };


  /*
   * ==========================================================
   * BACK
   * ==========================================================
   */

  const handleBack =
    () => {

      if (
        currentStep > 1
      ) {

        setCurrentStep(
          (previous) =>
            previous - 1
        );


        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };


  /*
   * ==========================================================
   * FINAL SUBMIT
   * ==========================================================
   */

const onSubmit:
  SubmitHandler<RegistrationFormValues> =
  (values) => {
    console.log(
      "REGISTER SUBMIT VALUES:",
      values
    );

    registerMutation.mutate({
      ...values,
      website:
        values.website ?? "",
    });
  };

const onInvalid = (errors: any) => {
  console.log(
    "ACTUAL VALIDATION ERRORS:",
    errors
  );

  Object.entries(errors).forEach(
    ([field, error]) => {
      console.log(
        `${field}:`,
        (error as any)?.message
      );
    }
  );
};
  /*
   * ==========================================================
   * UI
   * ==========================================================
   */

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1050,
        mx: "auto",
        py: {
          xs: 1,
          md: 0.5,
        },
      }}
    >

      {/* HEADER */}

      <Box
        sx={{
          mb: 1.5,
        }}
      >

        <Typography
          sx={{
            fontSize: "0.68rem",
            fontWeight: 750,
            color: "secondary.main",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Organization Onboarding
        </Typography>


        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent:
              "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 1,
            mt: 0.3,
          }}
        >

          <Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 750,
                letterSpacing: "-0.03em",
              }}
            >
              Register Organization
            </Typography>


            <Typography
              sx={{
                mt: 0.25,
                color: "text.secondary",
                fontSize: "0.75rem",
              }}
            >
              Create your IndusPathFinder
              workspace and Project Manager account.
            </Typography>

          </Box>


          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "primary.main",
            }}
          >
            Step {currentStep} of 4
          </Typography>

        </Box>

      </Box>


      {/* STEP INDICATORS */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, 1fr)",
          gap: 1,
          mb: 1.5,
        }}
      >

        <StepIndicator
          number={1}
          label="Organization"
          active={
            currentStep === 1
          }
          completed={
            currentStep > 1
          }
        />


        <StepIndicator
          number={2}
          label="Address"
          active={
            currentStep === 2
          }
          completed={
            currentStep > 2
          }
        />


        <StepIndicator
          number={3}
          label="Business"
          active={
            currentStep === 3
          }
          completed={
            currentStep > 3
          }
        />


        <StepIndicator
          number={4}
          label="Project Manager"
          active={
            currentStep === 4
          }
          completed={false}
        />

      </Box>


      {/* FORM */}

<Box
  component="form"
  onSubmit={handleSubmit(
    onSubmit,
    onInvalid
  )}
  noValidate
>

        {/* ==================================================
            STEP 1
        ================================================== */}

        {currentStep === 1 && (

          <RegistrationSection
            number="01"
            title="Organization Details"
            description="Enter the primary organization information."
            icon={
              <DomainOutlined />
            }
          >

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                columnGap: 1.5,
                rowGap: 0.25,
              }}
            >

              <ControlledTextField
                name="orgName"
                control={control}
                label="Organization Name *"
                allowValue={
                  allowOrganizationName
                }
                maxLength={100}
                autoFocus
              />


              {/* CATEGORY */}

              <Controller
                name="categoryId"
                control={control}
                render={({
                  field,
                  fieldState,
                }) => (

                  <FormControl
                    fullWidth
                    size="small"
                  >

                    <InputLabel>
                      Organization Category *
                    </InputLabel>


                    <Select
                      {...field}
                      label="Organization Category *"
                      value={
                        field.value ?? 0
                      }
                      onChange={(
                        event
                      ) => {

                        field.onChange(
                          Number(
                            event.target.value
                          )
                        );
                      }}
                    >

                      <MenuItem
                        value={0}
                      >
                        <em>
                          Select Category
                        </em>
                      </MenuItem>


                      {
                        categoryOptions.map(
                          (
                            category
                          ) => (

                            <MenuItem
                              key={
                                category.value
                              }
                              value={
                                category.value
                              }
                            >
                              {
                                category.label
                              }
                            </MenuItem>

                          )
                        )
                      }

                    </Select>


                    <FormHelperText
                      sx={{
                        color: fieldState.error
                          ? "error.main"
                          : "text.secondary",
                      }}
                    >
                      {
                        fieldState.error
                          ?.message ?? " "
                      }
                    </FormHelperText>

                  </FormControl>
                )}
              />


              {/* <ControlledTextField
                name="orgEmail"
                control={control}
                label="Organization Email *"
                allowValue={allowEmailInput}
                type="email"
                maxLength={100}
              /> */}


                                      <ControlledTextField
                        name="orgEmail"
                        control={control}
                        label="Organization Email *"
                        allowValue={allowEmailInput}
                        type="email"
                        maxLength={100}
                        onKeyDown={(event) => {
                          if (event.key === " ") {
                            event.preventDefault();
                          }
                        }}
                      />


              <ControlledTextField
                name="orgPhone"
                control={control}
                label="Organization Phone *"
                allowValue={
                  allowNumbersOnly
                }
                inputMode="numeric"
                maxLength={10}
              />


              {/* <ControlledTextField
                name="contact"
                control={control}
                label="Project Manager Contact Number *"
                allowValue={
                  allowNumbersOnly
                }
                inputMode="numeric"
                maxLength={10}
              /> */}


              <ControlledTextField
                name="website"
                control={control}
                label="Website (Optional)"
                allowValue={
                  allowWebsiteInput
                }
                maxLength={200}
                placeholder="https://company.com"
              />

            </Box>


            {
              categoryQuery.isError && (

                <Typography
                  sx={{
                    mt: 0.5,
                    color: "error.main",
                    fontSize: "0.72rem",
                  }}
                >
                  Unable to load organization
                  categories.
                </Typography>

              )
            }


            <StepActions>

              <Box />

              <Button
                variant="contained"
                endIcon={
                  <ArrowForwardRounded />
                }
                onClick={
                  handleStepOneNext
                }
                sx={{
                  minWidth: 125,
                }}
              >
                Next
              </Button>

            </StepActions>

          </RegistrationSection>
        )}


        {/* ==================================================
            STEP 2
        ================================================== */}

        {currentStep === 2 && (

          <RegistrationSection
            number="02"
            title="Address"
            description="Enter the organization's location and address."
            icon={
              <LocationOnOutlined />
            }
          >

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                columnGap: 1.5,
                rowGap: 0.25,
              }}
            >

              {/* COUNTRY */}

              <Controller
                name="country"
                control={control}
                render={({
                  field,
                  fieldState,
                }) => (

                  <FormControl
                    fullWidth
                    size="small"
                  >

                    <InputLabel>
                      Country *
                    </InputLabel>


                    <Select
                      label="Country *"
                      value={
                        selectedCountryCode
                      }
                      onBlur={
                        field.onBlur
                      }
                      onChange={(
                        event
                      ) => {

                        const code =
                          String(
                            event.target.value
                          );

                        const country =
                          Country
                            .getCountryByCode(
                              code
                            );


                        setSelectedCountryCode(
                          code
                        );

                        setSelectedStateCode(
                          ""
                        );


                        field.onChange(
                          country?.name ?? ""
                        );


                        setValue(
                          "state",
                          "",
                          {
                            shouldDirty:
                              true,

                            shouldValidate:
                              true,
                          }
                        );


                        setValue(
                          "city",
                          "",
                          {
                            shouldDirty:
                              true,

                            shouldValidate:
                              true,
                          }
                        );
                      }}
                    >

                      {
                        countryOptions.map(
                          (
                            country
                          ) => (

                            <MenuItem
                              key={
                                country.value
                              }
                              value={
                                country.value
                              }
                            >
                              {
                                country.label
                              }
                            </MenuItem>

                          )
                        )
                      }

                    </Select>


                    <FormHelperText
                      sx={{
                        color: fieldState.error
                          ? "error.main"
                          : "text.secondary",
                      }}
                    >
                      {
                        fieldState.error
                          ?.message ?? " "
                      }
                    </FormHelperText>

                  </FormControl>
                )}
              />


              {/* STATE */}

              <Controller
                name="state"
                control={control}
                render={({
                  field,
                  fieldState,
                }) => (

                  <FormControl
                    fullWidth
                    size="small"
                    disabled={
                      !selectedCountryCode
                    }
                  >

                    <InputLabel>
                      State *
                    </InputLabel>


                    <Select
                      label="State *"
                      value={
                        selectedStateCode
                      }
                      onBlur={
                        field.onBlur
                      }
                      onChange={(
                        event
                      ) => {

                        const code =
                          String(
                            event.target.value
                          );


                        const state =
                          State
                            .getStateByCodeAndCountry(
                              code,
                              selectedCountryCode
                            );


                        setSelectedStateCode(
                          code
                        );


                        field.onChange(
                          state?.name ?? ""
                        );


                        setValue(
                          "city",
                          "",
                          {
                            shouldDirty:
                              true,

                            shouldValidate:
                              true,
                          }
                        );
                      }}
                    >

                      <MenuItem value="">
                        <em>
                          Select State
                        </em>
                      </MenuItem>


                      {
                        stateOptions.map(
                          (
                            state
                          ) => (

                            <MenuItem
                              key={
                                state.value
                              }
                              value={
                                state.value
                              }
                            >
                              {
                                state.label
                              }
                            </MenuItem>

                          )
                        )
                      }

                    </Select>


                    <FormHelperText
                      sx={{
                        color: fieldState.error
                          ? "error.main"
                          : "text.secondary",
                      }}
                    >
                      {
                        fieldState.error
                          ?.message ?? " "
                      }
                    </FormHelperText>

                  </FormControl>
                )}
              />


              {/* CITY */}

               {/* CITY */}

                <Controller
                  name="city"
                  control={control}
                  render={({
                    field,
                    fieldState,
                  }) => (

                    <FormControl
                      fullWidth
                      size="small"
                      disabled={!selectedStateCode}
                    >

                      <InputLabel>
                        City *
                      </InputLabel>

                      <Select
                        label="City *"
                        value={field.value ?? ""}
                        onBlur={field.onBlur}
                        onChange={(event) => {
                          field.onChange(
                            String(event.target.value)
                          );
                        }}
                      >

                        <MenuItem value="">
                          <em>Select City</em>
                        </MenuItem>

                        {cityOptions.map((city) => (
                          <MenuItem
                            key={city.value}
                            value={city.value}
                          >
                            {city.label}
                          </MenuItem>
                        ))}

                      </Select>

                      <FormHelperText
                        sx={{
                          color: fieldState.error
                            ? "error.main"
                            : "text.secondary",

                          "&.Mui-disabled": {
                            color: fieldState.error
                              ? "error.main"
                              : "text.disabled",
                          },
                        }}
                      >
                        {fieldState.error?.message ?? " "}
                      </FormHelperText>

                    </FormControl>
                  )}
                />


              {/* DISTRICT */}

             <ControlledTextField
                name="dist"
                control={control}
                label="District *"
                allowValue={allowDistrictInput}
                maxLength={60}
              />

              {/* PIN */}

              <ControlledTextField
                name="pin"
                control={control}
                label="PIN Code *"
                allowValue={
                  allowNumbersOnly
                }
                inputMode="numeric"
                maxLength={6}
              />


              {/* LOGO */}
              {/* <ControlledTextField
                name="logo"
                control={control}
                label="Logo Reference (Optional)"
                allowValue={
                  allowLogoInput
                }
                maxLength={250}
              /> */}


              {/* ADDRESS */}

              <Box
                sx={{
                  gridColumn: {
                    xs: "auto",
                    sm: "1 / -1",
                  },
                }}
              >

                <ControlledTextField
                  name="address"
                  control={control}
                  label="Address *"
                  allowValue={
                    allowAddressInput
                  }
                  multiline
                  minRows={2}
                  maxRows={2}
                  maxLength={250}
                />

              </Box>

            </Box>


            <StepActions>

              <Button
                variant="outlined"
                startIcon={
                  <ArrowBackRounded />
                }
                onClick={
                  handleBack
                }
              >
                Back
              </Button>


              <Button
                variant="contained"
                endIcon={
                  <ArrowForwardRounded />
                }
                onClick={
                  handleStepTwoNext
                }
              >
                Next
              </Button>

            </StepActions>

          </RegistrationSection>
        )}


        {/* ==================================================
            STEP 3
        ================================================== */}

        {currentStep === 3 && (

          <RegistrationSection
            number="03"
            title="Business Details"
            description="Enter legal registration information."
            icon={
              <BusinessOutlined />
            }
          >

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                columnGap: 1.5,
                rowGap: 0.25,
              }}
            >

              {/* CIN */}



              <BusinessTextField
                name="cin"
                control={control}
                setValue={setValue}
                label="CIN *"
                allowValue={allowCinInput}
                transformInput={upperCaseNoSpaces}
                maxLength={21}
                placeholder="L12345MH2020PLC123456"
              />


              {/* REGISTRATION NUMBER */}

              {/* <BusinessTextField
                name="regNum"
                control={control}
                label="Registration Number *"
                allowValue={
                  allowRegistrationNumberInput
                }
                transformInput={
                  upperCaseNoSpaces
                }
                maxLength={30}
                placeholder="12345ABC"
              /> */}


  <BusinessTextField
  name="regNum"
  control={control}
  label="Registration Number *"
  allowValue={allowRegistrationNumberInput}
  transformInput={upperCaseNoSpaces}
  maxLength={30}
  placeholder="12345ABC"
  disabled
/>


              {/* PAN */}

              <BusinessTextField
                name="pan"
                control={control}
                label="PAN *"
                allowValue={
                  allowPanInput
                }
                transformInput={
                  upperCaseNoSpaces
                }
                maxLength={10}
                placeholder="ABCDE1234F"
              />


              {/* GST */}

              <BusinessTextField
                name="gst"
                control={control}
                label="GSTIN *"
                allowValue={
                  allowGstInput
                }
                transformInput={
                  upperCaseNoSpaces
                }
                maxLength={15}
                placeholder="22ABCDE1234F1Z5"
              />

            </Box>


            <StepActions>

              <Button
                variant="outlined"
                startIcon={
                  <ArrowBackRounded />
                }
                onClick={
                  handleBack
                }
              >
                Back
              </Button>


              <Button
                variant="contained"
                endIcon={
                  <ArrowForwardRounded />
                }
                onClick={
                  handleStepThreeNext
                }
              >
                Next
              </Button>

            </StepActions>

          </RegistrationSection>
        )}


        {/* ==================================================
            STEP 4
        ================================================== */}

        {currentStep === 4 && (

          <RegistrationSection
            number="04"
            title="Project Manager"
            description="Create the primary Project Manager account."
            icon={
              <PersonOutlineRounded />
            }
          >

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                columnGap: 1.5,
                rowGap: 0.25,
                maxWidth: 800,
                mx: "auto",
                width: "100%",
              }}
            >

            <ControlledTextField
                name="firstName"
                control={control}
                label="First Name *"
                allowValue={allowNameInput}
                maxLength={50}
              />


              <ControlledTextField
                name="lastName"
                control={control}
                label="Last Name *"
                allowValue={
                  allowNameInput
                }
                maxLength={50}
              />


              <ControlledTextField
                name="userName"
                control={control}
                label="Username *"
                allowValue={allowUsernameInput}
                maxLength={15}
              />


             {/* <ControlledTextField
                name="email"
                control={control}
                label="Project Manager Email *"
                allowValue={allowEmailInput}
                type="email"
                maxLength={100}
                autoComplete="email"
              /> */}

                          <ControlledTextField
                            name="email"
                            control={control}
                            label="Project Manager Email *"
                            allowValue={allowEmailInput}
                            type="email"
                            maxLength={100}
                            autoComplete="email"
                            onKeyDown={(event) => {
                              if (event.key === " ") {
                                event.preventDefault();
                              }
                            }}
                          />
              <ControlledTextField
                name="contact"
                control={control}
                label="Contact Number *"
                allowValue={
                  allowNumbersOnly
                }
                inputMode="numeric"
                maxLength={10}
              />
                          

            </Box>


            <StepActions>

              <Button
                variant="outlined"
                startIcon={
                  <ArrowBackRounded />
                }
                onClick={
                  handleBack
                }
              >
                Back
              </Button>


              <PrimaryButton
                type="submit"
                loading={
                  registerMutation.isPending
                }
                startIcon={
                  !registerMutation.isPending
                    ? (
                      <BusinessOutlined />
                    )
                    : undefined
                }
              >
                Register Organization
              </PrimaryButton>

            </StepActions>

          </RegistrationSection>
        )}

      </Box>


      {/* LOGIN */}

      <Divider
        sx={{
          my: 1.5,
        }}
      />


      <Typography
        sx={{
          textAlign: "center",
          color: "text.secondary",
          fontSize: "0.78rem",
        }}
      >
        Already registered?{" "}

        <Button
          component={Link}
          to={ROUTES.LOGIN}
          size="small"
          sx={{
            px: 0.5,
            minHeight: 0,
          }}
        >
          Sign in
        </Button>

      </Typography>

    </Box>
  );
}


/*
 * ============================================================
 * CONTROLLED TEXT FIELD
 * ============================================================
 */

interface ControlledTextFieldProps {

  name:
    keyof RegistrationFormValues;

  control:
    ReturnType<
      typeof useForm<RegistrationFormValues>
    >["control"];

  label:
    string;


  allowValue?:
    (
      value: string
    ) => boolean;

  transformInput?:
    (
      value: string
    ) => string;

      onBeforeInput?: (
  event: React.FormEvent<HTMLInputElement>
) => void;

onKeyDown?: (
  event: React.KeyboardEvent<HTMLInputElement>
) => void;

  maxLength?:
    number;

  placeholder?:
    string;

  type?:
    string;

  inputMode?:
    React.HTMLAttributes<
      HTMLInputElement
    >["inputMode"];

  autoFocus?:
    boolean;

  autoComplete?:
    string;

  multiline?:
    boolean;

  minRows?:
    number;

  maxRows?:
    number;
}




function ControlledTextField({
  name,
  control,
  label,
  allowValue,
  transformInput,
  maxLength,
  placeholder,
  type,
  inputMode,
  autoFocus,
  autoComplete,
  multiline,
  minRows,
  maxRows,
  //onBeforeInput,
    onKeyDown,
}: ControlledTextFieldProps) {

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field,
        fieldState,
      }) => (
        <TextField
          fullWidth
          size="small"
          label={label}
          value={field.value ?? ""}
          onBlur={field.onBlur}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          multiline={multiline}
          minRows={minRows}
          maxRows={maxRows}






// onChange={(event) => {
//   let value =
//     event.target.value;

//   if (transformInput) {
//     value =
//       transformInput(value);
//   }

//   if (
//     allowValue &&
//     !allowValue(value)
//   ) {
//     return;
//   }

//   field.onChange(value);
// }}


onChange={(event) => {
  let value =
    event.target.value;

  if (transformInput) {
    value =
      transformInput(value);
  }

  /*
   * INVALID CHARACTER
   *
   * Completely reject it and
   * immediately restore the
   * previous valid value.
   */
  if (
    allowValue &&
    !allowValue(value)
  ) {
    event.target.value =
      String(field.value ?? "");

    return;
  }

  field.onChange(value);
}}

          helperText={
            fieldState.error?.message ?? " "
          }

          // slotProps={{
          //   htmlInput: {
          //     maxLength,
          //   },
          //   formHelperText: {
          //     sx: {
          //       color: fieldState.error
          //         ? "error.main"
          //         : "text.secondary",
          //     },
          //   },
          // }}



          //           slotProps={{
          //   htmlInput: {
          //     maxLength,
          //     onBeforeInput, // ADD THIS
          //   },

          //   formHelperText: {
          //     sx: {
          //       color: fieldState.error
          //         ? "error.main"
          //         : "text.secondary",
          //     },
          //   },
          // }}


                        slotProps={{
                htmlInput: {
                  maxLength,
                  onKeyDown,
                },

                formHelperText: {
                  sx: {
                    color: fieldState.error
                      ? "error.main"
                      : "text.secondary",
                  },
                },
              }}
        />
      )}
    />
  );
}


/*
 * ============================================================
 * BUSINESS TEXT FIELD
 * ============================================================
 *
 * CIN / PAN / GST / Registration Number
 *
 * NO getInputGuidance()
 *
 * NO GuidedTextField
 *
 * NO manual validation messages.
 *
 * Zod controls the error message.
 */

interface BusinessTextFieldProps {

  name:
    | "cin"
    | "regNum"
    | "pan"
    | "gst";

  control:
    ReturnType<
      typeof useForm<RegistrationFormValues>
    >["control"];


  setValue?: ReturnType<
  typeof useForm<RegistrationFormValues>
>["setValue"];
  label:
    string;

  allowValue:
    (
      value: string
    ) => boolean;

  transformInput?:
    (
      value: string
    ) => string;

  maxLength:
    number;

  placeholder?:
    string;

    disabled?:
  boolean;
}


function BusinessTextField({
  name,
  control,
  label,
  setValue,
  allowValue,
  transformInput,
  maxLength,
  placeholder,
  disabled,
}: BusinessTextFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field,
        fieldState,
      }) => {
        const value = String(
          field.value ?? ""
        );

        return (
          <TextField
            fullWidth
            size="small"
            label={label}
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onBlur={field.onBlur}
            onChange={(
              event: ChangeEvent<HTMLInputElement>
            ) => {
              let newValue = event.target.value;

              if (transformInput) {
                newValue = transformInput(
                  newValue
                );
              }

              if (!allowValue(newValue)) {
                return;
              }

              field.onChange(newValue);

              if (
                name === "cin" &&
                newValue.length === 21 &&
                setValue
              ) {
                const lastSixDigits =
                  newValue.slice(-6);

                setValue(
                  "regNum",
                  lastSixDigits,
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                );
              }

              if (
                name === "cin" &&
                newValue.length < 21 &&
                setValue
              ) {
                setValue(
                  "regNum",
                  "",
                  {
                    shouldDirty: true,
                    shouldValidate: false,
                  }
                );
              }
            }}
            helperText={
              fieldState.error?.message ?? " "
            }
            slotProps={{
              htmlInput: {
                maxLength,
              },
              formHelperText: {
                sx: {
                  fontSize: "0.72rem",
                  mt: 0.5,
                  ml: 0.2,
                  color: fieldState.error
                    ? "error.main"
                    : "text.secondary",
                },
              },
            }}
          />
        );
      }}
    />
  );
}


/*
 * ============================================================
 * REGISTRATION SECTION
 * ============================================================
 */

interface RegistrationSectionProps {

  number:
    string;

  title:
    string;

  description:
    string;

  icon:
    ReactNode;

  children:
    ReactNode;
}


function RegistrationSection({

  number,

  title,

  description,

  icon,

  children,

}: RegistrationSectionProps) {

  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 1.5,
          sm: 2,
        },

        border:
          "1px solid",

        borderColor:
          "divider",

        borderRadius:
          2.5,

        backgroundColor:
          "#FFFFFF",
      }}
    >

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          mb: 1.5,
        }}
      >

        <Box
          sx={{
            width: 36,
            height: 36,
            flexShrink: 0,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            borderRadius: 2,

            color:
              "primary.main",

            background:
              "linear-gradient(135deg, rgba(23,59,115,0.09), rgba(13,146,184,0.13))",

            "& svg": {
              fontSize: 20,
            },
          }}
        >
          {icon}
        </Box>


        <Box>

          <Typography
            sx={{
              fontSize: "0.62rem",
              fontWeight: 750,
              color: "secondary.main",
              letterSpacing: "0.11em",
            }}
          >
            STEP {number}
          </Typography>


          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.92rem",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>


          <Typography
            sx={{
              mt: 0.15,
              color: "text.secondary",
              fontSize: "0.7rem",
            }}
          >
            {description}
          </Typography>

        </Box>

      </Box>


      {children}

    </Paper>
  );
}


/*
 * ============================================================
 * STEP ACTIONS
 * ============================================================
 */

interface StepActionsProps {

  children:
    ReactNode;
}


function StepActions({
  children,
}: StepActionsProps) {

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        mt: 1,
        pt: 1,

        borderTop:
          "1px solid",

        borderColor:
          "divider",
      }}
    >
      {children}
    </Box>
  );
}


/*
 * ============================================================
 * STEP INDICATOR
 * ============================================================
 */

interface StepIndicatorProps {

  number:
    number;

  label:
    string;

  active:
    boolean;

  completed:
    boolean;
}


function StepIndicator({

  number,

  label,

  active,

  completed,

}: StepIndicatorProps) {

  return (
    <Box
      sx={{
        px: {
          xs: 0.7,
          sm: 1.2,
        },

        py: 0.7,

        borderRadius: 2,

        border:
          "1px solid",

        borderColor:
          active || completed
            ? "primary.main"
            : "divider",

        backgroundColor:
          active
            ? "rgba(23,59,115,0.05)"
            : "background.paper",

        display: "flex",
        alignItems: "center",

        gap: 0.7,
      }}
    >

      <Box
        sx={{
          width: 23,
          height: 23,

          borderRadius:
            "50%",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          flexShrink: 0,

          fontSize: "0.68rem",
          fontWeight: 750,

          color:
            active || completed
              ? "primary.contrastText"
              : "text.secondary",

          backgroundColor:
            active || completed
              ? "primary.main"
              : "action.hover",
        }}
      >
        {
          completed
            ? "✓"
            : number
        }
      </Box>


      <Typography
        sx={{
          fontSize: {
            xs: "0.62rem",
            sm: "0.73rem",
          },

          fontWeight:
            active
              ? 700
              : 600,

          color:
            active
              ? "primary.main"
              : "text.secondary",

          whiteSpace: {
            xs: "normal",
            sm: "nowrap",
          },
        }}
      >
        {label}
      </Typography>

    </Box>
  );
}
