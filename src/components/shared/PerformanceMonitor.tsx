import React, { useState, useEffect } from 'react';
import { ChartBarIcon, ClockIcon, BoltIcon } from '@heroicons/react/24/outline';

interface PerformanceMetrics {
     fcp: number | null; // First Contentful Paint
     lcp: number | null; // Largest Contentful Paint
     cls: number | null; // Cumulative Layout Shift
     ttfb: number | null; // Time to First Byte
     loadTime: number | null;
}

const PerformanceMonitor: React.FC<{ showDetails?: boolean }> = ({ showDetails = false }) => {
     const [metrics, setMetrics] = useState<PerformanceMetrics>({
          fcp: null,
          lcp: null,
          cls: null,
          ttfb: null,
          loadTime: null,
     });
     const [isVisible, setIsVisible] = useState(false);

     useEffect(() => {
          // Only show in development or when explicitly enabled
          const shouldShow = import.meta.env.DEV ||
               import.meta.env.VITE_SHOW_PERFORMANCE_MONITOR === 'true';
          setIsVisible(shouldShow && showDetails);

          if (!shouldShow) return;

          // Measure basic performance metrics
          const measurePerformance = () => {
               if ('performance' in window) {
                    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

                    setMetrics(prev => ({
                         ...prev,
                         loadTime: navigation.loadEventEnd - navigation.fetchStart,
                         ttfb: navigation.responseStart - navigation.fetchStart,
                    }));
               }
          };

          // Measure Core Web Vitals
          const measureWebVitals = async () => {
               try {
                    const { onCLS, onFCP, onLCP, onTTFB } = await import('web-vitals');

                    onFCP((metric: any) => {
                         setMetrics(prev => ({ ...prev, fcp: metric.value }));
                    });

                    onLCP((metric: any) => {
                         setMetrics(prev => ({ ...prev, lcp: metric.value }));
                    });

                    onCLS((metric: any) => {
                         setMetrics(prev => ({ ...prev, cls: metric.value }));
                    });

                    onTTFB((metric: any) => {
                         setMetrics(prev => ({ ...prev, ttfb: metric.value }));
                    });
               } catch (error) {
                    console.warn('Web Vitals not available:', error);
               }
          };

          measurePerformance();
          measureWebVitals();
     }, [showDetails]);

     const getScoreColor = (value: number | null, thresholds: [number, number]) => {
          if (value === null) return 'text-gray-400';
          if (value <= thresholds[0]) return 'text-green-600';
          if (value <= thresholds[1]) return 'text-yellow-600';
          return 'text-red-600';
     };

     const formatTime = (ms: number | null) => {
          if (ms === null) return 'N/A';
          return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}s`;
     };

     if (!isVisible) return null;

     return (
          <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50 max-w-sm">
               <div className="flex items-center gap-2 mb-3">
                    <ChartBarIcon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-sm">Performance Monitor</h3>
               </div>

               <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                         <span className="flex items-center gap-1">
                              <BoltIcon className="h-3 w-3" />
                              FCP:
                         </span>
                         <span className={getScoreColor(metrics.fcp, [1800, 3000])}>
                              {formatTime(metrics.fcp)}
                         </span>
                    </div>

                    <div className="flex justify-between items-center">
                         <span className="flex items-center gap-1">
                              <BoltIcon className="h-3 w-3" />
                              LCP:
                         </span>
                         <span className={getScoreColor(metrics.lcp, [2500, 4000])}>
                              {formatTime(metrics.lcp)}
                         </span>
                    </div>

                    <div className="flex justify-between items-center">
                         <span className="flex items-center gap-1">
                              <ChartBarIcon className="h-3 w-3" />
                              CLS:
                         </span>
                         <span className={getScoreColor(metrics.cls ? metrics.cls * 1000 : null, [100, 250])}>
                              {metrics.cls !== null ? metrics.cls.toFixed(3) : 'N/A'}
                         </span>
                    </div>

                    <div className="flex justify-between items-center">
                         <span className="flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              TTFB:
                         </span>
                         <span className={getScoreColor(metrics.ttfb, [800, 1800])}>
                              {formatTime(metrics.ttfb)}
                         </span>
                    </div>

                    <div className="flex justify-between items-center">
                         <span className="flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              Load:
                         </span>
                         <span className={getScoreColor(metrics.loadTime, [2000, 4000])}>
                              {formatTime(metrics.loadTime)}
                         </span>
                    </div>
               </div>

               <div className="mt-3 pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                         <span className="text-green-600">●</span> Good
                         <span className="text-yellow-600 ml-2">●</span> Needs Improvement
                         <span className="text-red-600 ml-2">●</span> Poor
                    </div>
               </div>
          </div>
     );
};

export default PerformanceMonitor; 