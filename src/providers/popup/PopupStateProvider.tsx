import {
  usePopupState as useOriginalPopupState,
  type PopupState,
  type Variant,
} from "material-ui-popup-state/hooks";
import { useId, type ReactNode } from "react";
import {
  PopupStateContext,
  type PopupStateContextValue,
} from "./PopupStateContext";

export type PopupStateProviderProps = {
  variant: Variant;
  disableAutoFocus?: boolean | null;
  parentPopupState?: PopupState | null;
  children: ReactNode | ((popupState: PopupStateContextValue) => ReactNode);
};

export function PopupStateProvider({
  parentPopupState,
  children,
  ...rest
}: PopupStateProviderProps) {
  const popupId = useId();

  const popupState = useOriginalPopupState({
    popupId,
    ...rest,
  });

  const closePopups = () => {
    popupState.close();
    if (parentPopupState) parentPopupState.close();
  };

  const contextValue: PopupStateContextValue = {
    popupState,
    parentPopupState,
    closePopups,
  };

  return (
    <PopupStateContext.Provider value={contextValue}>
      {typeof children === "function" ? children(contextValue) : children}
    </PopupStateContext.Provider>
  );
}
