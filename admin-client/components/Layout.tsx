import React, { Children } from "react";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import createStyled from "../lib/material-ui/Styled";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

const drawerWidth = 240;

const StyleProvider = createStyled((theme: Theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

interface LayoutStateProviderPassedProps {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}
interface LayoutStateProviderProps {
  children: (props: LayoutStateProviderPassedProps) => React.ReactNode;
}
interface LayoutStateProviderState {
  isDrawerOpen: boolean;
}
class LayoutStateProvider extends React.Component<
  LayoutStateProviderProps,
  LayoutStateProviderState
> {
  state = {
    isDrawerOpen: false,
  };
  openDrawer = () => {
    console.log("open");
    this.setState({ isDrawerOpen: true });
  };
  closeDrawer = () => {
    console.log("close");

    this.setState({ isDrawerOpen: false });
  };
  render() {
    const { isDrawerOpen } = this.state;
    const { openDrawer, closeDrawer } = this;
    return this.props.children({ isDrawerOpen, openDrawer, closeDrawer });
  }
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <LayoutStateProvider>
      {({ isDrawerOpen, openDrawer, closeDrawer }) => (
        <StyleProvider>
          {({ classes }) => (
            <div className={classes.root}>
              <CssBaseline />
              <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                  [classes.appBarShift]: isDrawerOpen,
                })}
              >
                <Toolbar>
                  <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={openDrawer}
                    edge="start"
                    className={clsx(
                      classes.menuButton,
                      isDrawerOpen && classes.hide,
                    )}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" noWrap>
                    Persistent drawer
                  </Typography>
                </Toolbar>
              </AppBar>
              <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={isDrawerOpen}
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                <div className={classes.drawerHeader}>
                  <IconButton onClick={closeDrawer}>
                    <ChevronLeftIcon />
                  </IconButton>
                </div>
                <Divider />
                <List>
                  {["Inbox", "Starred", "Send email", "Drafts"].map(
                    (text, index) => (
                      <ListItem button key={text}>
                        <ListItemIcon>
                          {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                      </ListItem>
                    ),
                  )}
                </List>
                <Divider />
                <List>
                  {["All mail", "Trash", "Spam"].map((text, index) => (
                    <ListItem button key={text}>
                      <ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
                </List>
              </Drawer>
              <main
                className={clsx(classes.content, {
                  [classes.contentShift]: isDrawerOpen,
                })}
              >
                <div className={classes.drawerHeader} />
                {children}
              </main>
            </div>
          )}
        </StyleProvider>
      )}
    </LayoutStateProvider>
  );
};

export default Layout;
