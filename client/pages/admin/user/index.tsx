import Paper from "@material-ui/core/Paper";
import { Formik } from "formik";
import { NextContext } from "next";
import Router from "next/router";
import { Component } from "react";
import Layout from "../../../components/common/Layout";
import SearchBar from "../../../components/common/SearchBar";
import Table from "../../../components/common/Table";
import { Role, SearchUserComponent } from "../../../graphql/generated/apollo";
import { authorized, AuthData } from "../../../lib/nextjs/authorized";
import {
  parsePage,
  parseRowsPerPage,
  parseString,
} from "../../../lib/nextjs/parseQueryString";
import { redirect } from "../../../lib/nextjs/redirect";

interface UsersProps {
  authData: AuthData;
  email: string;
  page: number;
  rowsPerPage: number;
  rowsOptions: number[];
}

class Users extends Component<UsersProps> {
  static async getInitialProps(props: NextContext) {
    const authData = await authorized(props, [Role.Admin]);
    if (!authData.isLoggedIn) {
      redirect(props, "/access-denied");
      return;
    }
    const { email, page, rowsPerPage } = props.query;
    const rowsOptions = [5, 10, 15];
    return {
      email: parseString(email),
      page: parsePage(page),
      rowsPerPage: parseRowsPerPage(rowsPerPage, rowsOptions),
      rowsOptions,
      authData,
    };
  }
  handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => {
    Router.push({
      pathname: "/admin/user",
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
      pathname: "/admin/user",
      query: {
        email: this.props.email,
        page: 0,
        rowsPerPage: parseInt(event.target.value),
      },
    });
  };
  render() {
    const { authData } = this.props;
    return (
      <Layout authData={authData}>
        <SearchUserComponent variables={{ email: this.props.email }}>
          {({ data }) => (
            <>
              <Formik
                initialValues={{ email: this.props.email }}
                onSubmit={async ({ email }, { setSubmitting }) => {
                  setSubmitting(true);
                  Router.push({
                    pathname: "/admin/user",
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
              <Paper>
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
                      { text: "view" },
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
                      { value: "view", link: `/admin/user/view?id=${i.id}` },
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
              </Paper>
            </>
          )}
        </SearchUserComponent>
      </Layout>
    );
  }
}

export default Users;
