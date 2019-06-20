import React from "react";
import { Formik } from "formik";
import { NextContext } from "next";
import Router from "next/router";
import { Component } from "react";
import Layout from "../../components/Layout";
import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import { Role, SearchProductsComponent } from "../../graphql/generated/apollo";
import { authorized } from "../../lib/nextjs/authorized";
import {
  parsePage,
  parseRowsPerPage,
  parseString,
} from "../../lib/nextjs/parseQueryString";

interface ProductsProps {
  name: string;
  page: number;
  rowsPerPage: number;
  rowsOptions: number[];
}

class Products extends Component<ProductsProps> {
  static async getInitialProps(props: NextContext) {
    await authorized(props, [Role.Admin]);
    const { name, page, rowsPerPage } = props.query;
    const rowsOptions = [5, 10, 15];
    return {
      name: parseString(name),
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
      pathname: "/product",
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
      pathname: "/product",
      query: {
        name: this.props.name,
        page: 0,
        rowsPerPage: parseInt(event.target.value),
      },
    });
  };

  render() {
    return (
      <Layout>
        <SearchProductsComponent
          variables={{
            name: this.props.name,
            take: this.props.rowsPerPage,
            skip: this.props.page * this.props.rowsPerPage,
          }}
        >
          {({ data }) => (
            <>
              <Formik
                initialValues={{ name: this.props.name }}
                onSubmit={async ({ name }, { setSubmitting }) => {
                  setSubmitting(true);
                  Router.push({
                    pathname: "/product",
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
                    ]}
                    rows={data.searchProducts.items.map(i => [
                      { value: i.id },
                      { value: i.name },
                      { value: i.createdAt },
                      {
                        value: i.createdBy!.displayName,
                        link: `/user/${i.createdBy!.id}`,
                      },
                      { value: i.updatedAt },
                      {
                        value: i.updatedBy!.displayName,
                        link: `/user/${i.createdBy!.id}`,
                      },
                      { value: i.reports.count },
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
            </>
          )}
        </SearchProductsComponent>
      </Layout>
    );
  }
}

export default Products;
