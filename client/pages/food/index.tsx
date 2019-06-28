import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Formik } from "formik";
import Router from "next/router";
import React from "react";
import { Context } from "react-apollo";
import Layout from "../../components/common/Layout";
import SearchBar from "../../components/common/SearchBar";
import Table from "../../components/common/Table";
import {
  Role,
  SearchFoodsDocument,
  SearchFoodsQuery,
} from "../../graphql/generated/apollo";
import { AuthData, authorized } from "../../lib/nextjs/authorized";
import {
  parsePage,
  parseRowsPerPage,
  parseString,
} from "../../lib/nextjs/parseQueryString";
import { redirect } from "../../lib/nextjs/redirect";
import AddIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import createStyle from "../../faacs/Style";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
const Style = createStyle((theme: Theme) => ({
  paper: {
    padding: theme.spacing(3),
  },
}));

interface ProductsProps {
  authData: AuthData;
  data: SearchFoodsQuery;
  name: string;
  rowsPerPage: number;
  page: number;
  rowsOptions: number[];
}

class Products extends React.Component<ProductsProps> {
  static async getInitialProps(props: Context) {
    const authData = await authorized(props, [Role.User, Role.Admin]);
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
      query: SearchFoodsDocument,
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
      pathname: "/food",
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
      pathname: "/food",
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
        <Style>
          {({ classes }) => (
            <Paper className={classes.paper}>
              <Formik
                initialValues={{ name: this.props.name }}
                onSubmit={async ({ name }, { setSubmitting }) => {
                  setSubmitting(true);
                  Router.push({
                    pathname: "/food",
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
                      { text: "name" },
                      { text: "unit name" },
                      { text: "unit energy [kcal]" },
                      { text: "available units count" },
                      { text: "" },
                    ]}
                    rows={data.searchProducts.items.map(i => [
                      { value: i.name },
                      {
                        value:
                          i.units.items.length > 0
                            ? i.units.items[0].name
                            : "None",
                      },
                      {
                        value:
                          i.units.items.length > 0
                            ? i.units.items[0].energy.toString()
                            : "None",
                      },
                      { value: i.units.count.toString() },
                      {
                        component: (
                          <IconButton
                            size="small"
                            onClick={() => {
                              Router.push({
                                pathname: "/food/add",
                                query: {
                                  id: i.id,
                                },
                              });
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        ),
                      },
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
          )}
        </Style>
      </Layout>
    );
  }
}

export default Products;
