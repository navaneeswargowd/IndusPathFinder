// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   MenuItem,
//   TextField,
//   Typography,
// } from "@mui/material";

// import {
//   CloseRounded,
// } from "@mui/icons-material";

// import {
//   Controller,
//   useForm,
// } from "react-hook-form";

// import {
//   useEffect,
// } from "react";

// import {
//   zodResolver,
// } from "@hookform/resolvers/zod";

// import {
//   useQuery,
// } from "@tanstack/react-query";

// import {
//   dependencySchema,
//   type DependencyFormValues,
// } from "../../schemas/dependency.schema";

// import {
//   DependencyType,
// } from "../../enums/dependency.enums";

// import {
//   searchActivitiesApi,
// } from "../../api/activity.api";

// import {
//   getDependencyDetailsApi,
// } from "../../api/dependency.api";

// import PrimaryButton
//   from "../buttons/PrimaryButton";

// import {
//   getAllowedDependencyTypes,
// } from "../../utils/dependency.utils";


// interface DependencyFormDialogProps {
//   open:
//     boolean;

//   loading:
//     boolean;

//   projectId:
//     number;

//   dependencyId:
//     number | null;

//   onClose:
//     () => void;

//   onSubmit:
//     (
//       values:
//         DependencyFormValues
//     ) => void;
// }


// /*
//  * ============================================================
//  * VALIDATION MESSAGE STYLE
//  *
//  * Only the helper/error text becomes red.
//  * ============================================================
//  */

// const helperTextSx = (
//   hasError:
//     boolean
// ) => ({
//   color:
//     hasError
//       ? "error.main"
//       : "transparent",

//   fontSize:
//     "0.72rem",

//   mt:
//     0.5,

//   ml:
//     0.2,
// });


// export default function DependencyFormDialog({
//   open,
//   loading,
//   projectId,
//   dependencyId,
//   onClose,
//   onSubmit,
// }: DependencyFormDialogProps) {

//   const isEdit =
//     dependencyId !==
//     null;


//   const {
//     control,
//     handleSubmit,
//     reset,
//     watch,
//   } =
//     useForm<DependencyFormValues>({
//       resolver:
//         zodResolver(
//           dependencySchema
//         ),

//       defaultValues: {
//         predecessorActivityId:
//           0,

//         successorActivityId:
//           0,

//         dependencyType:
//           DependencyType.FS,
//       },

//       mode:
//         "onTouched",
//     });


//   const predecessorActivityId =
//     watch(
//       "predecessorActivityId"
//     );

//     const successorActivityId =
//   watch(
//     "successorActivityId"
//   );


//   /*
//    * ==========================================================
//    * LOAD PROJECT ACTIVITIES
//    * ==========================================================
//    */

//   const activitiesQuery =
//     useQuery({
//       queryKey: [
//         "dependency-activity-options",
//         projectId,
//       ],

//       queryFn:
//         () =>
//           searchActivitiesApi({
//             projectId,

//             page:
//               0,

//             size:
//               500,

//             sortBy:
//               "actId",

//             direction:
//               "asc",
//           }),

//       enabled:
//         open &&
//         projectId >
//         0,
//     });


//   /*
//    * ==========================================================
//    * LOAD DEPENDENCY DETAILS
//    * ==========================================================
//    */

//   const detailsQuery =
//     useQuery({
//       queryKey: [
//         "dependency-details-edit",
//         dependencyId,
//       ],

//       queryFn:
//         () =>
//           getDependencyDetailsApi({
//             dependencyId:
//               dependencyId!,
//           }),

//       enabled:
//         open &&
//         dependencyId !==
//         null,
//     });


//   /*
//    * ==========================================================
//    * RESET
//    * ==========================================================
//    */

//   useEffect(
//     () => {

//       if (
//         isEdit &&
//         detailsQuery.data
//       ) {

//         reset({
//           predecessorActivityId:
//             detailsQuery.data
//               .predecessorActivityId,

//           successorActivityId:
//             detailsQuery.data
//               .successorActivityId,

//           dependencyType:
//             detailsQuery.data
//               .dependencyType,
//         });

//         return;
//       }


//       if (
//         !isEdit
//       ) {

//         reset({
//           predecessorActivityId:
//             0,

//           successorActivityId:
//             0,

//           dependencyType:
//             DependencyType.FS,
//         });
//       }

//     },
//     [
//       isEdit,
//       detailsQuery.data,
//       open,
//       reset,
//     ]
//   );


//   const activities =
//     activitiesQuery.data
//       ?.content ??
//     [];


//     const predecessorActivity =
//   activities.find(
//     (activity) =>
//       activity.actId ===
//       predecessorActivityId
//   );

// const successorActivity =
//   activities.find(
//     (activity) =>
//       activity.actId ===
//       successorActivityId
//   );

// const allowedDependencyTypes =
//   predecessorActivity &&
//   successorActivity
//     ? getAllowedDependencyTypes(
//         predecessorActivity,
//         successorActivity
//       )
//     : [];


//   return (
//     <Dialog
//       open={
//         open
//       }
//       onClose={
//         loading
//           ? undefined
//           : onClose
//       }
//       fullWidth
//       maxWidth="sm"
//     >

//       {/* ==================================================== */}
//       {/* TITLE */}
//       {/* ==================================================== */}

//       <DialogTitle
//         sx={{
//           px:
//             3,

//           py:
//             2.4,

//           display:
//             "flex",

//           alignItems:
//             "center",

//           justifyContent:
//             "space-between",

//           borderBottom:
//             "1px solid",

//           borderColor:
//             "divider",
//         }}
//       >

//         <Box>

//           <Typography
//             sx={{
//               fontSize:
//                 "1.05rem",

//               fontWeight:
//                 750,
//             }}
//           >
//             {isEdit
//               ? "Edit Dependency"
//               : "Add Dependency"}
//           </Typography>


//           <Typography
//             sx={{
//               mt:
//                 0.25,

//               color:
//                 "text.secondary",

//               fontSize:
//                 "0.72rem",
//             }}
//           >
//             {isEdit
//               ? "Update the activity relationship."
//               : "Create a relationship between two project activities."}
//           </Typography>

//         </Box>


//         <Button
//           onClick={
//             onClose
//           }
//           disabled={
//             loading
//           }
//           sx={{
//             minWidth:
//               38,

//             width:
//               38,

//             height:
//               38,
//           }}
//         >
//           <CloseRounded />
//         </Button>

//       </DialogTitle>


//       {/* ==================================================== */}
//       {/* FORM */}
//       {/* ==================================================== */}

