import { Formik } from "formik";
import Router from "next/router";
import React, { Component } from "react";
import { Context } from "react-apollo";
import Layout from "../../../components/Layout";
import SearchBar from "../../../components/SearchBar";
import Table from "../../../components/Table";
import {
  Role,
  SearchProductsDocument,
  SearchProductsQuery,
} from "../../../graphql/generated/apollo";
import { authorized, AuthData } from "../../../lib/nextjs/authorized";
import {
  parsePage,
  parseRowsPerPage,
  parseString,
} from "../../../lib/nextjs/parseQueryString";
import { redirect } from "../../../lib/nextjs/redirect";
import Paper from "@material-ui/core/Paper";

interface ProductsProps {
  authData: AuthData;
  data: SearchProductsQuery;
  name: string;
  rowsPerPage: number;
  page: number;
  rowsOptions: number[];
}

class Products extends Component<ProductsProps> {
  static async getInitialProps(props: Context) {
    const authData = await authorized(props, [Role.Admin]);
    if (!authData.isLoggedIn) {
      redirect(props, "/access-denied");
      return;
    }
    const rowsOptions = [10, 20, 30];
    const name = parseString(props.query.name);
    const page = parsePage(props.query.page);
    const rowsPerPage = parseRowsPerPage(props.query.rowsPerPage, rowsOptions);
    const { apolloClient } = props;
    const { data, errors } = await apolloClient.query({
      query: SearchProductsDocument,
      variables: {
        name: name,
        take: rowsPerPage,
        skip: page * rowsPerPage,
      },
    });
    if (errors && errors.length > 0) {
      redirect(props, "/error");
      return;
    }
    return {
      authData,
      data,
      name,
      rowsPerPage,
      page,
      rowsOptions,
    };
  }
  handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => {
    Router.push({
      pathname: "/admin/product",
      query: {
        name: this.props.name,
        page: newPage,
        rowsPerPage: this.props.rowsPerPage,
      },
    });
  };

  handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    Router.push({
      pathname: "/admin/product",
      query: {
        name: this.props.name,
        page: 0,
        rowsPerPage: parseInt(event.target.value),
      },
    });
  };

  render() {
    const { data, authData } = this.props;
    return (
      <Layout authData={authData}>
        <Formik
          initialValues={{ name: this.props.name }}
          onSubmit={async ({ name }, { setSubmitting }) => {
            setSubmitting(true);
            Router.push({
              pathname: "/admin/product",
              query: { name },
            });
            setSubmitting(false);
          }}
        >
          {({ values, handleChange, handleSubmit, isSubmitting }) => (
            <SearchBar
              text="Search product by name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </Formik>
        <Paper>
          {data && data.searchProducts && data.searchProducts.items ? (
            <>
              <Table
                headers={[
                  { text: "id" },
                  { text: "name" },
                  { text: "createdAt" },
                  { text: "createdBy (displayName)" },
                  { text: "createdBy" },
                  { text: "updatedBy (displayName)" },
                  { text: "reports (count)" },
                  { text: "units (count)" },
                  { text: "view" },
                ]}
                rows={data.searchProducts.items.map(i => [
                  { value: i.id },
                  { value: i.name },
                  { value: i.createdAt },
                  {
                    value: i.createdBy!.displayName,
                    link: `/admin/user/view?id=${i.createdBy!.id}`,
                  },
                  { value: i.updatedAt },
                  {
                    value: i.updatedBy!.displayName,
                    link: `/admin/user/view?id=${i.createdBy!.id}`,
                  },
                  { value: i.reports.count },
                  { value: i.units.count },
                  { value: "view", link: `/admin/product/view?id=${i.id}` },
                ])}
                pagination={{
                  count: data.searchProducts.count,
                  page: this.props.page,
                  rowsPerPage: this.props.rowsPerPage,
                  handleChangePage: this.handleChangePage,
                  handleChangeRowsPerPage: this.handleChangeRowsPerPage,
                  rowsOptions: this.props.rowsOptions,
                }}
              />
            </>
          ) : null}
        </Paper>
      </Layout>
    );
  }
}

export default Products;
