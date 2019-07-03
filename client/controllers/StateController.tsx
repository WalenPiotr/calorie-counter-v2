import React from "react";

interface StateProviderPassedProps<InnerState> {
  state: InnerState;
  set: (state: InnerState) => void;
}
interface StateControllerProps<InnerState> {
  initialState: InnerState;
  children: (props: StateProviderPassedProps<InnerState>) => React.ReactNode;
}

class StateController<InnerState> extends React.Component<
  StateControllerProps<InnerState>,
  InnerState
> {
  state: InnerState = {
    ...this.props.initialState,
  };
  set = (state: InnerState) => {
    this.setState({ ...state });
  };
  render() {
    return this.props.children({
      set: this.set,
      state: this.state,
    });
  }
}

export default StateController;
