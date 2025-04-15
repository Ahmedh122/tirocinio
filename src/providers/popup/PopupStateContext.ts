import { createContext } from "react";
import { type PopupState } from "material-ui-popup-state/hooks";

export type PopupStateContextValue = {
  popupState: PopupState;
  parentPopupState?: PopupState | null;
  closePopups: () => void;
};

export const PopupStateContext = createContext<PopupStateContextValue | null>(
  null
);
