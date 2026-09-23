
// -----------------------------------------------------------------------------

/*
 * ============================================================
 * VALIDATION UTILS
 * ============================================================
 */

/*
 * ============================================================
 * REGEX
 * ============================================================
 */

/*
 * Name
 *
 * Allows:
 * Manoj
 * Manoj Kumar
 * John Doe
 *
 * Does not allow:
 * Manoj123
 * Manoj@
 */
export const NAME_REGEX =
  /^[A-Za-z]+$/;


/*
 * Organization name
 *
 * Allows letters, numbers and common organization characters.
 */



/*
 * Indian mobile number
 *
 * Must:
 * - contain exactly 10 digits
 * - start with 6, 7, 8 or 9
 */
export const INDIAN_MOBILE_REGEX =
  /^[6-9][0-9]{9}$/;


/*
 * Indian PIN code
 *
 * Exactly 6 digits.
 * First digit cannot be zero.
 */
export const INDIAN_PIN_REGEX =
  /^[1-9][0-9]{5}$/;


/*
 * ============================================================
 * CIN
 * ============================================================
 *
 * Format:
 *
 * L12345MH2020PLC123456
 *
 * 1       = L / U
 * 2-6     = Numbers
 * 7-8     = Letters
 * 9-12    = Numbers
 * 13-15   = PLC / PTC / etc. depending on company type
 * 16-21   = Numbers
 *
 * Based on your requested rule:
 *
 * 13-15 = PLC
 */
// export const CIN_REGEX =
//   /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}PLC[0-9]{6}$/;

export const CIN_REGEX =
  /^[LU][0-9]{5}[A-Z]{2}[0-9]{4}PLC[0-9]{6}$/;
/*
 * ============================================================
 * PAN
 * ============================================================
 *
 * Format:
 *
 * ABCDE1234F
 *
 * 1-5  = Letters
 * 6-9  = Numbers
 * 10   = Letter
 */
export const PAN_REGEX =
  /^[A-Z]{5}[0-9]{4}[A-Z]$/;


/*
 * ============================================================
 * GSTIN
 * ============================================================
 *
 * Format:
 *
 * 22ABCDE1234F1Z5
 *
 * 1-2   = Numbers
 * 3-7   = Letters
 * 8-11  = Numbers
 * 12    = Letter
 * 13    = Number / Letter
 * 14    = Z
 * 15    = Number / Letter
 */
export const GST_REGEX =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/;



/*
 * ============================================================
 * REGISTRATION NUMBER
 * ============================================================
 *
 * Rules:
 *
 * - First character must be a number
 * - Remaining characters can be numbers or letters
 * - Letters are converted to uppercase in the form
 */
export const REGISTRATION_NUMBER_REGEX =
  /^[0-9][0-9A-Z]*$/;


/*
 * ============================================================
 * INPUT FILTERS
 * ============================================================
 *
 * These functions only control what the user can type.
 *
 * IMPORTANT:
 *
 * They do NOT generate validation messages.
 *
 * Zod is responsible for validation messages.
 */


/*
 * ============================================================
 * NAME INPUT
 * ============================================================
 */



/*
 * ============================================================
 * ORGANIZATION NAME INPUT
 * ============================================================
 */
