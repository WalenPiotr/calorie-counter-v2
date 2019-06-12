import React from "react";
import createStyled from "../faacs/Style";
import Layout from "../components/layout/Layout";

const IndexStyled = createStyled(() => ({
  root: {
    background: "red",
  },
}));

class Index extends React.Component {
  render() {
    return (
      <Layout>
        <IndexStyled>
          {({ classes }) => <div className={classes.root}>blabla</div>}
        </IndexStyled>
      </Layout>
    );
  }
}

export default Index;
