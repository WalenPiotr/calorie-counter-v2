import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import MenuController from "../../faacs/Menu";
import createStyle from "../../faacs/Style";
import Toggle from "../../faacs/Toggle";
import {
  Role,
  GetMyEnergyValueComponent,
} from "../../graphql/generated/apollo";
import { AuthData } from "../../lib/nextjs/authorized";
import Badge from "@material-ui/core/Badge";
import FastFoodIcon from "@material-ui/icons/Fastfood";
import Router from "next/router";
import AddIcon from "@material-ui/icons/AddCircle";

const loginURI = "http://localhost:8080/auth/google/login";
const logoutURI = "http://localhost:8080/auth/logout";

const drawerWidth = 240;

const LayoutBarStyle = createStyle(theme => ({
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
  nextBarItems: {
    margin: 0,
    marginRight: theme.spacing(1),
  },
  firstBarItem: {
    margin: 0,
    marginRight: theme.spacing(1),
    marginLeft: "auto",
  },
  link: {
    color: "inherit",
    textDecoration: "inherit",
  },
}));

interface LayoutBarProps {
  isLoggedIn?: boolean;
  role?: Role;
  isOpen: boolean;
  toggle: () => void;
}
const LayoutBar = ({ toggle, isOpen, isLoggedIn, role }: LayoutBarProps) => (
  <LayoutBarStyle>
    {({ classes }) => (
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: isOpen,
        })}
        color={role === Role.Admin ? "secondary" : "primary"}
      >
        <Toolbar>
          {role === Role.Admin ? (
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={toggle}
              edge="start"
              className={clsx(classes.menuButton, isOpen && classes.hide)}
              disabled={!isLoggedIn}
            >
              <MenuIcon />
            </IconButton>
          ) : null}

          <Typography variant="h6" noWrap>
            {role === Role.Admin ? "Admin Panel" : "Calorie Counter"}
          </Typography>
          {isLoggedIn ? (
            <MenuController>
              {({ anchorEl, handleClose, handleMenu }) => (
                <>
                  <GetMyEnergyValueComponent fetchPolicy="network-only">
                    {({ data, loading }) =>
                      !loading && data ? (
                        <IconButton
                          className={classes.firstBarItem}
                          color="inherit"
                          onClick={() => {
                            const now = new Date();
                            const date = new Date(
                              Date.UTC(
                                now.getFullYear(),
                                now.getMonth(),
                                now.getDate(),
                              ),
                            ).toISOString();
                            Router.push({
                              pathname: "/logs/view",
                              query: {
                                date,
                              },
                            });
                          }}
                        >
                          <Badge
                            badgeContent={data.getMyEnergyValue.toString()}
                            color={
                              role === Role.Admin ? "primary" : "secondary"
                            }
                            max={9999}
                          >
                            <FastFoodIcon />
                          </Badge>
                        </IconButton>
                      ) : null
                    }
                  </GetMyEnergyValueComponent>
                  <IconButton
                    className={classes.nextBarItems}
                    color="inherit"
                    onClick={() => {
                      Router.push({
                        pathname: "/food",
                      });
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="Account of current user"
                    aria-controls="account-menu"
                    aria-haspopup="true"
                    color="inherit"
                    className={classes.nextBarItems}
                    onClick={handleMenu}
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem>
                      <Link href="/me">
                        <a className={classes.link}>My account</a>
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <a className={classes.link} href={logoutURI}>
                        Logout
                      </a>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </MenuController>
          ) : (
            <Button
              className={classes.firstBarItem}
              variant="outlined"
              color="inherit"
              href={loginURI}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    )}
  </LayoutBarStyle>
);

const LayoutDrawerStyle = createStyle(theme => ({
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
}));

const links: { text: string; href: string; icon: React.ReactNode }[][] = [
  [
    {
      text: "Admin",
      href: "/admin",
      icon: <InboxIcon />,
    },
  ],
  [
    {
      text: "User",
      href: "/admin/user",
      icon: <InboxIcon />,
    },
    {
      text: "Product",
      href: "/admin/product",
      icon: <InboxIcon />,
    },
  ],
];

interface LayoutDrawerProps {
  close: () => void;
  isOpen: boolean;
}

const ButtonLink = React.forwardRef(
  ({ href, className, children }: any, ref: any) => (
    <Link href={href} prefetch ref={ref as any}>
      <a className={className}>{children}</a>
    </Link>
  ),
);
const LayoutDrawer = ({ isOpen, close }: LayoutDrawerProps) => (
  <LayoutDrawerStyle>
    {({ classes, theme }) => (
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
        <>
          {links.map((group, index) => (
            <React.Fragment key={index}>
              <List>
                {group.map(link => (
                  <ListItem
                    button
                    key={link.text}
                    component={ButtonLink}
                    href={link.href}
                    onClick={close}
                  >
                    <ListItemIcon>{link.icon as any}</ListItemIcon>
                    <ListItemText primary={link.text} />
                  </ListItem>
                ))}
              </List>
              {links.length > 1 ? <Divider key={"divider" + index} /> : null}
            </React.Fragment>
          ))}
        </>
      </Drawer>
    )}
  </LayoutDrawerStyle>
);

const LayoutStyle = createStyle(theme => ({
  root: {
    display: "flex",
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
  contentBase: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

interface LayoutProps {
  authData: AuthData;
  children: React.ReactNode;
}
const Layout = ({ children, authData }: LayoutProps) => {
  const { isLoggedIn, role } = authData;
  return (
    <Toggle>
      {({ isOpen, toggle, close }) => (
        <LayoutStyle>
          {({ classes }) => (
            <div className={classes.root}>
              <LayoutBar
                toggle={toggle}
                isOpen={isOpen}
                isLoggedIn={isLoggedIn}
                role={role}
              />
              {isLoggedIn && role === Role.Admin ? (
                <LayoutDrawer isOpen={isOpen} close={close} />
              ) : null}
              <main
                className={clsx(classes.contentBase, {
                  [classes.content]: isLoggedIn && role === Role.Admin,
                  [classes.contentShift]:
                    isLoggedIn && role === Role.Admin && isOpen,
                })}
              >
                <div className={classes.drawerHeader} />
                {children}
              </main>
            </div>
          )}
        </LayoutStyle>
      )}
    </Toggle>
  );
};

export default Layout;
