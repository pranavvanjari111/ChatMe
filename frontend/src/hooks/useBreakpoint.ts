import { useEffect, useState } from "react";

type Breakpoint = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

const getBreakpoint = (): Breakpoint => {
  if (typeof window === "undefined") {
    return { isMobile: false, isTablet: false, isDesktop: true };
  }

  const w = window.innerWidth;

  return {
    isMobile: w < 768,
    isTablet: w >= 768 && w < 1200,
    isDesktop: w >= 1200,
  };
};

const useBreakpoint = (): Breakpoint => {
  const [bp, setBp] = useState<Breakpoint>(getBreakpoint());

  useEffect(() => {
    const onResize = () => setBp(getBreakpoint());

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return bp;
};

export default useBreakpoint;
