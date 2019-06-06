import React from "react";
import Link from "next/link";
import Button from "@material-ui/core/Button";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyled from "../lib/material-ui/Styled";

const Styled = createStyled((theme: Theme) => ({
  button: {
    margin: theme.spacing(2),
  },
}));

export default () => (
  <div>
    <ul>
      <li>
        <Link href="/a" as="/a">
          <a>a</a>
        </Link>
      </li>
      <li>
        <Link href="/b" as="/b">
          <a>b</a>
        </Link>
      </li>
    </ul>
    <Styled>
      {({ classes }) => (
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          className={classes.button}
        >
          Click me
        </Button>
      )}
    </Styled>
  </div>
);