//       <Box
//         component="form"
//         noValidate
//         onSubmit={
//           handleSubmit(
//             onSubmit
//           )
//         }
//       >

//         <DialogContent
//           sx={{
//             p:
//               3,
//           }}
//         >

//           {activitiesQuery.isError && (

//             <Typography
//               sx={{
//                 mb:
//                   2,

//                 color:
//                   "error.main",

//                 fontSize:
//                   "0.76rem",
//               }}
//             >
//               Unable to load project activities.
//             </Typography>

//           )}


//           <Box
//             sx={{
//               display:
//                 "grid",

//               gap:
//                 2.2,
//             }}
//           >

//             {/* ================================================= */}
//             {/* PREDECESSOR */}
//             {/* ================================================= */}

//             <Controller
//               name="predecessorActivityId"
//               control={
//                 control
//               }
//               render={({
//                 field,
//                 fieldState,
//               }) => (

//                 <TextField
//                   select

//                   fullWidth

//                   label="Predecessor Activity *"

//                   value={
//                     field.value
//                   }

//                   onBlur={
//                     field.onBlur
//                   }

//                   onChange={(
//                     event
//                   ) => {

//                     field.onChange(
//                       Number(
//                         event.target.value
//                       )
//                     );
//                   }}

//                   /*
//                    * Keep border + label normal.
//                    */
//                   error={
//                     false
//                   }

//                   helperText={
//                     fieldState.error
//                       ?.message ??
//                     " "
//                   }

//                   slotProps={{
//                     formHelperText: {
//                       sx:
//                         helperTextSx(
//                           Boolean(
//                             fieldState.error
//                           )
//                         ),
//                     },
//                   }}
//                 >

//                   <MenuItem
//                     value={
//                       0
//                     }
//                     disabled
//                   >
//                     Select predecessor
//                   </MenuItem>


//                   {activities.map(
//                     (
//                       activity
//                     ) => (

//                       <MenuItem
//                         key={
//                           activity.actId
//                         }
//                         value={
//                           activity.actId
//                         }
//                       >
//                         {
//                           activity.actCode
//                         }{" "}
//                         —{" "}
//                         {
//                           activity.actName
//                         }
//                       </MenuItem>

//                     )
//                   )}

//                 </TextField>

//               )}
//             />


//             {/* ================================================= */}
//             {/* SUCCESSOR */}
//             {/* ================================================= */}

//             <Controller
//               name="successorActivityId"
//               control={
//                 control
//               }
//               render={({
//                 field,
//                 fieldState,
//               }) => (

//                 <TextField
//                   select

//                   fullWidth

//                   label="Successor Activity *"

//                   value={
//                     field.value
//                   }

//                   onBlur={
//                     field.onBlur
//                   }

//                   onChange={(
//                     event
//                   ) => {

//                     field.onChange(
//                       Number(
//                         event.target.value
//                       )
//                     );
//                   }}

//                   /*
//                    * No red border/label.
//                    */
//                   error={
//                     false
//                   }

//                   helperText={
//                     fieldState.error
//                       ?.message ??
//                     " "
//                   }

//                   slotProps={{
//                     formHelperText: {
//                       sx:
//                         helperTextSx(
//                           Boolean(
//                             fieldState.error
//                           )
//                         ),
//                     },
//                   }}
//                 >

//                   <MenuItem
//                     value={
//                       0
//                     }
//                     disabled
//                   >
//                     Select successor
//                   </MenuItem>


//                   {activities.map(
//                     (
//                       activity
//                     ) => (

//                       <MenuItem
//                         key={
//                           activity.actId
//                         }
//                         value={
//                           activity.actId
//                         }

//                         /*
//                          * User cannot select
//                          * same activity as predecessor.
//                          */
//                         disabled={
//                           activity.actId ===
//                           predecessorActivityId
//                         }
//                       >
//                         {
//                           activity.actCode
//                         }{" "}
//                         —{" "}
//                         {
//                           activity.actName
//                         }
//                       </MenuItem>

//                     )
//                   )}

//                 </TextField>

//               )}
//             />


//             {/* ================================================= */}
//             {/* DEPENDENCY TYPE */}
//             {/* ================================================= */}

//             <Controller
//               name="dependencyType"
//               control={
//                 control
//               }
//               render={({
//                 field,
//                 fieldState,
//               }) => (

//                 <TextField
//                   {...field}

//                   select

//                   fullWidth

//                   label="Dependency Type *"

//                   /*
//                    * No red border/label.
//                    */
//                   error={
//                     false
//                   }

//                   helperText={
//                     fieldState.error
//                       ?.message ??
//                     "FS = Finish to Start, SS = Start to Start, FF = Finish to Finish, SF = Start to Finish"
//                   }

//                   slotProps={{
//                     formHelperText: {
//                       sx: {
//                         color:
//                           fieldState.error
//                             ? "error.main"
//                             : "text.secondary",

//                         fontSize:
//                           "0.72rem",

//                         mt:
//                           0.5,

//                         ml:
//                           0.2,
//                       },
//                     },
//                   }}
//                 >

//                   <MenuItem
//                     value={
//                       DependencyType.FS
//                     }
//                   >
//                     FS — Finish to Start
//                   </MenuItem>


//                   <MenuItem
//                     value={
//                       DependencyType.SS
//                     }
//                   >
//                     SS — Start to Start
//                   </MenuItem>


//                   <MenuItem
//                     value={
//                       DependencyType.FF
//                     }
//                   >
//                     FF — Finish to Finish
//                   </MenuItem>


//                   <MenuItem
//                     value={
//                       DependencyType.SF
//                     }
//                   >
//                     SF — Start to Finish
//                   </MenuItem>

//                 </TextField>

//               )}
//             />

//           </Box>

//         </DialogContent>


//         {/* ================================================== */}
//         {/* ACTIONS */}
//         {/* ================================================== */}

//         <DialogActions
//           sx={{
//             px:
//               3,

//             py:
//               2,

//             borderTop:
//               "1px solid",

//             borderColor:
//               "divider",
//           }}
//         >

//           <Button
//             disabled={
//               loading
//             }
//             onClick={
//               onClose
//             }
//           >
//             Cancel
//           </Button>


//           <PrimaryButton
//             type="submit"
//             loading={
//               loading
//             }
//           >
//             {isEdit
//               ? "Save Changes"
//               : "Add Dependency"}
//           </PrimaryButton>

//         </DialogActions>

//       </Box>

//     </Dialog>
//   );
// }


// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   MenuItem,
//   TextField,
//   Typography,
// } from "@mui/material";

// import {
//   CloseRounded,
// } from "@mui/icons-material";

// import {
//   Controller,
//   useForm,
// } from "react-hook-form";

// import {
//   useEffect,
//   useMemo,
// } from "react";

// import {
//   zodResolver,
// } from "@hookform/resolvers/zod";

// import {
//   useQuery,
// } from "@tanstack/react-query";

// import {
//   dependencySchema,
//   type DependencyFormValues,
// } from "../../schemas/dependency.schema";

// import {
//   DependencyType,
// } from "../../enums/dependency.enums";

// import {
//   searchActivitiesApi,
// } from "../../api/activity.api";

// import {
//   getDependencyDetailsApi,
// } from "../../api/dependency.api";

// import {
//   getAllowedDependencyTypes,
// } from "../../utils/dependency.utils";

// import PrimaryButton
//   from "../buttons/PrimaryButton";


// interface DependencyFormDialogProps {
//   open:
//     boolean;

//   loading:
//     boolean;

//   projectId:
//     number;

//   dependencyId:
//     number | null;

//   onClose:
//     () => void;

//   onSubmit:
//     (
//       values:
//         DependencyFormValues
//     ) => void;
// }


// /*
//  * ============================================================
//  * VALIDATION MESSAGE STYLE
//  *
//  * Only the helper/error text becomes red.
//  * Border and label remain normal.
//  * ============================================================
//  */

// const helperTextSx = (
//   hasError:
//     boolean
// ) => ({
//   color:
//     hasError
//       ? "error.main"
//       : "transparent",

//   fontSize:
//     "0.72rem",

//   mt:
//     0.5,

//   ml:
//     0.2,
// });


// export default function DependencyFormDialog({
//   open,
//   loading,
//   projectId,
//   dependencyId,
//   onClose,
//   onSubmit,
// }: DependencyFormDialogProps) {

//   const isEdit =
//     dependencyId !==
//     null;


//   const {
//     control,
//     handleSubmit,
//     reset,
//     watch,
//     setValue,
//     setError,
//   } =
//     useForm<DependencyFormValues>({
//       resolver:
//         zodResolver(
//           dependencySchema
//         ),

//       defaultValues: {
//         predecessorActivityId:
//           0,

//         successorActivityId:
//           0,

//         /*
//          * We keep FS as the TypeScript-compatible
//          * initial value.
//          *
//          * It will NOT automatically be accepted.
//          * Date validation below checks whether
//          * it is actually allowed.
//          */
//         dependencyType:
//           DependencyType.FS,
//       },

//       mode:
//         "onTouched",
//     });


//   /*
//    * ==========================================================
//    * WATCH SELECTED VALUES
//    * ==========================================================
//    */

//   const predecessorActivityId =
//     watch(
//       "predecessorActivityId"
//     );

//   const successorActivityId =
//     watch(
//       "successorActivityId"
//     );

//   const selectedDependencyType =
//     watch(
//       "dependencyType"
//     );


//   /*
//    * ==========================================================
//    * LOAD PROJECT ACTIVITIES
//    * ==========================================================
//    */

//   const activitiesQuery =
//     useQuery({
//       queryKey: [
//         "dependency-activity-options",
//         projectId,
//       ],

//       queryFn:
//         () =>
//           searchActivitiesApi({
//             projectId,

//             page:
//               0,

//             size:
//               500,

//             sortBy:
//               "actId",

//             direction:
//               "asc",
//           }),

//       enabled:
//         open &&
//         projectId >
//           0,
//     });


//   /*
//    * ==========================================================
//    * LOAD DEPENDENCY DETAILS FOR EDIT
//    * ==========================================================
//    */

//   const detailsQuery =
//     useQuery({
//       queryKey: [
//         "dependency-details-edit",
//         dependencyId,
//       ],

//       queryFn:
//         () =>
//           getDependencyDetailsApi({
//             dependencyId:
//               dependencyId!,
//           }),

//       enabled:
//         open &&
//         dependencyId !==
//           null,
//     });


//   /*
//    * ==========================================================
//    * RESET FORM
//    * ==========================================================
//    */

//   useEffect(
//     () => {

//       if (
//         isEdit &&
//         detailsQuery.data
//       ) {

//         reset({
//           predecessorActivityId:
//             detailsQuery.data
//               .predecessorActivityId,

//           successorActivityId:
//             detailsQuery.data
//               .successorActivityId,

//           dependencyType:
//             detailsQuery.data
//               .dependencyType,
//         });

//         return;
//       }


//       if (
//         !isEdit
//       ) {

//         reset({
//           predecessorActivityId:
//             0,

//           successorActivityId:
//             0,

//           dependencyType:
//             DependencyType.FS,
//         });
//       }

//     },
//     [
//       isEdit,
//       detailsQuery.data,
//       open,
//       reset,
//     ]
//   );


//   /*
//    * ==========================================================
//    * PROJECT ACTIVITIES
//    * ==========================================================
//    */

//   const activities =
//     activitiesQuery.data
//       ?.content ??
//     [];


//   /*
//    * ==========================================================
//    * FIND SELECTED PREDECESSOR
//    * ==========================================================
//    */

//   const predecessorActivity =
//     useMemo(
//       () =>
//         activities.find(
//           (
//             activity
//           ) =>
//             activity.actId ===
//             predecessorActivityId
//         ),
//       [
//         activities,
//         predecessorActivityId,
//       ]
//     );


//   /*
//    * ==========================================================
//    * FIND SELECTED SUCCESSOR
//    * ==========================================================
//    */

//   const successorActivity =
//     useMemo(
//       () =>
//         activities.find(
//           (
//             activity
//           ) =>
//             activity.actId ===
//             successorActivityId
//         ),
//       [
//         activities,
//         successorActivityId,
//       ]
//     );


//   /*
//    * ==========================================================
//    * ALLOWED DEPENDENCY TYPES
//    * ==========================================================
//    */

//   const allowedDependencyTypes =
//     useMemo(
//       () => {

//         if (
//           !predecessorActivity ||
//           !successorActivity
//         ) {
//           return [];
//         }

//         return getAllowedDependencyTypes(
//           predecessorActivity,
//           successorActivity
//         );

//       },
//       [
//         predecessorActivity,
//         successorActivity,
//       ]
//     );


