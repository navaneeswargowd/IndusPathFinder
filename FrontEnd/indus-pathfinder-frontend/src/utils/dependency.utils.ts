// import {
//   DependencyType,
// } from "../enums/dependency.enums";

// interface ActivityDates {
//   startDate: string;
//   endDate: string;
// }

// export function getAllowedDependencyTypes(
//   predecessor: ActivityDates,
//   successor: ActivityDates
// ): DependencyType[] {
//   const allowedTypes:
//     DependencyType[] = [];

//   /*
//    * FS — FINISH TO START
//    *
//    * Successor cannot start until
//    * predecessor has finished.
//    *
//    * Your rule:
//    * predecessor end must be BEFORE
//    * successor start.
//    */
//   if (
//     predecessor.endDate <
//     successor.startDate
//   ) {
//     allowedTypes.push(
//       DependencyType.FS
//     );
//   }

//   /*
//    * SS — START TO START
//    *
//    * Your rule:
//    * Both activities must have
//    * the same start date.
//    */
//   if (
//     predecessor.startDate ===
//     successor.startDate
//   ) {
//     allowedTypes.push(
//       DependencyType.SS
//     );
//   }

//   /*
//    * FF — FINISH TO FINISH
//    *
//    * Your rule:
//    * Both activities must have
//    * the same end date.
//    */
//   if (
//     predecessor.endDate ===
//     successor.endDate
//   ) {
//     allowedTypes.push(
//       DependencyType.FF
//     );
//   }

//   /*
//    * SF — START TO FINISH
//    *
//    * Successor cannot finish until
//    * predecessor has started.
//    *
//    * successor end >= predecessor start
//    */
//   if (
//     successor.endDate >=
//     predecessor.startDate
//   ) {
//     allowedTypes.push(
//       DependencyType.SF
//     );
//   }

//   return allowedTypes;
// }




import {
  DependencyType,
} from "../enums/dependency.enums";


interface ActivityDates {
  startDate: string;
  endDate: string;
}


/*
 * ============================================================
 * CHECK ALLOWED DEPENDENCY TYPES
 * ============================================================
 *
 * FS - Finish to Start
 * Predecessor must finish before successor starts.
 *
 * SS - Start to Start
 * Successor cannot start before predecessor starts.
 *
 * FF - Finish to Finish
 * Successor cannot finish before predecessor finishes.
 *
 * SF - Start to Finish
 * Successor must start before predecessor finishes.
 * ============================================================
 */

export function getAllowedDependencyTypes(
  predecessor: ActivityDates,
  successor: ActivityDates
): DependencyType[] {

  const allowedTypes:
    DependencyType[] = [];


  /*
   * ==========================================================
   * FINISH TO START (FS)
   *
   * Predecessor:
   * 01-10 → 05-10
   *
   * Successor:
   * 06-10 → 10-10
   *
   * Valid because predecessor finishes BEFORE
   * successor starts.
   * ==========================================================
   */

  if (
    predecessor.endDate <
    successor.startDate
  ) {

    allowedTypes.push(
      DependencyType.FS
    );
  }


  /*
   * ==========================================================
   * START TO START (SS)
   *
   * Successor cannot start before predecessor starts.
   *
   * Therefore:
   *
   * predecessor.start <= successor.start
   *
   * Example:
   *
   * Predecessor: 01-10 → 05-10
   * Successor:   03-10 → 08-10
   *
   * SS is valid.
   * ==========================================================
   */

  if (
    predecessor.startDate <=
    successor.startDate
  ) {

    allowedTypes.push(
      DependencyType.SS
    );
  }


  /*
   * ==========================================================
   * FINISH TO FINISH (FF)
   *
   * Successor cannot finish before predecessor finishes.
   *
   * Therefore:
   *
   * predecessor.end <= successor.end
   *
   * Example:
   *
   * Predecessor: 01-10 → 05-10
   * Successor:   03-10 → 08-10
   *
   * FF is valid.
   * ==========================================================
   */

  if (
    predecessor.endDate <=
    successor.endDate
  ) {

    allowedTypes.push(
      DependencyType.FF
    );
  }


  /*
   * ==========================================================
   * START TO FINISH (SF)
   *
   * The predecessor cannot finish until
   * the successor has started.
   *
   * Therefore:
   *
   * successor.start <= predecessor.end
   *
   * Example:
   *
   * Predecessor: 05-10 → 10-10
   * Successor:   01-10 → 08-10
   *
   * Successor starts before predecessor finishes.
   *
   * Therefore SF is valid.
   * ==========================================================
   */

  if (
    successor.startDate <=
    predecessor.endDate
  ) {

    allowedTypes.push(
      DependencyType.SF
    );
  }


  return allowedTypes;
}