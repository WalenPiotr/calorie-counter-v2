import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Layout from "../../components/Layout";
import createStyled from "../../controllers/Style";
import { Context } from "../../types/Context";
import { redirect } from "../../lib/nextjs/redirect";
import { authorized, AuthData } from "../../lib/nextjs/authorized";
import { Role } from "../../graphql/generated/apollo";

const IndexStyled = createStyled(() => ({
  root: {},
}));

interface IndexProps {
  authData: AuthData;
}

class Index extends React.Component<IndexProps> {
  static async getInitialProps(props: Context) {
    const authData = await authorized(props, [Role.Admin]);
    if (!authData.isLoggedIn) {
      redirect(props, "/access-denied");
      return;
    }
    return { authData };
  }
  render() {
    const { authData } = this.props;
    return (
      <Layout authData={authData}>
        <IndexStyled>
          {() => (
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
