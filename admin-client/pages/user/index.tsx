import { Component } from "react";
import Layout from "../../components/Layout";
import { Role, SearchUserComponent } from "../../graphql/generated/apollo";
import { authorized, Me } from "../../lib/nextjs/authorized";
import Table from "../../components/Table";
import { Formik } from "formik";
import SearchBar from "../../components/SearchBar";
import { NextContext } from "next";
import Router from "next/router";
import {
  parseString,
  parsePage,
  parseRowsPerPage,
} from "../../lib/nextjs/parseQueryString";

interface UsersProps {
  email: string;
  page: number;
  rowsPerPage: number;
  rowsOptions: number[];
}

class Users extends Component<UsersProps> {
  static async getInitialProps(props: NextContext) {
    await authorized(props, [Role.Admin]);
    const { email, page, rowsPerPage } = props.query;
    const rowsOptions = [5, 10, 15];
    return {
      email: parseString(email),
      page: parsePage(page),
      rowsPerPage: parseRowsPerPage(rowsPerPage, rowsOptions),
      rowsOptions,
    };
  }
  handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => {
    Router.push({
      pathname: "/user",
      query: {
        email: this.props.email,
        page: newPage,
        rowsPerPage: this.props.rowsPerPage,
      },
    });
  };
  handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    Router.push({
      pathname: "/user",
      query: {
        email: this.props.email,
        page: 0,
        rowsPerPage: parseInt(event.target.value),
      },
    });
  };
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
              {data && data.searchUser && data.searchUser.items ? (
                <Table
                  headers={[
                    { text: "id" },
                    { text: "displayName" },
                    { text: "email" },
                    { text: "role" },
                    { text: "status" },
                    { text: "provider" },
                    { text: "createdAt" },
                    { text: "updatedAt" },
                  ]}
                  rows={data.searchUser.items.map(i => [
                    { value: i.id },
                    { value: i.displayName },
                    { value: i.email },
                    { value: i.role },
                    { value: i.status },
                    { value: i.provider },
                    { value: i.createdAt },
                    { value: i.updatedAt },
                  ])}
                  pagination={{
                    count: data.searchUser.count,
                    page: this.props.page,
                    rowsPerPage: this.props.rowsPerPage,
                    handleChangePage: this.handleChangePage,
                    handleChangeRowsPerPage: this.handleChangeRowsPerPage,
                    rowsOptions: this.props.rowsOptions,
                  }}
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
