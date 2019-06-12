import { Component } from "react";
import Layout from "../components/Layout";
import { Role } from "../graphql/generated/apollo";
import { authorized } from "../lib/nextjs/authorized";

class Sensitive extends Component {
  static async getInitialProps(props: any) {
    return await authorized(props, [Role.Admin]);
  }
  render() {
    return (
      <Layout>
        <div>Sensitive Data</div>
      </Layout>
    );
  }
}

export default Sensitive;