//   /*
//    * ==========================================================
//    * WHEN ACTIVITIES CHANGE
//    *
//    * If the currently selected dependency type becomes invalid,
//    * select the first valid dependency type.
//    *
//    * Example:
//    *
//    * Current = SS
//    *
//    * User changes activities.
//    *
//    * New dates only allow FS and SF.
//    *
//    * SS must not remain selected.
//    * ==========================================================
//    */

//   useEffect(
//     () => {

//       if (
//         !predecessorActivity ||
//         !successorActivity
//       ) {
//         return;
//       }

//       if (
//         allowedDependencyTypes.length ===
//         0
//       ) {
//         return;
//       }

//       const currentTypeIsAllowed =
//         allowedDependencyTypes.includes(
//           selectedDependencyType
//         );

//       if (
//         !currentTypeIsAllowed
//       ) {

//         setValue(
//           "dependencyType",
//           allowedDependencyTypes[0],
//           {
//             shouldValidate:
//               true,

//             shouldDirty:
//               true,
//           }
//         );
//       }

//     },
//     [
//       predecessorActivity,
//       successorActivity,
//       allowedDependencyTypes,
//       selectedDependencyType,
//       setValue,
//     ]
//   );


//   /*
//    * ==========================================================
//    * SUBMIT
//    * ==========================================================
//    *
//    * IMPORTANT:
//    * Disabled MenuItems are only UI protection.
//    *
//    * We check the selected dependency type again before
//    * calling the actual onSubmit.
//    * ==========================================================
//    */

//   const submitForm = (
//     values:
//       DependencyFormValues
//   ) => {

//     if (
//       !predecessorActivity ||
//       !successorActivity
//     ) {
//       return;
//     }


//     if (
//       !allowedDependencyTypes.includes(
//         values.dependencyType
//       )
//     ) {

//       setError(
//         "dependencyType",
//         {
//           type:
//             "manual",

//           message:
//             "Selected dependency type is not valid for the activity dates",
//         }
//       );

//       return;
//     }


//     onSubmit(
//       values
//     );
//   };


//   return (
//     <Dialog
//       open={
//         open
//       }

//       onClose={
//         loading
//           ? undefined
//           : onClose
//       }

//       fullWidth

//       maxWidth="sm"
//     >

//       {/* ==================================================== */}
//       {/* TITLE */}
//       {/* ==================================================== */}

//       <DialogTitle
//         sx={{
//           px:
//             3,

//           py:
//             2.4,

//           display:
//             "flex",

//           alignItems:
//             "center",

//           justifyContent:
//             "space-between",

//           borderBottom:
//             "1px solid",

//           borderColor:
//             "divider",
//         }}
//       >

//         <Box>

//           <Typography
//             sx={{
//               fontSize:
//                 "1.05rem",

//               fontWeight:
//                 750,
//             }}
//           >
//             {isEdit
//               ? "Edit Dependency"
//               : "Add Dependency"}
//           </Typography>


//           <Typography
//             sx={{
//               mt:
//                 0.25,

//               color:
//                 "text.secondary",

//               fontSize:
//                 "0.72rem",
//             }}
//           >
//             {isEdit
//               ? "Update the activity relationship."
//               : "Create a relationship between two project activities."}
//           </Typography>

//         </Box>


//         <Button
//           onClick={
//             onClose
//           }

//           disabled={
//             loading
//           }

//           sx={{
//             minWidth:
//               38,

//             width:
//               38,

//             height:
//               38,
//           }}
//         >
//           <CloseRounded />
//         </Button>

//       </DialogTitle>


//       {/* ==================================================== */}
//       {/* FORM */}
//       {/* ==================================================== */}

//       <Box
//         component="form"

//         noValidate

//         onSubmit={
//           handleSubmit(
//             submitForm
//           )
//         }
//       >

//         <DialogContent
//           sx={{
//             p:
//               3,
//           }}
//         >

//           {activitiesQuery.isError && (

//             <Typography
//               sx={{
//                 mb:
//                   2,

//                 color:
//                   "error.main",

//                 fontSize:
//                   "0.76rem",
//               }}
//             >
//               Unable to load project activities.
//             </Typography>

//           )}


//           <Box
//             sx={{
//               display:
//                 "grid",

//               gap:
//                 2.2,
//             }}
//           >

//             {/* ================================================= */}
//             {/* PREDECESSOR */}
//             {/* ================================================= */}

//             <Controller
//               name="predecessorActivityId"

//               control={
//                 control
//               }

//               render={({
//                 field,
//                 fieldState,
//               }) => (

//                 <TextField
//                   select

//                   fullWidth

//                   label="Predecessor Activity *"

//                   value={
//                     field.value
//                   }

//                   onBlur={
//                     field.onBlur
//                   }

//                   onChange={(
//                     event
//                   ) => {

//                     const value =
//                       Number(
//                         event.target.value
//                       );

//                     field.onChange(
//                       value
//                     );


//                     /*
//                      * If predecessor becomes same
//                      * as currently selected successor,
//                      * reset successor.
//                      */
//                     if (
//                       value ===
//                       successorActivityId
//                     ) {

//                       setValue(
//                         "successorActivityId",
//                         0,
//                         {
//                           shouldValidate:
//                             true,
//                         }
//                       );
//                     }
//                   }}

//                   /*
//                    * Keep border and label normal.
//                    */
//                   error={
//                     false
//                   }

//                   helperText={
//                     fieldState.error
//                       ?.message ??
//                     " "
//                   }

//                   slotProps={{
//                     formHelperText: {
//                       sx:
//                         helperTextSx(
//                           Boolean(
//                             fieldState.error
//                           )
//                         ),
//                     },
//                   }}
//                 >

//                   <MenuItem
//                     value={
//                       0
//                     }

//                     disabled
//                   >
//                     Select predecessor
//                   </MenuItem>


//                   {activities.map(
//                     (
//                       activity
//                     ) => (

//                       <MenuItem
//                         key={
//                           activity.actId
//                         }

//                         value={
//                           activity.actId
//                         }

//                         /*
//                          * Also prevent choosing
//                          * current successor as predecessor.
//                          */
//                         disabled={
//                           activity.actId ===
//                           successorActivityId
//                         }
//                       >
//                         {
//                           activity.actCode
//                         }{" "}
//                         —{" "}
//                         {
//                           activity.actName
//                         }
//                       </MenuItem>

//                     )
//                   )}

//                 </TextField>

//               )}
//             />


//             {/* ================================================= */}
//             {/* SUCCESSOR */}
//             {/* ================================================= */}

//             <Controller
//               name="successorActivityId"

//               control={
//                 control
//               }

//               render={({
//                 field,
//                 fieldState,
//               }) => (

