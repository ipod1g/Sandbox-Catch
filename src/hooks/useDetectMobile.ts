import { useEffect, useState } from "react";

export default function useDetectMobile() {
  const [isMobile, setMobile] = useState<boolean | undefined>(undefined);
  const detectMobile = () => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    );
    setMobile(mobile);
  };

  useEffect(() => {
    detectMobile();

    window.addEventListener("resize", detectMobile);

    return () => {
      window.removeEventListener("resize", detectMobile);
    };
  }, []);

  return { isMobile };
}
