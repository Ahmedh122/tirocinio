import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface CustomScrollbarProps {
  children: React.ReactNode;
  height?: number | string;
  width?: number | string;
  marginLeft?: number | string;
  bgColor?: string;
  thumbColor?: string;
  hoverThumbColor?: string;
  dependency?: unknown;
}

export const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  children,
  height,
  width,
  marginLeft,
  //bgColor = "#475569",
  thumbColor = "#334155",
  hoverThumbColor = "#94a3b8",
  dependency,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startTop, setStartTop] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const updateThumbHeight = () => {
    const el = scrollRef.current;
    if (!el) return;
    const visibleRatio = el.clientHeight / el.scrollHeight;
    setIsOverflowing(el.scrollHeight > el.clientHeight);
    setThumbHeight(visibleRatio * el.clientHeight);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight);
    setThumbTop(ratio * (el.clientHeight - thumbHeight));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartTop(thumbTop);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const deltaY = e.clientY - startY;
    const el = scrollRef.current;
    const scrollRatio =
      (el.scrollHeight - el.clientHeight) / (el.clientHeight - thumbHeight);
    el.scrollTop = (startTop + deltaY) * scrollRatio;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    updateThumbHeight();
    handleScroll(); // initial sync

    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateThumbHeight);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateThumbHeight);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [thumbHeight, isDragging]);

  useEffect(() => {
    updateThumbHeight();
  }, [dependency]);

  return (
    <Box
      sx={{ position: "relative", width: "100%", maxWidth: width, marginLeft }}
    >
      <Box
        ref={scrollRef}
        sx={{
         // backgroundColor: bgColor,
          color: "white",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          maxHeight: height,
          overflowY: "scroll",
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
          top: 10,
          right: 0,
          width: "8px",
          height: `calc(100% - 10px)`,
        }}
      >
        <Box
          ref={thumbRef}
          onMouseDown={handleMouseDown}
          sx={{
            position: "absolute",
            // Constrain the thumb's top to ensure it stays within bounds
            top: `${Math.min(
              thumbTop + 10,
              (scrollRef.current?.clientHeight || 0) - thumbHeight - 10
            )}px`, // Account for the top offset and prevent overflow
            right: 0,
            width: "8px",
            height: `${thumbHeight -15}px`,
            backgroundColor: isOverflowing ? thumbColor : "transparent",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
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
