import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Typography from "@material-ui/core/Typography";
import Router from "next/router";
import React from "react";
import BaseInfo from "../../../components/BaseInfo";
import Layout from "../../../components/Layout";
import EntityTable, { Pagination } from "../../../components/Table";
import createStyle from "../../../faacs/Style";
import {
  DeleteProductComponent,
  GetProductDocument,
  GetProductQuery,
  Role,
} from "../../../graphql/generated/apollo";
import { authorized } from "../../../lib/nextjs/authorized";
import { parsePage, parseString } from "../../../lib/nextjs/parseQueryString";
import { redirect } from "../../../lib/nextjs/redirect";
import { Context } from "../../../types/Context";

const Style = createStyle((theme: Theme) => ({
  table: { width: "auto" },
  paper: {
    padding: theme.spacing(5),
    display: "inline-block",
    margin: "0 auto",
  },
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  header: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

class ProductViewProps {
  data: GetProductQuery;
  unitPagination: Pagination;
  reportPagination: Pagination;
}
export default class ProductView extends React.Component<ProductViewProps> {
  static async getInitialProps(props: Context) {
    await authorized(props, [Role.Admin]);
    const id = parseString(props.query.id);
    const unitPagination = {
      ...new Pagination(),
      page: parsePage(props.query.unitPage),
    };
    const reportPagination = {
      ...new Pagination(),
      page: parsePage(props.query.reportPage),
    };
    const { apolloClient } = props;

    const { data, errors } = await apolloClient.query({
      query: GetProductDocument,
      variables: {
        id,
        unitPagination: {
          take: unitPagination.rowsPerPage,
          skip: unitPagination.page * unitPagination.rowsPerPage,
        },
        reportPagination: {
          take: reportPagination.rowsPerPage,
          skip: reportPagination.page * reportPagination.rowsPerPage,
        },
      },
    });
    if (errors && errors.length > 0) {
      redirect(props, "/error");
    }
    return {
      data,
      unitPagination,
      reportPagination,
    };
  }
  render() {
    const { data, unitPagination, reportPagination } = this.props;
    return (
      <Layout>
        {data ? (
          <Style>
            {({ classes }) => (
              <Paper className={classes.paper}>
                <Typography variant="h4" className={classes.title}>
                  Product
                </Typography>
                <BaseInfo
                  data={[
                    { name: "id", value: data.getProduct.id },
                    { name: "name", value: data.getProduct.name },
                    { name: "createdAt", value: data.getProduct.createdAt },
                    {
                      name: "createdBy (displayName)",
                      value: data.getProduct.createdBy!.displayName,
                      link: `/user/view?id=${data.getProduct.createdBy!.id}`,
                    },
                  ]}
                />
                <Typography variant="h6" className={classes.title}>
                  Products Units
                </Typography>
                <EntityTable
                  headers={[
                    { text: "id" },
                    { text: "name" },
                    { text: "energy" },
                  ]}
                  rows={data.getProduct.units.items.map(u => [
                    { name: "id", value: u.id },
                    { name: "name", value: u.name },
                    { name: "energy", value: u.energy.toString() },
                  ])}
                  pagination={{
                    count: data.getProduct.units.count,
                    page: unitPagination.page,
                    rowsPerPage: unitPagination.rowsPerPage,
                    rowsOptions: unitPagination.rowsOptions,
                    handleChangePage: (event, newPage) => {
                      Router.push(
                        `product/view?id=${
                          data.getProduct.id
                        }&unitPage=${newPage}&reportPage=${
                          reportPagination.page
                        }`,
                      );
                    },
                    handleChangeRowsPerPage: () => {},
                  }}
                />
                <Typography variant="h6" className={classes.title}>
                  Products Reports
                </Typography>
                <EntityTable
                  headers={[
                    { text: "id" },
                    { text: "reason" },
                    { text: "message" },
                    { text: "status" },
                    { text: "createdAt" },
                    { text: "createdBy" },
                  ]}
                  rows={data.getProduct.reports.items.map(r => [
                    { name: "id", value: r.id },
                    { name: "reason", value: r.reason },
                    { name: "message", value: r.message },
                    { name: "status", value: r.status },
                    { name: "createdAt", value: r.createdAt },
                    { name: "createdBy", value: r.createdBy!.displayName },
                  ])}
                  pagination={{
                    count: data.getProduct.reports.count,
                    page: reportPagination.page,
                    rowsPerPage: reportPagination.rowsPerPage,
                    rowsOptions: reportPagination.rowsOptions,
                    handleChangePage: (event, newPage) => {
                      Router.push(
                        `product/view?id=${
                          data.getProduct.id
                        }&unitPage=${newPage}&reportPage=${
                          reportPagination.page
                        }`,
                      );
                    },
                    handleChangeRowsPerPage: () => {},
                  }}
                />
                <Typography variant="h6" className={classes.title}>
                  Actions
                </Typography>
                <Button
                  variant="contained"
                  color="default"
                  size="large"
                  className={classes.button}
                  onClick={async () => {
                    Router.push(
                      `/product/edit?id=${this.props.data.getProduct.id}`,
                    );
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className={classes.button}
                  onClick={async () => {}}
                >
                  Report
                </Button>
                <DeleteProductComponent>
                  {deleteProduct => (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      className={classes.button}
                      onClick={async () => {
                        await deleteProduct({
                          variables: { id: this.props.data.getProduct.id },
                        });
                        Router.push("/product");
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </DeleteProductComponent>
              </Paper>
            )}
          </Style>
        ) : null}
      </Layout>
    );
  }
}
