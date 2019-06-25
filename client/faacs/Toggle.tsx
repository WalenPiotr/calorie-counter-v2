import React, { ReactNode, Component, Children } from "react";

interface TogglePassedProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}
interface ToggleProps {
  children: (props: TogglePassedProps) => ReactNode;
}
interface ToggleState {
  isOpen: boolean;
}

class Toggle extends Component<ToggleProps, ToggleState> {
  state = {
    isOpen: false,
  };
  open = () => {
    this.setState({ isOpen: true });
  };
  close = () => {
    this.setState({ isOpen: false });
  };
  toggle = () => {
    this.setState(prevState => ({
      ...prevState,
      isOpen: !prevState.isOpen,
    }));
  };
  render() {
    return this.props.children({
      isOpen: this.state.isOpen,
      close: this.close,
      toggle: this.toggle,
      open: this.open,
    });
  }
}
export default Toggle;
