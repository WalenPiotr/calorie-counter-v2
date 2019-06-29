import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import React from "react";
import createStyled from "../controllers/Style";
import { Role } from "../graphql/generated/apollo";
import { authorized, AuthData } from "../lib/nextjs/authorized";
import { Context } from "../types/Context";
import Layout from "../components/Layout";
import { parseString } from "../lib/nextjs/parseQueryString";

const IndexStyled = createStyled(() => ({
  root: {},
}));

interface IndexProps {
  authData: AuthData;
}

class Index extends React.Component<IndexProps> {
  static async getInitialProps(props: Context) {
    const authData = await authorized(props, [Role.Admin]);
    const message = parseString(props.query.message);
    return { message, authData };
  }
  render() {
    const { authData } = this.props;
    return (
      <Layout authData={{ ...authData }}>
        <IndexStyled>
          {({ classes }) => (
            <Paper>
              <Typography variant="h2">
                Welcome to calorie counter app
              </Typography>
            </Paper>
          )}
        </IndexStyled>
      </Layout>
    );
  }
}

export default Index;
