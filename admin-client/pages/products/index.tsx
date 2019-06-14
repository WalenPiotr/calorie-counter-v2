import { Component } from "react";
import Layout from "../../components/Layout";
import { Role, SearchUserComponent } from "../../graphql/generated/apollo";
import { authorized, Me } from "../../lib/nextjs/authorized";
import Table from "../../components/Table";
import { Formik } from "formik";
import SearchBar from "../../components/SearchBar";
import { NextContext } from "next";
import Router from "next/router";

interface UsersProps {
  email: string;
}

class Users extends Component<UsersProps> {
  static async getInitialProps(props: NextContext) {
    await authorized(props, [Role.Admin]);
    const { name } = props.query;
    return {
      name: name !== undefined && typeof name === "string" ? name : "",
    };
  }
  render() {
    return (
      <Layout>
        <SearchUserComponent variables={{ email: this.props.email }}>
          {({ data }) => (
            <>
              <Formik
                initialValues={{ email: this.props.email }}
                onSubmit={async ({ email }, { setSubmitting }) => {
                  setSubmitting(true);
                  Router.push({
                    pathname: "/user",
                    query: { email },
                  });
                  setSubmitting(false);
                }}
              >
                {({ values, handleChange, handleSubmit, isSubmitting }) => (
                  <SearchBar
                    text="Search user by email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}
              </Formik>
              {data && data.searchUser ? (
                <Table
                  fields={[
                    { field: "id" },
                    { field: "displayName" },
                    { field: "email" },
                    { field: "role" },
                    { field: "status" },
                    { field: "provider" },
                    { field: "createdAt" },
                    { field: "updatedAt" },
                  ]}
                  rows={data.searchUser}
                />
              ) : null}
            </>
          )}
        </SearchUserComponent>
      </Layout>
    );
  }
}

export default Users;
