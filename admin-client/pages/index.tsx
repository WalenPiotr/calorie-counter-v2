import React from "react";
import Link from "next/link";
import Button from "@material-ui/core/Button";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyled from "../lib/material-ui/Styled";
import Layout from "../components/Layout";
const Styled = createStyled((theme: Theme) => ({
  button: {
    margin: theme.spacing(2),
  },
}));

const PROXY_PATH = "/admin";
const MyLink = ({ as, href, children, ...props }: any) => (
  <Link {...props} as={`${PROXY_PATH}${href}`}>
    {children}
  </Link>
);

export default () => (
  <Layout>
    <ul>
      <li>
        <MyLink href="/a">
          <a>a</a>
        </MyLink>
      </li>
      <li>
        <MyLink href="/b">
          <a>b</a>
        </MyLink>
      </li>
    </ul>
  </Layout>
);
