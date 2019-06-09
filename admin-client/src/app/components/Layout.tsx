import React, { ComponentClass, FunctionComponent, RefObject } from "react";
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
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyled from "../providers/Styled";
import ToggleProvider from "../providers/Toggle";
import { Route, Link, Switch } from "react-router-dom";
import Button from "@material-ui/core/Button";
import MeProvider from "../providers/Me";

const drawerWidth = 240;

const StylesProvider = createStyled((theme: Theme) => ({
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

interface LinkTemplate {
  text: string;
  to: string;
}
interface RouteTemplate {
  href: string;
  component: React.ComponentType<any>;
  exact: boolean;
}
interface LayoutProps {
  routes: RouteTemplate[];
  links: LinkTemplate[];
}

const Layout = ({ links, routes }: LayoutProps) => {
  return (
    <ToggleProvider>
      {({ isOpen, open, close, toggle }) => (
        <StylesProvider>
          {({ classes, theme }) => (
            <div className={classes.root}>
              <CssBaseline />
              <MeProvider>
                {({ me }) => (
                  <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                      [classes.appBarShift]: isOpen,
                    })}
                  >
                    <Toolbar>
                      <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={toggle}
                        edge="start"
                        className={clsx(
                          classes.menuButton,
                          isOpen && classes.hide,
                        )}
                      >
                        <MenuIcon />
                      </IconButton>
                      <Typography variant="h6" noWrap>
                        Admin App
                      </Typography>
                      {me ? (
                        <div>
                          <Typography variant="caption">Logged as:</Typography>
                          <Typography variant="subtitle1">
                            {me.displayName}
                          </Typography>
                        </div>
                      ) : null}
                    </Toolbar>
                  </AppBar>
                )}
              </MeProvider>

              <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={isOpen}
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                <div className={classes.drawerHeader}>
                  <IconButton onClick={close}>
                    {theme.direction === "ltr" ? (
                      <ChevronLeftIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </IconButton>
                </div>
                <Divider />
                <List>
                  {links.map(({ text, to }, index) => (
                    // @ts-ignore
                    <Button
                      component={React.forwardRef(
                        (props: any, ref: RefObject<Link>) => (
                          <Link to={to} {...props} ref={ref} />
                        ),
                      )}
                      fullWidth
                      key={to}
                    >
                      <ListItemIcon>
                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </Button>
                  ))}
                </List>
                <Divider />
              </Drawer>
              <main
                className={clsx(classes.content, {
                  [classes.contentShift]: isOpen,
                })}
              >
                <div className={classes.drawerHeader} />
                <Switch>
                  {routes.map(({ href, component, exact }) => (
                    <Route
                      path={href}
                      component={component}
                      key={href}
                      exact={exact}
                    />
                  ))}
                </Switch>
              </main>
            </div>
          )}
        </StylesProvider>
      )}
    </ToggleProvider>
  );
};

export default Layout;
