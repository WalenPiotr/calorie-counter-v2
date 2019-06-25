import Routes, * as nextRoutes from "next-routes";
// @ts-ignore
export const routes = nextRoutes() as Routes;
export const Router = routes.Router;
export const Link = routes.Link;

// routes.add("confirm", "/user/confirm/:token");
// routes.add("change-password", "/user/change-password/:token");

routes.add("user/view", "/user/view/:id");
routes.add("product/view", "/product/view/:id");
