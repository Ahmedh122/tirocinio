import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface CustomScrollbarProps {
  children: React.ReactNode;
  height?: number | string;
  bgColor?: string;
  thumbColor?: string;
  hoverThumbColor?: string;
  dependency?: unknown; // can be any changing prop
}

export const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  children,
  height,
  bgColor = "#475569",
  thumbColor = "#334155",
  hoverThumbColor = "#94a3b8",
  dependency, // <- new
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(40);

  const [isOverflowing, setIsOverflowing] = useState(false);

  const updateThumbHeight = () => {
    const el = scrollRef.current;
    if (!el) return;
    const visibleRatio = el.clientHeight / el.scrollHeight;
    setIsOverflowing(el.scrollHeight > el.clientHeight);
    setThumbHeight(visibleRatio * el.clientHeight);
  };

 

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight);
    const newThumbTop = ratio * (el.clientHeight - thumbHeight);
    setThumbTop(newThumbTop);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateThumbHeight();
    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateThumbHeight);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateThumbHeight);
    };
  }, [thumbHeight]);

  // 👇 Recalculate when dependency changes
  useEffect(() => {
    updateThumbHeight();
  }, [dependency]);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box
        ref={scrollRef}
        sx={{
          backgroundColor: bgColor,
          color: "white",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          maxHeight: height,
          overflowY: "scroll",
          transition: "all 1s ease",
          mr: "12px",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {children}
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "8px",
          height: "100%",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: `${thumbTop}px`,
            right: 0,
            width: "8px",
            height: `${thumbHeight}px`,
            backgroundColor: isOverflowing ? thumbColor : "transparent",
            borderRadius: "8px",
            transition: "top 0.1s, background-color 0.3s ease",
            pointerEvents: "auto",
            "&:hover": {
              backgroundColor: isOverflowing ? hoverThumbColor : "transparent",
            },
          }}
        />
      </Box>
    </Box>
  );
};
