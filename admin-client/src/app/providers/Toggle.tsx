import React from "react";

interface ToggleProviderPassedProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
export interface ToggleProviderProps {
  children: (props: ToggleProviderPassedProps) => React.ReactNode;
}

interface ToggleProviderState {
  isOpen: boolean;
}

export default class ToggleProvider extends React.Component<
  ToggleProviderProps,
  ToggleProviderState
> {
  state: ToggleProviderState = {
    isOpen: false,
  };
  open = () => {
    this.setState({ isOpen: true });
  };
  close = () => {
    this.setState({ isOpen: false });
  };
  toggle = () => {
    this.setState((prevState: ToggleProviderState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
    }));
  };
  render() {
    return this.props.children({
      isOpen: this.state.isOpen,
      toggle: this.toggle,
      close: this.close,
      open: this.open,
    });
  }
}
