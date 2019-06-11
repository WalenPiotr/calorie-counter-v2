import React from "react";
import createStyled from "../providers/Styled";

const IndexStyled = createStyled(() => ({
  root: {
    background: "red",
  },
}));

class Index extends React.Component {
  render() {
    return (
      <IndexStyled>
        {({ classes }) => <div className={classes.root}>Index Page</div>}
      </IndexStyled>
    );
  }
}

export default Index;
