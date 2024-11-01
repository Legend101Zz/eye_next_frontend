/// Will need to implement it once we set the payment gate way

/**
 * Designer Analytics Hook
 * @module application/hooks/designer/useDesignerAnalytics
 *
 * @description
 * Hook for managing designer analytics and performance metrics.
 * Provides comprehensive analytics including sales, revenue, and engagement metrics.
 *
 * Dependencies:
 * - DesignerAnalyticsDto from application layer
 * - IDesignerService from domain layer
 */

import { useState, useCallback, useEffect } from "react";
import { IDesignerService } from "@/domain/ports/services/IDesignerService";
import {
  DesignerAnalyticsDto,
  DesignerAnalyticsRequestDto,
  SalesReport,
  PerformanceMetrics,
} from "@/application/dtos/designer";
import { ValidationError } from "@/domain/common/errors";
import { toast } from "@/components/ui/use-toast";

interface AnalyticsTimeRange {
  start: Date;
  end: Date;
}

export interface UseDesignerAnalyticsReturn {
  /** Analytics data */
  analytics: DesignerAnalyticsDto | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Fetch analytics for time range */
  fetchAnalytics: (timeRange: AnalyticsTimeRange) => Promise<void>;
  /** Get sales report */
  getSalesReport: (timeRange: AnalyticsTimeRange) => Promise<SalesReport>;
  /** Get performance metrics */
  getPerformanceMetrics: () => Promise<PerformanceMetrics>;
  /** Export analytics data */
  exportAnalytics: (format: "csv" | "pdf") => Promise<boolean>;
}

/**
 * Hook for managing designer analytics
 *
 * @param designerService - Instance of IDesignerService
 * @param designerId - ID of the designer
 * @returns Analytics functionality and state
 */
export const useDesignerAnalytics = (
  designerService: IDesignerService,
  designerId: string,
): UseDesignerAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<DesignerAnalyticsDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch analytics handler
  const fetchAnalytics = useCallback(
    async (timeRange: AnalyticsTimeRange): Promise<void> => {
      try {
        setIsLoading(true);

        const request: DesignerAnalyticsRequestDto = {
          timeRange: {
            start: timeRange.start.getTime(),
            end: timeRange.end.getTime(),
          },
          metrics: ["revenue", "orders", "views", "conversions", "engagement"],
          groupBy: "day",
        };

        const response = await designerService.getAnalytics(
          designerId,
          request,
        );
        setAnalytics(response);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load analytics"),
        );
        toast({
          title: "Analytics Error",
          description: "Could not load analytics data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [designerId, designerService],
  );

  // Get sales report handler
  const getSalesReport = useCallback(
    async (timeRange: AnalyticsTimeRange): Promise<SalesReport> => {
      try {
        setIsLoading(true);
        const report = await designerService.getSalesReport(designerId, {
          timeRange: {
            start: timeRange.start.getTime(),
            end: timeRange.end.getTime(),
          },
        });
        return report;
      } catch (err) {
        toast({
          title: "Report Error",
          description: "Could not generate sales report",
          variant: "destructive",
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [designerId, designerService],
  );

  // Get performance metrics handler
  const getPerformanceMetrics =
    useCallback(async (): Promise<PerformanceMetrics> => {
      try {
        setIsLoading(true);
        return await designerService.getPerformanceMetrics(designerId);
      } catch (err) {
        toast({
          title: "Metrics Error",
          description: "Could not load performance metrics",
          variant: "destructive",
        });
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, [designerId, designerService]);

  // Export analytics handler
  const exportAnalytics = useCallback(
    async (format: "csv" | "pdf"): Promise<boolean> => {
      try {
        setIsLoading(true);

        if (!analytics) {
          throw new Error("No analytics data to export");
        }

        await designerService.exportAnalytics(designerId, analytics, format);

        toast({
          title: "Export Complete",
          description: `Analytics exported as ${format.toUpperCase()}`,
        });

        return true;
      } catch (err) {
        toast({
          title: "Export Failed",
          description: "Could not export analytics data",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [analytics, designerId, designerService],
  );

  return {
    analytics,
    isLoading,
    error,
    fetchAnalytics,
    getSalesReport,
    getPerformanceMetrics,
    exportAnalytics,
  };
};
