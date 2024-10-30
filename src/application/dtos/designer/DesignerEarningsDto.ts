/**
 * Designer Earnings Data Transfer Objects (DTOs)
 * Handle designer earnings and payout data
 *
 * @module designer/dtos
 */

import { PayoutMethod } from "./types";

/**
 * Designer earnings response DTO
 */
export interface DesignerEarningsDto {
  /** Designer ID */
  designerId: string;
  /** Overview */
  overview: {
    /** Total earnings */
    totalEarnings: number;
    /** Available for payout */
    availableForPayout: number;
    /** Pending clearance */
    pendingClearance: number;
    /** Processing payouts */
    processing: number;
    /** Last payout amount */
    lastPayout?: number;
    /** Next payout date */
    nextPayoutDate?: number;
  };
}