export const allowOrganizationName = (
  value: string
): boolean => {
  if (value === "") {
    return true;
  }

  if (value.length > 100) {
    return false;
  }

  // No consecutive spaces
  if (/\s{2,}/.test(value)) {
    return false;
  }

  // No leading space
  if (/^\s/.test(value)) {
    return false;
  }

  // Letters, numbers, allowed special characters and single spaces only
  return /^[A-Za-z0-9&.,'()\-\/ ]*$/.test(value);
};


/*
 * ============================================================
 * EMAIL INPUT
 * ============================================================
 */



/*
 * ============================================================
 * NUMBERS ONLY
 * ============================================================
 */
export const allowNumbersOnly = (
  value: string
): boolean => {
  if (value === "") {
    return true;
  }

  return /^[0-9]*$/.test(value);
};


/*
 * ============================================================
 * CIN INPUT
 * ============================================================
 *
 * Allows:
 *
 * L
 * L1
 * L12345
 * L12345MH
 * L12345MH2020
 * ...
 *
 * Input is converted to uppercase separately.
 */
export const allowCinInput = (
  value: string
): boolean => {
  if (value === "") {
    return true;
  }

  if (value.length > 21) {
    return false;
  }

  // No spaces
  if (/\s/.test(value)) {
    return false;
  }

  // Allow letters and numbers only.
  // Position validation is handled by Zod.
  return /^[A-Za-z0-9]*$/.test(value);
};


/*
 * ============================================================
 * PAN INPUT
 * ============================================================
 */
export const allowPanInput = (
  value: string
): boolean => {
  if (value === "") {
    return true;
  }

  // Maximum 10 characters
  if (value.length > 10) {
    return false;
  }

  // No spaces or any whitespace
  if (/\s/.test(value)) {
    return false;
  }

  // Letters and numbers only
  // This automatically blocks emojis and special characters
  return /^[A-Za-z0-9]*$/.test(value);
};


/*
 * ============================================================
 * GST INPUT
 * ============================================================
 */
export const allowGstInput = (
  value: string
): boolean => {
  if (value === "") {
    return true;
  }

  if (value.length > 15) {
    return false;
  }

  // No spaces or whitespace
  if (/\s/.test(value)) {
    return false;
  }

  // Only letters and numbers
  // Emojis and special characters are rejected
  return /^[A-Za-z0-9]*$/.test(value);
};


/*
 * ============================================================
 * REGISTRATION NUMBER INPUT
 * ============================================================
 */
export const allowRegistrationNumberInput = (
  value: string
): boolean => {
  if (value === "") {
    return true;
  }

  if (value.length > 30) {
    return false;
  }

  /*
   * First character must be number.
   */
  if (!/^[0-9]/.test(value)) {
    return false;
  }

  /*
   * Remaining characters:
   * numbers or uppercase letters.
   */
  return REGISTRATION_NUMBER_REGEX.test(
    value.toUpperCase()
  );
};


/*
 * ============================================================
 * USERNAME INPUT
 * ============================================================
 */



/*
 * ============================================================
 * WEBSITE INPUT
 * ============================================================
 */
export const allowWebsiteInput = (
  value: string
): boolean => {
  if (value === "") {
    return true;
  }

  if (value.length > 200) {
    return false;
  }

  return !/\s/.test(value);
};




// /*
//  * ============================================================
//  * ADDRESS INPUT
//  * ============================================================


export const ADDRESS_REGEX =
  /^[A-Za-z0-9.,/#'()&+\-]+(?: [A-Za-z0-9.,/#'()&+\-]+)*$/;

// export const allowAddressInput = (
//   value: string
// ): boolean => {
//   if (value === "") {
//     return true;
//   }

//   if (value.length > 30) {
//     return false;
//   }

//   // No leading or trailing space
//   if (value.startsWith(" ") || value.endsWith(" ")) {
//     return false;
//   }

//   // No consecutive spaces
//   if (value.includes("  ")) {
//     return false;
//   }

//   // Letters, numbers, allowed special characters,
//   // and only one space between words.
//   return ADDRESS_REGEX.test(value);
// };



export const allowAddressInput = (
  value: string
): boolean => {

  if (value === "") {
    return true;
  }

  // Do not allow the very first character to be a space
  if (value.startsWith(" ")) {
    return false;
  }

  // Do not allow two consecutive normal spaces
  if (value.includes("  ")) {
    return false;
  }

  /*
   * Allow:
   * letters
   * numbers
   * spaces
   * common address symbols
   * line breaks
   *
   * Block:
   * emoji
   * unsupported unicode symbols
   */
  return /^[A-Za-z0-9\s,./#()&:'"-]*$/.test(value);
};


/*
 * ============================================================
 * LOGO INPUT
 * ============================================================
 */
export const allowLogoInput = (
  value: string
): boolean => {
  if (value === "") {
    return true;
  }

  return value.length <= 250;
};


/*
 * ============================================================
 * UPPERCASE + NO SPACES
 * ============================================================
 */
export const upperCaseNoSpaces = (
  value: string
): string => {
  return value
    .toUpperCase()
    .replace(/\s/g, "");
};


/*
 * ============================================================
 * PASSWORD
 * ============================================================
 */
export const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])\S{6,50}$/;


export const allowPasswordInput = (
  value: string
): boolean => {
  if (value === "") {
    return true;
  }

  if (value.length > 50) {
    return false;
  }

  return !/\s/.test(value);
};


/*
 * ============================================================
 * OTP
 * ============================================================
 */
export const allowOtpInput = (
  value: string
): boolean => {
  if (value === "") {
    return true;
  }

  return /^[0-9]*$/.test(value);
};




export const USERNAME_REGEX =
  /^[A-Za-z0-9._@-]+$/;

export const allowUsernameInput = (
  value: string
): boolean => {
  if (value === "") {
    return true;
  }

  if (value.length > 50) {
    return false;
  }

  // No spaces
  if (/\s/.test(value)) {
    return false;
  }

  // Allow letters, numbers and selected special characters only
  // No emojis or other special characters
  return /^[A-Za-z0-9._@+-]*$/.test(value);
};



export const ORGANIZATION_NAME_REGEX =
  /^[A-Za-z0-9&.,'()\/-]+(?: [A-Za-z0-9&.,'()\/-]+)*$/;



