import { Component } from "react";
import createStyle from "../controllers/Style";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import { parseString } from "../lib/nextjs/parseQueryString";
import { Context } from "../types/Context";
import { authorized, AuthData } from "../lib/nextjs/authorized";
import { Role } from "../graphql/generated/apollo";
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

interface ErrorPageProps {
  authData: AuthData;
  message: string;
}

export default class extends Component<ErrorPageProps> {
  static async getInitialProps(props: Context) {
    const authData = await authorized(props, [Role.User, Role.Admin]);
    const message = parseString(props.query.message);
    return { message, authData };
  }
  render() {
    const { authData, message } = this.props;
    return (
      <Layout authData={authData}>
        <Style>
          {({ classes }) => (
            <Paper className={classes.root}>
              <ErrorIcon className={classes.icon} color="error" />
              <Typography variant="h3" color="error">
                Error
              </Typography>
              <Typography
                variant="subtitle1"
                color="error"
                className={classes.subtitle}
              >
                {message ? message : "Something went wrong"}
              </Typography>
            </Paper>
          )}
        </Style>
      </Layout>
    );
  }
}
