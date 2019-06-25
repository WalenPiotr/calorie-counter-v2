import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Formik } from "formik";
import Router from "next/router";
import React, { Component } from "react";
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
import Field from "@material-ui/core/Input";

interface ProductsProps {
  authData: AuthData;
  data: SearchFoodsQuery;
  name: string;
  rowsPerPage: number;
  page: number;
  rowsOptions: number[];
}

export interface SimpleDialogProps {
  open: boolean;
  handleClose: (value: string) => void;
}
interface AddEntryControllerPassedProps {
  handleDateChange: (date: Date | null) => void;
  handleQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  date: Date | null;
  quantity: string;
}
interface AddEntryControllerProps {
  children: (props: AddEntryControllerPassedProps) => React.ReactNode;
}
interface AddEntryControllerState {
  date: Date | null;
  quantity: string;
}
class AddEntryController extends React.Component<
  AddEntryControllerProps,
  AddEntryControllerState
> {
  state = {
    date: null,
    quantity: "",
  };
  handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    this.setState({ quantity: event.target.value });
  };
  handleDateChange = (date: Date | null) => {
    this.setState({ date });
  };
  render() {
    return this.props.children({
      date: this.state.date,
      quantity: this.state.quantity,
      handleDateChange: this.handleDateChange,
      handleQuantityChange: this.handleQuantityChange,
    });
  }
}



const AddDialog = ({ handleClose, open }: SimpleDialogProps) => {
  const selectedDate = new Date("2014-08-18T00:00:00Z");
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <AddEntryController>
        {({ date, handleDateChange, quantity, handleQuantityChange }) => (
          <Dialog
            onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            open={open}
          >
            <DialogTitle id="simple-dialog-title">Add entry</DialogTitle>
            <KeyboardDatePicker
              margin="normal"
              id="mui-pickers-date"
              label="Date picker"
              value={date}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <Field
              value={quantity}
              onChange={handleQuantityChange}
              name="quantity"
              label="quantity"
            />
          </Dialog>
        )}
      </AddEntryController>
    </MuiPickersUtilsProvider>
  );
};

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
              <Table
                headers={[
                  { text: "id" },
                  { text: "name" },
                  { text: "unit name" },
                  { text: "unit energy [kcal]" },
                  { text: "available units count" },
                  { text: "add" },
                ]}
                rows={data.searchProducts.items.map(i => [
                  { value: i.id },
                  { value: i.name },
                  {
                    value:
                      i.units.items.length > 0 ? i.units.items[0].name : "None",
                  },
                  {
                    value:
                      i.units.items.length > 0
                        ? i.units.items[0].energy.toString()
                        : "None",
                  },
                  { value: i.units.count.toString() },
                  {
                    value: "add",
                    component: (
                      <Button
                        onClick={() => {
                          console.log("click");
                        }}
                      >
                        Add
                      </Button>
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
          <AddDialog open={true} handleClose={() => console.log("close")} />
        </Paper>
      </Layout>
    );
  }
}

export default Products;
