import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { me } from "../redux-store/actions/auth";
import { connect } from "react-redux";
import Layout from "./Layout";
import About from "../pages/About";
import Index from "../pages/Index";
import Users from "../pages/Users";

const mapStateToProps = (state: any) => ({
  me: state.auth.me,
});
const mapDispatchToProps = (dispatch: any) => {
  return {
    onMe: () => {
      dispatch(me());
    },
  };
};
const withDispatch = connect(
  mapStateToProps,
  mapDispatchToProps,
);
interface MeProps {
  me: any;
  onMe: any;
  children: (props: MePassedProps) => React.ReactNode;
}
interface MePassedProps {
  me: any;
}
const MeComponent = withDispatch(
  class Me extends React.Component<MeProps> {
    componentDidMount() {
      this.props.onMe();
    }
    render() {
      return this.props.children({ me: this.props.me });
    }
  },
);

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
