import { Component } from "react";
import createStyle from "../controllers/Style";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import { Role } from "../graphql/generated/apollo";
import { Context } from "../types/Context";
import { authorized, AuthData } from "../lib/nextjs/authorized";
import Layout from "../components/Layout";

const Style = createStyle(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(5),
  },
  icon: {
    fontSize: 80,
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    marginTop: theme.spacing(2),
  },
}));

interface AccessDeniedProps {
  authData: AuthData;
}

export default class extends Component<AccessDeniedProps> {
  static async getInitialProps(props: Context) {
    const authData = await authorized(props, [Role.User, Role.Admin]);
    return { authData };
  }
  render() {
    const { authData } = this.props;
    return (
      <Layout authData={authData}>
        <Style>
          {({ classes }) => (
            <Paper className={classes.root}>
              <ErrorIcon className={classes.icon} color="error" />
              <Typography variant="h3" color="error">
                Please login
              </Typography>
              <Typography
                variant="subtitle1"
                color="error"
                className={classes.subtitle}
              >
                To access this page please login
              </Typography>
            </Paper>
          )}
        </Style>
      </Layout>
    );
  }
}
