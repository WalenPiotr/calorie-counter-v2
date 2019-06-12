import { Component } from "react";
import Layout from "../../components/Layout";
import { Role, SearchUserComponent } from "../../graphql/generated/apollo";
import { authorized } from "../../lib/nextjs/authorized";
import UsersTable from "../../components/users/UsersTable";

class Users extends Component {
  static async getInitialProps(props: any) {
    return await authorized(props, [Role.Admin]);
  }
  render() {
    return (
      <Layout>
        <SearchUserComponent variables={{ email: "" }}>
          {({ data }) => (data ? <UsersTable rows={data.searchUser} /> : null)}
        </SearchUserComponent>
      </Layout>
    );
  }
}

export default Users;
