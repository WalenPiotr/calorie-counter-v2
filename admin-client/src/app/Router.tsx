import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { me } from "./actions/auth";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch: any) => {
  return {
    onMe: () => {
      dispatch(me());
    },
  };
};
const withDispatch = connect(
  null,
  mapDispatchToProps,
);
const MeComponent = withDispatch(({ children, ...rest }: any) => {
  console.log(rest);
  return children({ ...rest });
});

const Index = () => {
  return (
    <h2>
      <MeComponent>
        {({ onMe }: any) => {
          onMe();
          return <h1>"Home"</h1>;
        }}
      </MeComponent>
    </h2>
  );
};

const About = () => {
  return <h2>About</h2>;
};

const Users = () => {
  return <h2>Users</h2>;
};

const Router = () => {
  return (
    <BrowserRouter basename="panel">
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
          </ul>
        </nav>
        <Route path="/" exact component={Index} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </div>
    </BrowserRouter>
  );
};

export default Router;