//                 <TextField
//                   select

//                   fullWidth

//                   label="Successor Activity *"

//                   value={
//                     field.value
//                   }

//                   onBlur={
//                     field.onBlur
//                   }

//                   onChange={(
//                     event
//                   ) => {

//                     field.onChange(
//                       Number(
//                         event.target.value
//                       )
//                     );
//                   }}

//                   /*
//                    * No red border or label.
//                    */
//                   error={
//                     false
//                   }

//                   helperText={
//                     fieldState.error
//                       ?.message ??
//                     " "
//                   }

//                   slotProps={{
//                     formHelperText: {
//                       sx:
//                         helperTextSx(
//                           Boolean(
//                             fieldState.error
//                           )
//                         ),
//                     },
//                   }}
//                 >

//                   <MenuItem
//                     value={
//                       0
//                     }

//                     disabled
//                   >
//                     Select successor
//                   </MenuItem>


//                   {activities.map(
//                     (
//                       activity
//                     ) => (

//                       <MenuItem
//                         key={
//                           activity.actId
//                         }

//                         value={
//                           activity.actId
//                         }

//                         /*
//                          * Same activity cannot be
//                          * predecessor and successor.
//                          */
//                         disabled={
//                           activity.actId ===
//                           predecessorActivityId
//                         }
//                       >
//                         {
//                           activity.actCode
//                         }{" "}
//                         —{" "}
//                         {
//                           activity.actName
//                         }
//                       </MenuItem>

//                     )
//                   )}

//                 </TextField>

//               )}
//             />


//             {/* ================================================= */}
//             {/* SELECTED ACTIVITY DATE INFORMATION */}
//             {/* ================================================= */}

//             {predecessorActivity &&
//               successorActivity && (

//               <Box
//                 sx={{
//                   px:
//                     1.5,

//                   py:
//                     1.2,

//                   borderRadius:
//                     2,

//                   backgroundColor:
//                     "#F8FAFC",

//                   border:
//                     "1px solid",

//                   borderColor:
//                     "divider",
//                 }}
//               >

//                 <Typography
//                   sx={{
//                     fontSize:
//                       "0.72rem",

//                     color:
//                       "text.secondary",
//                   }}
//                 >
//                   Predecessor:{" "}
//                   <strong>
//                     {
//                       predecessorActivity.actName
//                     }
//                   </strong>
//                   {" "}(
//                   {
//                     predecessorActivity.startDate
//                   }
//                   {" → "}
//                   {
//                     predecessorActivity.endDate
//                   }
//                   )
//                 </Typography>


//                 <Typography
//                   sx={{
//                     mt:
//                       0.5,

//                     fontSize:
//                       "0.72rem",

//                     color:
//                       "text.secondary",
//                   }}
//                 >
//                   Successor:{" "}
//                   <strong>
//                     {
//                       successorActivity.actName
//                     }
//                   </strong>
//                   {" "}(
//                   {
//                     successorActivity.startDate
//                   }
//                   {" → "}
//                   {
//                     successorActivity.endDate
//                   }
//                   )
//                 </Typography>

//               </Box>

//             )}


//             {/* ================================================= */}
//             {/* DEPENDENCY TYPE */}
//             {/* ================================================= */}

//             <Controller
//               name="dependencyType"

//               control={
//                 control
//               }

//               render={({
//                 field,
//                 fieldState,
//               }) => (

//                 <TextField
//                   {...field}

//                   select

//                   fullWidth

//                   label="Dependency Type *"

//                   /*
//                    * User must select both activities
//                    * before choosing dependency type.
//                    */
//                   disabled={
//                     !predecessorActivity ||
//                     !successorActivity
//                   }

//                   /*
//                    * Keep border and label normal.
//                    */
//                   error={
//                     false
//                   }

//                   helperText={
//                     fieldState.error
//                       ?.message ??
//                     (
//                       !predecessorActivity ||
//                       !successorActivity

//                         ? "Select predecessor and successor activities first"

//                         : allowedDependencyTypes.length ===
//                           0

//                           ? "No dependency type is valid for the selected activity dates"

//                           : "Unavailable dependency types are disabled based on the selected activity dates"
//                     )
//                   }

//                   slotProps={{
//                     formHelperText: {
//                       sx: {
//                         color:
//                           fieldState.error
//                             ? "error.main"
//                             : "text.secondary",

//                         fontSize:
//                           "0.72rem",

//                         mt:
//                           0.5,

//                         ml:
//                           0.2,
//                       },
//                     },
//                   }}
//                 >

//                   {/* ========================================== */}
//                   {/* FS */}
//                   {/* ========================================== */}

//                   <MenuItem
//                     value={
//                       DependencyType.FS
//                     }

//                     disabled={
//                       !allowedDependencyTypes.includes(
//                         DependencyType.FS
//                       )
//                     }
//                   >
//                     FS — Finish to Start
//                   </MenuItem>


//                   {/* ========================================== */}
//                   {/* SS */}
//                   {/* ========================================== */}

//                   <MenuItem
//                     value={
//                       DependencyType.SS
//                     }

//                     disabled={
//                       !allowedDependencyTypes.includes(
//                         DependencyType.SS
//                       )
//                     }
//                   >
//                     SS — Start to Start
//                   </MenuItem>


//                   {/* ========================================== */}
//                   {/* FF */}
//                   {/* ========================================== */}

//                   <MenuItem
//                     value={
//                       DependencyType.FF
//                     }

//                     disabled={
//                       !allowedDependencyTypes.includes(
//                         DependencyType.FF
//                       )
//                     }
//                   >
//                     FF — Finish to Finish
//                   </MenuItem>


//                   {/* ========================================== */}
//                   {/* SF */}
//                   {/* ========================================== */}

//                   <MenuItem
//                     value={
//                       DependencyType.SF
//                     }

//                     disabled={
//                       !allowedDependencyTypes.includes(
//                         DependencyType.SF
//                       )
//                     }
//                   >
//                     SF — Start to Finish
//                   </MenuItem>

//                 </TextField>

//               )}
//             />


//             {/* ================================================= */}
//             {/* DEPENDENCY RULE INFORMATION */}
//             {/* ================================================= */}

//             {predecessorActivity &&
//               successorActivity && (

//               <Box
//                 sx={{
//                   px:
//                     1.5,

//                   py:
//                     1.2,

//                   borderRadius:
//                     2,

//                   backgroundColor:
//                     "#F8FAFC",
//                 }}
//               >

