import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("rtl-input", "routes/rtl-input.tsx"),
  route("form", "routes/form.tsx"),
] satisfies RouteConfig;
