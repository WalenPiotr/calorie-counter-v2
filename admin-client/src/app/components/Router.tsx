import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { me } from "../redux-store/actions/auth";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";

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

const Index = () => {
  return <h2>Home</h2>;
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
        <MeComponent>
          {({ me }: any) => {
            console.log(me);
            return (
              <nav>
                <pre>{JSON.stringify(me, null, 2)}</pre>
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
            );
          }}
        </MeComponent>
        <Button>Click</Button>
        <Route path="/" exact component={Index} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </div>
    </BrowserRouter>
  );
};

export default Router;
