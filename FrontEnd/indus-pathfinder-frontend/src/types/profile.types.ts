// export interface ProfileResponse {
//   userId: number;
//   orgId: number | null;

//   firstName: string;
//   lastName: string;
//   userName: string;
//   email: string;

//   mobile: number | string | null;

//   role: string;
//   status: string;

//   orgName: string | null;
//   orgEmail: string | null;
//   orgPhone: number | string | null;
//   city: string | null;
//   state: string | null;
//   website: string | null;
// }

export interface ProfileResponse {
  userId: number;

  firstName: string;

  lastName: string;

  userName: string;

  email: string;

  mobile: string;

  role: string;

  status: string;

  orgName: string;

  orgEmail: string;

  orgPhone: string;

  city: string;

  state: string;

  website: string;
}

// export interface ProfileRequest {
//   firstName: string;

//   lastName: string;

//   userName: string;

//   email: string;
// }

export interface ProfileRequest {
  firstName: string;
  lastName: string;
  mobile: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;

  newPassword: string;

  confirmPassword: string;
}