export const EMAIL_REGEX =
  /^[a-z0-9]+(?:[._%+-][a-z0-9]+)*@[a-z0-9-]+(?:\.[a-z]{2,})+$/;

// export const allowEmailInput = (
//   value: string
// ): boolean => {
//   if (value === "") {
//     return true;
//   }

//   if (value.length > 100) {
//     return false;
//   }

//   if (/\s/.test(value)) {
//     return false;
//   }

//   return /^[a-z0-9._%+\-@]*$/.test(value);
// };

// export const allowEmailInput = (
//   value: string
// ): boolean => {

//   /*
//    * Allowed:
//    * A-Z
//    * a-z
//    * 0-9
//    * @
//    * .
//    * _
//    * -
//    * +
//    *
//    * Not allowed:
//    * spaces
//    * emoji
//    * other special characters
//    */

//   return /^[A-Za-z0-9@._+-]*$/.test(
//     value
//   );
// };


export const allowEmailInput = (
  value: string
): boolean => {
  return /^[A-Za-z0-9@._+-]*$/.test(value);
};


export const DISTRICT_REGEX =
  /^[A-Za-z]+(?: [A-Za-z]+)*$/;

export const allowDistrictInput = (
  value: string
): boolean => {
  if (value === "") {
    return true;
  }

  if (value.length > 60) {
    return false;
  }

  // Only letters and a single space
  if (!/^[A-Za-z ]*$/.test(value)) {
    return false;
  }

  // No leading space
  if (value.startsWith(" ")) {
    return false;
  }

  // No consecutive spaces
  if (value.includes("  ")) {
    return false;
  }

  return true;
};



export const FIRST_NAME_REGEX =
  /^[A-Za-z]+(?: [A-Za-z]+)*$/;
//   export const allowNameInput = (
//   value: string
// ): boolean => {
//   if (value === "") {
//     return true;
//   }

//   if (value.length > 50) {
//     return false;
//   }

//   // Allow letters and ONE space between words
//   return /^[A-Za-z]+(?: [A-Za-z]*)*$/.test(value);
// };


export const allowNameInput = (
  value: string
): boolean => {

  if (value === "") {
    return true;
  }

  /*
   * No leading space.
   */
  if (value.startsWith(" ")) {
    return false;
  }

  /*
   * No consecutive spaces.
   */
  if (value.includes("  ")) {
    return false;
  }

  /*
   * Only English letters
   * and normal spaces.
   */
  return /^[A-Za-z ]*$/.test(
    value
  );
};


export const LAST_NAME_REGEX =
  /^[A-Za-z]+(?: [A-Za-z]+)*$/;


  export const allowProjectNameInput = (
  value: string
): boolean => {

  if (value === "") {
    return true;
  }

  // No leading space
  if (value.startsWith(" ")) {
    return false;
  }

  // No consecutive spaces
  if (value.includes("  ")) {
    return false;
  }

  /*
   * Allowed:
   * A-Z a-z
   * 0-9
   * single spaces
   * - _ / . , & ( ) # ' :
   *
   * Emoji are not allowed.
   */
  return /^[A-Za-z0-9 _/.,&()#':-]*$/.test(
    value
  );
};


export const allowProjectDescriptionInput = (
  value: string
): boolean => {

  // Empty is allowed because Description is optional
  if (value === "") {
    return true;
  }

  // No leading space
  if (value.startsWith(" ")) {
    return false;
  }

  // No consecutive spaces
  if (value.includes("  ")) {
    return false;
  }

  // No emoji / unwanted characters
  return /^[A-Za-z0-9 _/.,&()#':;"!?@%+\-\r\n]*$/.test(
    value
  );
};

export const allowPersonNameInput = (
  value: string
): boolean => {

  if (value === "") {
    return true;
  }

  // No leading space
  if (value.startsWith(" ")) {
    return false;
  }

  // No consecutive spaces
  if (value.includes("  ")) {
    return false;
  }

  // Only letters and single spaces
  return /^[A-Za-z ]*$/.test(
    value
  );
};


export const allowMobileInput = (
  value: string
): boolean => {

  // Only digits.
  // Spaces, letters, special
  // characters and emoji blocked.
  return /^[0-9]*$/.test(
    value
  );
};