//                 <Typography
//                   sx={{
//                     fontSize:
//                       "0.69rem",

//                     color:
//                       "text.secondary",

//                     lineHeight:
//                       1.7,
//                   }}
//                 >
//                   FS: Predecessor finish must be before
//                   successor start.
//                   <br />

//                   SS: Both activities must start on the
//                   same date.
//                   <br />

//                   FF: Both activities must finish on the
//                   same date.
//                   <br />

//                   SF: Successor cannot finish before the
//                   predecessor has started.
//                 </Typography>

//               </Box>

//             )}

//           </Box>

//         </DialogContent>


//         {/* ================================================== */}
//         {/* ACTIONS */}
//         {/* ================================================== */}

//         <DialogActions
//           sx={{
//             px:
//               3,

//             py:
//               2,

//             borderTop:
//               "1px solid",

//             borderColor:
//               "divider",
//           }}
//         >

//           <Button
//             disabled={
//               loading
//             }

//             onClick={
//               onClose
//             }
//           >
//             Cancel
//           </Button>


//           <PrimaryButton
//             type="submit"

//             loading={
//               loading
//             }

//             disabled={
//               !predecessorActivity ||
//               !successorActivity ||
//               allowedDependencyTypes.length ===
//                 0
//             }
//           >
//             {isEdit
//               ? "Save Changes"
//               : "Add Dependency"}
//           </PrimaryButton>

//         </DialogActions>

//       </Box>

//     </Dialog>
//   );
// }


import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import {
  CloseRounded,
} from "@mui/icons-material";

import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  useEffect,
  useMemo,
} from "react";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  dependencySchema,
  type DependencyFormValues,
} from "../../schemas/dependency.schema";

import {
  DependencyType,
} from "../../enums/dependency.enums";

import {
  searchActivitiesApi,
} from "../../api/activity.api";

import {
  getDependencyDetailsApi,
} from "../../api/dependency.api";

import {
  getAllowedDependencyTypes,
} from "../../utils/dependency.utils";

import PrimaryButton
  from "../buttons/PrimaryButton";


interface DependencyFormDialogProps {
  open:
    boolean;

  loading:
    boolean;

  projectId:
    number;

  dependencyId:
    number | null;

  onClose:
    () => void;

  onSubmit:
    (
      values:
        DependencyFormValues
    ) => void;
}


/*
 * ============================================================
 * VALIDATION MESSAGE STYLE
 * ============================================================
 *
 * Only the validation/helper message becomes red.
 * Field border, label and placeholder remain normal.
 * ============================================================
 */

const helperTextSx = (
  hasError:
    boolean
) => ({
  color:
    hasError
      ? "error.main"
      : "transparent",

  fontSize:
    "0.72rem",

  mt:
    0.5,

  ml:
    0.2,
});


