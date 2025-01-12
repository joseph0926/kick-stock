import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../hooks/use-media-query";

const ASPECT_RATIO = 2.5;
const MARGIN = { top: 20, right: 30, left: 30, bottom: 20 };

export const useChartDimensions = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const calculateDimensions = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;

    const chartWidth = containerWidth - MARGIN.left - MARGIN.right;

    let baseHeight = chartWidth / ASPECT_RATIO;

    const minHeight = isMobile ? 350 : isTablet ? 400 : 450;
    baseHeight = Math.max(baseHeight, minHeight);

    const totalHeight = baseHeight + MARGIN.top + MARGIN.bottom;

    setDimensions({
      width: containerWidth,
      height: totalHeight,
    });
  }, [isMobile, isTablet]);

  useEffect(() => {
    calculateDimensions();

    const resizeObserver = new ResizeObserver(calculateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateDimensions]);

  return { containerRef, ...dimensions };
};
