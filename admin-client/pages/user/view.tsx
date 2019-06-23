import React from "react";
import Layout from "../../components/Layout";
import {
  GetProductComponent,
  Role,
  GetProductDocument,
  GetProductQuery,
  DeleteProductComponent,
  GetUserDocument,
  GetUserQuery,
} from "../../graphql/generated/apollo";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import createStyle from "../../faacs/Style";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Button from "@material-ui/core/Button";
import { authorized } from "../../lib/nextjs/authorized";
import { parseString, parsePage } from "../../lib/nextjs/parseQueryString";
import { Context } from "../../types/Context";
import { redirect } from "../../lib/nextjs/redirect";
import Router from "next/router";
import BaseInfo from "../../components/BaseInfo";
import EntityTable from "../../components/Table";

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

class TablePagination {
  page: number = 0;
  rowsPerPage: number = 5;
  rowsOptions: number[] = [5];
}
class UserViewProps {
  data: GetUserQuery;
  productPagination: TablePagination;
  reportPagination: TablePagination;
}
export default class UserView extends React.Component<UserViewProps> {
  static async getInitialProps(props: Context) {
    await authorized(props, [Role.Admin]);
    const id = parseString(props.query.id);
    const productPagination = {
      ...new TablePagination(),
      page: parsePage(props.query.productPage),
    };
    const reportPagination = {
      ...new TablePagination(),
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
    }
    return {
      data,
      productPagination,
      reportPagination,
    };
  }
  render() {
    const { data, productPagination, reportPagination } = this.props;
    return (
      <Layout>
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
                    link: `/product/view?id=${p.id}`,
                  },
                ])}
                pagination={{
                  count: data.getUserById.createdProducts!.count,
                  ...productPagination,
                  handleChangePage: (event, newPage) => {
                    Router.push(
                      `/user/view?id=${
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
                    link: `/report/view?id=${r.id}`,
                  },
                ])}
                pagination={{
                  count: data!.getUserById!.createdReports!.count,
                  ...reportPagination,
                  handleChangePage: (event, newPage) => {
                    Router.push(
                      `/user/view?id=${data.getUserById.id}&productPage=${
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
                    `/user/edit?id=${this.props.data.getUserById.id}`,
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
