import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Typography from "@material-ui/core/Typography";
import Router from "next/router";
import React from "react";
import BaseInfo from "../../../components/common/BaseInfo";
import Layout from "../../../components/common/Layout";
import EntityTable, { Pagination } from "../../../components/common/Table";
import createStyle from "../../../faacs/Style";
import {
  GetUserDocument,
  GetUserQuery,
  Role,
} from "../../../graphql/generated/apollo";
import { authorized, AuthData } from "../../../lib/nextjs/authorized";
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

class UserViewProps {
  authData: AuthData;
  data: GetUserQuery;
  productPagination: Pagination;
  reportPagination: Pagination;
}
export default class UserView extends React.Component<UserViewProps> {
  static async getInitialProps(props: Context) {
    const authData = await authorized(props, [Role.Admin]);
    if (!authData.isLoggedIn) {
      redirect(props, "/access-denied");
      return;
    }
    const id = parseString(props.query.id);
    const productPagination = {
      ...new Pagination(),
      page: parsePage(props.query.productPage),
    };
    const reportPagination = {
      ...new Pagination(),
      page: parsePage(props.query.reportPage),
    };

    const { apolloClient } = props;
    const { data, errors } = await apolloClient.query({
      query: GetUserDocument,
      variables: {
        id,
        productPagination: {
          take: productPagination.rowsPerPage,
          skip: productPagination.page * productPagination.rowsPerPage,
        },
        reportPagination: {
          take: reportPagination.rowsPerPage,
          skip: reportPagination.page * reportPagination.rowsPerPage,
        },
      },
    });
    if (errors && errors.length > 0) {
      redirect(props, "/error");
      return;
    }
    return {
      authData,
      data,
      productPagination,
      reportPagination,
    };
  }
  render() {
    const { data, productPagination, reportPagination, authData } = this.props;
    return (
      <Layout authData={authData}>
        <Style>
          {({ classes }) => (
            <Paper className={classes.paper}>
              <Typography variant="h4" className={classes.title}>
                User
              </Typography>
              <BaseInfo
                data={[
                  { name: "id", value: data.getUserById.id },
                  { name: "displayName", value: data.getUserById.displayName },
                  { name: "email", value: data.getUserById.email },
                  { name: "role", value: data.getUserById.role },
                  { name: "provider", value: data.getUserById.provider },
                  { name: "status", value: data.getUserById.status },
                  { name: "createdAt", value: data.getUserById.createdAt },
                  { name: "updated", value: data.getUserById.updatedAt },
                ]}
              />
              <Typography variant="h6" className={classes.title}>
                Created Products
              </Typography>
              <EntityTable
                headers={[
                  { text: "id" },
                  { text: "name" },
                  { text: "createdAt" },
                  { text: "units (count)" },
                  { text: "view" },
                ]}
                rows={data!.getUserById!.createdProducts!.items.map(p => [
                  {
                    value: p.id,
                  },
                  {
                    value: p.name,
                  },
                  {
                    value: p.createdAt,
                  },
                  {
                    value: p.units.count,
                  },
                  {
                    value: "view",
                    link: `/admin/product/view?id=${p.id}`,
                  },
                ])}
                pagination={{
                  count: data.getUserById.createdProducts!.count,
                  ...productPagination,
                  handleChangePage: (event, newPage) => {
                    Router.push(
                      `/admin/user/view?id=${
                        data.getUserById.id
                      }&productPage=${newPage}&reportPage=${
                        this.props.reportPagination.page
                      }`,
                    );
                  },
                  handleChangeRowsPerPage: () => {},
                }}
              />
              <Typography variant="h6" className={classes.title}>
                Filed Reports
              </Typography>

              <EntityTable
                headers={[
                  { text: "id" },
                  { text: "product name" },
                  { text: "message" },
                  { text: "reason" },
                  { text: "status" },
                  { text: "createdAt" },
                  { text: "view" },
                ]}
                rows={data!.getUserById!.createdReports!.items.map(r => [
                  {
                    value: r.id,
                  },
                  {
                    value: r.product.name,
                  },
                  {
                    value: r.message,
                  },
                  {
                    value: r.reason,
                  },
                  {
                    value: r.status,
                  },
                  {
                    value: r.createdAt,
                  },
                  {
                    value: "view",
                    link: `/admin/report/view?id=${r.id}`,
                  },
                ])}
                pagination={{
                  count: data!.getUserById!.createdReports!.count,
                  ...reportPagination,
                  handleChangePage: (event, newPage) => {
                    Router.push(
                      `/admin/user/view?id=${data.getUserById.id}&productPage=${
                        this.props.reportPagination.page
                      }&reportPage=${newPage}`,
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
                color="primary"
                size="large"
                className={classes.button}
                onClick={async () => {
                  Router.push(
                    `/admin/user/edit?id=${this.props.data.getUserById.id}`,
                  );
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                className={classes.button}
                onClick={async () => {}}
              >
                Ban
              </Button>
            </Paper>
          )}
        </Style>
      </Layout>
    );
  }
}
