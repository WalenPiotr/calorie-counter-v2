import React from "react";
import { BrowserRouter } from "react-router-dom";
import About from "../pages/About";
import Index from "../pages/Index";
import Users from "../pages/Users";
import Layout from "./Layout";

const links = [
  {
    to: "/",
    text: "Home",
  },
  {
    to: "/about",
    text: "About",
  },
  {
    to: "/users",
    text: "Users",
  },
];
const routes = [
  { href: "/", component: Index, exact: true },
  { href: "/about", component: About, exact: false },
  { href: "/users", component: Users, exact: false },
];

const Router = () => {
  return (
    <BrowserRouter basename={"panel"}>
      <Layout links={links} routes={routes} />
    </BrowserRouter>
  );
};

export default Router;
