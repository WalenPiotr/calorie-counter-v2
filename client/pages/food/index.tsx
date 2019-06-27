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
import AddDialog from "../../components/default/product/AddEntryDialog";
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

interface IdControllerPassedProps {
  set: (id: string) => void;
  id: string | null;
  clear: () => void;
}
interface IdControllerProps {
  children: (props: IdControllerPassedProps) => React.ReactNode;
}
interface IdControllerState {
  id: string | null;
}
class IdController extends React.Component<
  IdControllerProps,
  IdControllerState
> {
  state: IdControllerState = {
    id: null,
  };
  set = (id: string) => {
    this.setState({ id });
  };
  clear = () => {
    this.setState({ id: null });
  };
  render() {
    return this.props.children({
      id: this.state.id,
      set: this.set,
      clear: this.clear,
    });
  }
}

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
      <IdController>
        {({ id, set, clear }) => (
          <>
            <Layout authData={authData}>
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
              <Paper>
                {data && data.searchProducts && data.searchProducts.items ? (
                  <>
                    <Toolbar>
                      <Typography variant="h6" id="tableTitle">
                        Click product to add to food dairy
                      </Typography>
                    </Toolbar>
                    <Table
                      headers={[
                        { text: "id" },
                        { text: "name" },
                        { text: "unit name" },
                        { text: "unit energy [kcal]" },
                        { text: "available units count" },
                      ]}
                      rows={data.searchProducts.items.map(i => [
                        { value: i.id },
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
                      ])}
                      onRowClick={(event, index) => {
                        set(data.searchProducts.items[index].id);
                      }}
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
            {id ? (
              <AddDialog
                open={Boolean(id)}
                handleClose={clear}
                productId={id}
              />
            ) : null}
          </>
        )}
      </IdController>
    );
  }
}

export default Products;
