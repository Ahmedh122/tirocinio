import { Outlet, ScrollRestoration } from "react-router-dom";

function DocumentLayout() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Outlet />
      <ScrollRestoration />
    </div>
  );
}

export { DocumentLayout as Component };