export default function DependencyFormDialog({
  open,
  loading,
  projectId,
  dependencyId,
  onClose,
  onSubmit,
}: DependencyFormDialogProps) {

  const isEdit =
    dependencyId !== null;


  /*
   * ==========================================================
   * FORM
   * ==========================================================
   */

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
  } =
    useForm<DependencyFormValues>({
      resolver:
        zodResolver(
          dependencySchema
        ),

      defaultValues: {
        predecessorActivityId:
          0,

        successorActivityId:
          0,

        dependencyType:
          DependencyType.FS,
      },

      mode:
        "onTouched",
    });


  /*
   * ==========================================================
   * WATCH SELECTED VALUES
   * ==========================================================
   */

  const predecessorActivityId =
    watch(
      "predecessorActivityId"
    );

  const successorActivityId =
    watch(
      "successorActivityId"
    );

  const selectedDependencyType =
    watch(
      "dependencyType"
    );


  /*
   * ==========================================================
   * LOAD PROJECT ACTIVITIES
   * ==========================================================
   */

  const activitiesQuery =
    useQuery({
      queryKey: [
        "dependency-activity-options",
        projectId,
      ],

      queryFn:
        () =>
          searchActivitiesApi({
            projectId,

            page:
              0,

            size:
              500,

            sortBy:
              "actId",

            direction:
              "asc",
          }),

      enabled:
        open &&
        projectId >
          0,
    });


  /*
   * ==========================================================
   * LOAD DEPENDENCY DETAILS FOR EDIT
   * ==========================================================
   */

  const detailsQuery =
    useQuery({
      queryKey: [
        "dependency-details-edit",
        dependencyId,
      ],

      queryFn:
        () =>
          getDependencyDetailsApi({
            dependencyId:
              dependencyId!,
          }),

      enabled:
        open &&
        dependencyId !==
          null,
    });


  /*
   * ==========================================================
   * RESET FORM
   * ==========================================================
   */

  useEffect(
    () => {

      if (
        isEdit &&
        detailsQuery.data
      ) {

        reset({
          predecessorActivityId:
            detailsQuery.data
              .predecessorActivityId,

          successorActivityId:
            detailsQuery.data
              .successorActivityId,

          dependencyType:
            detailsQuery.data
              .dependencyType,
        });

        return;
      }


      if (
        !isEdit &&
        open
      ) {

        reset({
          predecessorActivityId:
            0,

          successorActivityId:
            0,

          dependencyType:
            DependencyType.FS,
        });
      }

    },
    [
      isEdit,
      detailsQuery.data,
      open,
      reset,
    ]
  );


  /*
   * ==========================================================
   * PROJECT ACTIVITIES
   * ==========================================================
   */

  const activities =
    activitiesQuery.data
      ?.content ??
    [];


  /*
   * ==========================================================
   * FIND SELECTED PREDECESSOR
   * ==========================================================
   */

  const predecessorActivity =
    useMemo(
      () =>
        activities.find(
          (
            activity
          ) =>
            activity.actId ===
            predecessorActivityId
        ),
      [
        activities,
        predecessorActivityId,
      ]
    );


  /*
   * ==========================================================
   * FIND SELECTED SUCCESSOR
   * ==========================================================
   */

  const successorActivity =
    useMemo(
      () =>
        activities.find(
          (
            activity
          ) =>
            activity.actId ===
            successorActivityId
        ),
      [
        activities,
        successorActivityId,
      ]
    );


  /*
   * ==========================================================
   * CALCULATE ALLOWED DEPENDENCY TYPES
   * ==========================================================
   *
   * Uses dependency.utils.ts:
   *
   * FS:
   * predecessor.endDate < successor.startDate
   *
   * SS:
   * predecessor.startDate <= successor.startDate
   *
   * FF:
   * predecessor.endDate <= successor.endDate
   *
   * SF:
   * successor.startDate <= predecessor.endDate
   * ==========================================================
   */

  const allowedDependencyTypes =
    useMemo(
      () => {

        if (
          !predecessorActivity ||
          !successorActivity
        ) {
          return [];
        }

        return getAllowedDependencyTypes(
          predecessorActivity,
          successorActivity
        );

      },
      [
        predecessorActivity,
        successorActivity,
      ]
    );


  /*
   * ==========================================================
   * KEEP SELECTED TYPE VALID
   * ==========================================================
   *
   * When the user changes predecessor/successor activities,
   * the previously selected dependency type may no longer
   * be valid.
   *
   * In that situation, select the first valid type.
   * ==========================================================
   */

  useEffect(
    () => {

      if (
        !predecessorActivity ||
        !successorActivity
      ) {
        return;
      }


      if (
        allowedDependencyTypes.length ===
        0
      ) {
        return;
      }


      const currentTypeIsAllowed =
        allowedDependencyTypes.includes(
          selectedDependencyType
        );


      if (
        !currentTypeIsAllowed
      ) {

        setValue(
          "dependencyType",
          allowedDependencyTypes[0],
          {
            shouldValidate:
              true,

            shouldDirty:
              true,
          }
        );
      }

    },
    [
      predecessorActivity,
      successorActivity,
      allowedDependencyTypes,
      selectedDependencyType,
      setValue,
    ]
  );


  /*
   * ==========================================================
   * SUBMIT
   * ==========================================================
   *
   * UI disabled state is not enough.
   *
   * We validate the dependency type again before calling
   * the parent onSubmit function.
   * ==========================================================
   */

  const submitForm = (
    values:
      DependencyFormValues
  ) => {

    if (
      !predecessorActivity ||
      !successorActivity
    ) {

      setError(
        "predecessorActivityId",
        {
          type:
            "manual",

          message:
            "Select a predecessor activity",
        }
      );

      return;
    }


    if (
      !allowedDependencyTypes.includes(
        values.dependencyType
      )
    ) {

      setError(
        "dependencyType",
        {
          type:
            "manual",

          message:
            "Selected dependency type is not valid for the activity dates",
        }
      );

      return;
    }


    onSubmit(
      values
    );
  };


  return (
    <Dialog
      open={
        open
      }

      onClose={
        loading
          ? undefined
          : onClose
      }

      fullWidth

      maxWidth="sm"
    >

      {/* ==================================================== */}
      {/* TITLE */}
      {/* ==================================================== */}

      <DialogTitle
        sx={{
          px:
            3,

          py:
            2.4,

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          borderBottom:
            "1px solid",

          borderColor:
            "divider",
        }}
      >

        <Box>

          <Typography
            sx={{
              fontSize:
                "1.05rem",

              fontWeight:
                750,
            }}
          >
            {isEdit
              ? "Edit Dependency"
              : "Add Dependency"}
          </Typography>


          <Typography
            sx={{
              mt:
                0.25,

              color:
                "text.secondary",

              fontSize:
                "0.72rem",
            }}
          >
            {isEdit
              ? "Update the activity relationship."
              : "Create a relationship between two project activities."}
          </Typography>

        </Box>


        <Button
          onClick={
            onClose
          }

          disabled={
            loading
          }

          sx={{
            minWidth:
              38,

            width:
              38,

            height:
              38,
          }}
        >
          <CloseRounded />
        </Button>

      </DialogTitle>


      {/* ==================================================== */}
      {/* FORM */}
      {/* ==================================================== */}

      <Box
        component="form"

        noValidate

        onSubmit={
          handleSubmit(
            submitForm
          )
        }
      >

        <DialogContent
          sx={{
            p:
              3,
          }}
        >

          {/* ================================================= */}
          {/* ACTIVITY LOAD ERROR */}
          {/* ================================================= */}

          {activitiesQuery.isError && (

            <Typography
              sx={{
                mb:
                  2,

                color:
                  "error.main",

                fontSize:
                  "0.76rem",
              }}
            >
              Unable to load project activities.
            </Typography>

          )}


          {/* ================================================= */}
          {/* FORM FIELDS */}
          {/* ================================================= */}

          <Box
            sx={{
              display:
                "grid",

              gap:
                2.2,
            }}
          >

            {/* ================================================= */}
            {/* PREDECESSOR */}
            {/* ================================================= */}

            <Controller
              name="predecessorActivityId"

              control={
                control
              }

              render={({
                field,
                fieldState,
              }) => (

                <TextField
                  select

                  fullWidth

                  label="Predecessor Activity *"

                  value={
                    field.value
                  }

                  onBlur={
                    field.onBlur
                  }

                  onChange={(
                    event
                  ) => {

                    const value =
                      Number(
                        event.target.value
                      );

                    field.onChange(
                      value
                    );


                    /*
                     * Prevent the same activity from being
                     * selected as predecessor and successor.
                     */

                    if (
                      value ===
                      successorActivityId
                    ) {

                      setValue(
                        "successorActivityId",
                        0,
                        {
                          shouldValidate:
                            true,
                        }
                      );
                    }
                  }}

                  /*
                   * Keep field border and label normal.
                   */

                  error={
                    false
                  }

                  helperText={
                    fieldState.error
                      ?.message ??
                    " "
                  }

                  slotProps={{
                    formHelperText: {
                      sx:
                        helperTextSx(
                          Boolean(
                            fieldState.error
                          )
                        ),
                    },
                  }}
                >

                  <MenuItem
                    value={
                      0
                    }

                    disabled
                  >
                    Select predecessor
                  </MenuItem>


                  {activities.map(
                    (
                      activity
                    ) => (

                      <MenuItem
                        key={
                          activity.actId
                        }

                        value={
                          activity.actId
                        }

                        disabled={
                          activity.actId ===
                          successorActivityId
                        }
                      >
                        {
                          activity.actCode
                        }{" "}
                        —{" "}
                        {
                          activity.actName
                        }
                      </MenuItem>

                    )
                  )}

                </TextField>

              )}
            />


            {/* ================================================= */}
            {/* SUCCESSOR */}
            {/* ================================================= */}

            <Controller
              name="successorActivityId"

              control={
                control
              }

              render={({
                field,
                fieldState,
              }) => (

                <TextField
                  select

                  fullWidth

                  label="Successor Activity *"

                  value={
                    field.value
                  }

                  onBlur={
                    field.onBlur
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

                  /*
                   * Keep field border and label normal.
                   */

                  error={
                    false
                  }

                  helperText={
                    fieldState.error
                      ?.message ??
                    " "
                  }

                  slotProps={{
                    formHelperText: {
                      sx:
                        helperTextSx(
                          Boolean(
                            fieldState.error
                          )
                        ),
                    },
                  }}
                >

                  <MenuItem
                    value={
                      0
                    }

                    disabled
                  >
                    Select successor
                  </MenuItem>


                  {activities.map(
                    (
                      activity
                    ) => (

                      <MenuItem
                        key={
                          activity.actId
                        }

                        value={
                          activity.actId
                        }

                        disabled={
                          activity.actId ===
                          predecessorActivityId
                        }
                      >
                        {
                          activity.actCode
                        }{" "}
                        —{" "}
                        {
                          activity.actName
                        }
                      </MenuItem>

                    )
                  )}

                </TextField>

              )}
            />


            {/* ================================================= */}
            {/* SELECTED ACTIVITY DATES */}
            {/* ================================================= */}

            {predecessorActivity &&
              successorActivity && (

              <Box
                sx={{
                  px:
                    1.5,

                  py:
                    1.2,

                  borderRadius:
                    2,

                  backgroundColor:
                    "#F8FAFC",

                  border:
                    "1px solid",

                  borderColor:
                    "divider",
                }}
              >

                <Typography
                  sx={{
                    fontSize:
                      "0.72rem",

                    color:
                      "text.secondary",
                  }}
                >
                  Predecessor:{" "}
                  <strong>
                    {
                      predecessorActivity.actName
                    }
                  </strong>
                  {" "}(
                  {
                    predecessorActivity.startDate
                  }
                  {" → "}
                  {
                    predecessorActivity.endDate
                  }
                  )
                </Typography>


                <Typography
                  sx={{
                    mt:
                      0.5,

                    fontSize:
                      "0.72rem",

                    color:
                      "text.secondary",
                  }}
                >
                  Successor:{" "}
                  <strong>
                    {
                      successorActivity.actName
                    }
                  </strong>
                  {" "}(
                  {
                    successorActivity.startDate
                  }
                  {" → "}
                  {
                    successorActivity.endDate
                  }
                  )
                </Typography>

              </Box>

            )}


            {/* ================================================= */}
            {/* DEPENDENCY TYPE */}
            {/* ================================================= */}

            <Controller
              name="dependencyType"

              control={
                control
              }

              render={({
                field,
                fieldState,
              }) => (

                <TextField
                  {...field}

                  select

                  fullWidth

                  label="Dependency Type *"

                  /*
                   * User must select both activities first.
                   */

                  disabled={
                    !predecessorActivity ||
                    !successorActivity
                  }

                  /*
                   * Keep border and label normal.
                   */

                  error={
                    false
                  }

                  helperText={
                    fieldState.error
                      ?.message ??
                    (
                      !predecessorActivity ||
                      !successorActivity

                        ? "Select predecessor and successor activities first"

                        : allowedDependencyTypes.length ===
                          0

                          ? "No dependency type is valid for the selected activity dates"

                          : "Unavailable dependency types are disabled based on the selected activity dates"
                    )
                  }

                  slotProps={{
                    formHelperText: {
                      sx: {
                        color:
                          fieldState.error
                            ? "error.main"
                            : "text.secondary",

                        fontSize:
                          "0.72rem",

                        mt:
                          0.5,

                        ml:
                          0.2,
                      },
                    },
                  }}
                >

                  {/* ========================================== */}
                  {/* FS */}
                  {/* ========================================== */}

                  <MenuItem
                    value={
                      DependencyType.FS
                    }

                    disabled={
                      !allowedDependencyTypes.includes(
                        DependencyType.FS
                      )
                    }
                  >
                    FS — Finish to Start
                  </MenuItem>


                  {/* ========================================== */}
                  {/* SS */}
                  {/* ========================================== */}

                  <MenuItem
                    value={
                      DependencyType.SS
                    }

                    disabled={
                      !allowedDependencyTypes.includes(
                        DependencyType.SS
                      )
                    }
                  >
                    SS — Start to Start
                  </MenuItem>


                  {/* ========================================== */}
                  {/* FF */}
                  {/* ========================================== */}

                  <MenuItem
                    value={
                      DependencyType.FF
                    }

                    disabled={
                      !allowedDependencyTypes.includes(
                        DependencyType.FF
                      )
                    }
                  >
                    FF — Finish to Finish
                  </MenuItem>


                  {/* ========================================== */}
                  {/* SF */}
                  {/* ========================================== */}

                  <MenuItem
                    value={
                      DependencyType.SF
                    }

                    disabled={
                      !allowedDependencyTypes.includes(
                        DependencyType.SF
                      )
                    }
                  >
                    SF — Start to Finish
                  </MenuItem>

                </TextField>

              )}
            />


            {/* ================================================= */}
            {/* DEPENDENCY RULE INFORMATION */}
            {/* ================================================= */}

            {predecessorActivity &&
              successorActivity && (

              <Box
                sx={{
                  px:
                    1.5,

                  py:
                    1.2,

                  borderRadius:
                    2,

                  backgroundColor:
                    "#F8FAFC",

                  border:
                    "1px solid",

                  borderColor:
                    "divider",
                }}
              >

                <Typography
                  sx={{
                    fontSize:
                      "0.69rem",

                    color:
                      "text.secondary",

                    lineHeight:
                      1.7,
                  }}
                >

                  FS: Predecessor must finish before
                  successor starts.

                  <br />

                  SS: Successor cannot start before
                  predecessor starts.

                  <br />

                  FF: Successor cannot finish before
                  predecessor finishes.

                  <br />

                  SF: Successor must start before
                  predecessor finishes.

                </Typography>

              </Box>

            )}

          </Box>

        </DialogContent>


        {/* ================================================== */}
        {/* ACTIONS */}
        {/* ================================================== */}

        <DialogActions
          sx={{
            px:
              3,

            py:
              2,

            borderTop:
              "1px solid",

            borderColor:
              "divider",
          }}
        >

          <Button
            disabled={
              loading
            }

            onClick={
              onClose
            }
          >
            Cancel
          </Button>


          <PrimaryButton
            type="submit"

            loading={
              loading
            }

            disabled={
              !predecessorActivity ||
              !successorActivity ||
              allowedDependencyTypes.length ===
                0
            }
          >
            {isEdit
              ? "Save Changes"
              : "Add Dependency"}
          </PrimaryButton>

        </DialogActions>

      </Box>

    </Dialog>
  );
}