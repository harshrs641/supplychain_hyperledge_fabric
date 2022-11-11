export enum GoldStatus {
    "verified_gold_placed" = "verified_gold_placed",
    "verified_gold_assigned" = "verified_gold_assigned",
    "verified_gold_started" = "verified_gold_started",
    "verified_gold_reached" = "verified_gold_reached",
    "verified_gold_melted" = "verified_gold_melted",
    "verified_gold_verified" = "verified_gold_verified",
    "verified_gold_submitted" = "verified_gold_submitted",
    "verified_gold_checked" = "verified_gold_checked",
    "verified_gold_ready" = "verified_gold_ready",
    "verified_gold_refined" = "verified_gold_refined",
    "verified_gold_cancelled" = "verified_gold_cancelled",

    "refined_gold_started" = "refined_gold_started",
    "refined_gold_refined" = "refined_gold_refined",
    "refined_gold_submitted" = "refined_gold_submitted",

    "box_gold_checked" = "box_gold_checked",
    "box_gold_packed" = "box_gold_packed",
    "box_gold_shipped" = "box_gold_shipped",
    "box_gold_delivered" = "box_gold_delivered",
    "box_gold_assigned" = "box_gold_assigned",

    "final_gold_inactive" = "final_gold_inactive",
    "final_gold_added" = "final_gold_added",
    "final_gold_checked" = "final_gold_checked",
    "final_gold_ready" = "final_gold_ready",
    "final_gold_completed" = "final_gold_completed",
}
// verifiedGold
//     status: {
//       type: String,
//       enum: [
//         'placed',
//         'assigned',
//         'started',
//         'reached',
//         'melted',
//         'verified',
//         'submitted',
//         'checked',
//         'ready',
//         'refined',
//         'cancelled',
//       ],
//     }

/// refined gold

//     status: {
//       type: String,
//       enum: ['started', 'refined', 'submitted', 'checked'],
//       default: 'started',
//     },

/// goldbox
//     status: {
//       type: String,
//       enum: ['packed', 'shipped', 'delivered', 'assigned', 'checked'],
//       default: 'packed',
//     },

/// gold
// status: {
    //       type: String,
    //       enum: ['inactive', 'added', 'checked', 'ready', 'completed'],
    //     },