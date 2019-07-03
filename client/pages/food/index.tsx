import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import AddIcon from "@material-ui/icons/AddCircle";
import { Formik } from "formik";
import Router from "next/router";
import React from "react";
import { Context } from "react-apollo";
import Layout from "../../components/Layout";
import SearchBar from "../../components/SearchBar";
import Table from "../../components/Table";
import createStyle from "../../controllers/Style";
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

const Style = createStyle((theme: Theme) => ({
  paper: {
    padding: theme.spacing(3),
  },
  formControl: {
    width: theme.spacing(12),
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

interface UnitControllerPassedProps {
  productToUnit: Map<string, string>;
  handleChange: (
    productId: string,
  ) => (event: React.ChangeEvent<{ name: string; value: string }>) => void;
}
interface UnitControllerProps {
  initialProductToUnit: Map<string, string>;
  children: (props: UnitControllerPassedProps) => React.ReactNode;
}
interface UnitControllerState {
  productToUnit: Map<string, string>;
}

class UnitController extends React.Component<
  UnitControllerProps,
  UnitControllerState
> {
  state: UnitControllerState = {
    productToUnit: this.props.initialProductToUnit,
  };
  handleChange = (productId: string) => (
    event: React.ChangeEvent<{ name: string; value: string }>,
  ) => {
    event.persist();
    this.setState(
      (prevState: UnitControllerState): UnitControllerState => {
        const productToUnit = new Map(prevState.productToUnit);
        productToUnit.set(productId, event.target.value);
        return { ...prevState, productToUnit };
      },
    );
  };
  render() {
    return this.props.children({
      productToUnit: this.state.productToUnit,
      handleChange: this.handleChange,
    });
  }
}

class Products extends React.Component<ProductsProps> {
  static async getInitialProps(props: Context) {
    const authData = await authorized(props, [Role.User, Role.Admin]);
    if (!authData.isLoggedIn) {
      redirect(props, "/please-login");
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
                  <UnitController
                    initialProductToUnit={
                      new Map(
                        data.searchProducts.items.map(product => [
                          product.id,
                          product.units.items[0].id,
                        ]),
                      )
                    }
                  >
                    {({ productToUnit, handleChange }) => (
                      <Table
                        headers={[
                          { text: "name" },
                          { text: "unit name" },
                          { text: "unit energy [kcal]" },
                          { text: "available units count" },
                          { text: "" },
                        ]}
                        rows={data.searchProducts.items.map(product => [
                          { value: product.name },
                          {
                            component:
                              product.units.items.length > 0 ? (
                                <FormControl
                                  className={classes.formControl}
                                  disabled={product.units.items.length <= 1}
                                >
                                  <InputLabel htmlFor="unit">Unit</InputLabel>
                                  <Select
                                    value={productToUnit.get(product.id)}
                                    onChange={handleChange(product.id)}
                                    inputProps={{
                                      name: "unit",
                                      id: "unit",
                                    }}
                                  >
                                    {product.units.items.map(unit => (
                                      <MenuItem value={unit.id} key={unit.id}>
                                        {unit.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              ) : (
                                <div>None</div>
                              ),
                          },
                          {
                            value:
                              product.units.items.length > 0
                                ? product.units.items.filter(
                                    unit =>
                                      unit.id === productToUnit.get(product.id),
                                  )[0].energy
                                : "None",
                          },
                          { value: product.units.count.toString() },
                          {
                            component: (
                              <IconButton
                                onClick={() => {
                                  Router.push({
                                    pathname: "/food/add",
                                    query: {
                                      id: product.id,
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
                    )}
                  </UnitController>
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
