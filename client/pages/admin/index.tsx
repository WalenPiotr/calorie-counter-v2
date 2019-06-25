import React from "react";
import createStyled from "../../faacs/Style";
import Layout from "../../components/Layout";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { authorized } from "../../lib/nextjs/authorized";
import { Role } from "../../graphql/generated/apollo";
import { Context } from "../../types/Context";

const IndexStyled = createStyled(() => ({
  root: {},
}));

class Index extends React.Component {
  static async getInitialProps(props: Context) {
    await authorized(props, [Role.Admin]);
    return {};
  }
  render() {
    return (
      <Layout>
        <IndexStyled>
          {({ classes }) => (
            <Paper>
              <Typography variant="h2">Welcome to admin panel</Typography>
            </Paper>
          )}
        </IndexStyled>
      </Layout>
    );
  }
}

export default Index;
