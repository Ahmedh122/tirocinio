import { Outlet, ScrollRestoration } from "react-router-dom";

function DocumentLayout() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" , backgroundColor:'#1e293b'}}>
      <Outlet />
      <ScrollRestoration />
    </div>
  );
}

export { DocumentLayout as Component };
