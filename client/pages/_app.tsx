import { ApolloProvider } from "react-apollo";
import withApollo from "../lib/apollo/withApollo";
import React from "react";
import App, { Container } from "next/app";
import CssBaseline from "@material-ui/core/CssBaseline";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/styles";
import theme from "../material-ui/theme";

class MyApp extends App<any> {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          {/* Wrap every page in Jss and Theme providers */}
          <Head>
            <title>Calorie Counter</title>
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </ApolloProvider>
      </Container>
    );
  }
}
export default withApollo(MyApp);
