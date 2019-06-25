import React, { ReactNode, Component, Children } from "react";

interface MenuPassedProps {
  anchorEl: HTMLElement | null;
  handleMenu: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
}
interface MenuProps {
  children: (props: MenuPassedProps) => ReactNode;
}
interface MenuState {
  anchorEl: HTMLElement | null;
}

class Menu extends Component<MenuProps, MenuState> {
  state = {
    anchorEl: null,
  };
  handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  render() {
    return this.props.children({
      anchorEl: this.state.anchorEl,
      handleMenu: this.handleMenu,
      handleClose: this.handleClose,
    });
  }
}
export default Menu;
