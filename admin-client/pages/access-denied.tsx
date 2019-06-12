import { Component } from "react";
import Layout from "../components/layout/Layout";
import createStyle from "../faacs/Style";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import ErrorIcon from "@material-ui/icons/ErrorOutline";

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

export default class extends Component {
  render() {
    return (
      <Layout>
        <Style>
          {({ classes }) => (
            <Paper className={classes.root}>
              <ErrorIcon className={classes.icon} color="error" />
              <Typography variant="h3" color="error">
                Access Denied
              </Typography>
              <Typography
                variant="subtitle1"
                color="error"
                className={classes.subtitle}
              >
                You need to be service administrator to access this page
              </Typography>
            </Paper>
          )}
        </Style>
      </Layout>
    );
  }
}
