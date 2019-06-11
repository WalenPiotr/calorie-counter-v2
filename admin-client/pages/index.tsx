import { createStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import createStyled from "../render-props/Styled";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      paddingTop: theme.spacing.unit * 5,
      width: 600,
      margin: "0 auto",
    },

    paperBox: {
      padding: theme.spacing.unit * 4,
    },
    divider: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,
    },
  });

const IndexStyled = createStyled(styles);

class Index extends React.Component {
  render() {
    return <div>Index Page</div>;
  }
}

export default Index;
