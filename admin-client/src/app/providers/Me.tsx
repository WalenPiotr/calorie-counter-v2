import React from "react";
import { me } from "../redux-store/actions/auth";
import { connect } from "react-redux";
import { Me } from "../redux-store/types/auth";

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
  me: Me;
  onMe: () => void;
  children: (props: MePassedProps) => React.ReactNode;
}
interface MePassedProps {
  me: Me;
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

export default MeComponent;
