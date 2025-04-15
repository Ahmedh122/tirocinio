import { useContext } from "react";
import { PopupStateContext } from "./PopupStateContext";

export function usePopupStateContext() {
  const context = useContext(PopupStateContext);

  if (!context) {
    throw new Error(
      "usePopupStateContext must be used within a PopupStateProvider"
    );
  }

  return context;
}
