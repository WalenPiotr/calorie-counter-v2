import React from "react";
import { Context } from "../../types/Context";
import Layout from "../../components/Layout";
import { redirect } from "../../lib/nextjs/redirect";
import { AuthData, authorized } from "../../lib/nextjs/authorized";
import { parsePage } from "../../lib/nextjs/parseQueryString";
import {
  Role,
  GetDaysWithMealsDocument,
  GetDaysWithMealsQuery,
} from "../../graphql/generated/apollo";
import Table from "../../components/Table";
import Router from "next/router";

interface LogsIndexProps {
  authData: AuthData;
  data: GetDaysWithMealsQuery;
  pagination: {
    rowsPerPage: number;
    page: number;
    rowsOptions: number[];
  };
}

class LogsIndex extends React.Component<LogsIndexProps> {
  static async getInitialProps(props: Context) {
    const authData = await authorized(props, [Role.User, Role.Admin]);
    if (!authData.isLoggedIn) {
      redirect(props, "/please-login");
      return;
    }
    const page = parsePage(props.query.page);
    const rowsPerPage = 7;
    const { apolloClient } = props;
    const { data, errors } = await apolloClient.query({
      query: GetDaysWithMealsDocument,
      variables: {
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
      pagination: {
        rowsPerPage,
        page,
        rowsOptions: [rowsPerPage],
      },
    };
  }

  handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => {
    Router.push({
      pathname: "/food",
      query: {
        page: newPage,
      },
    });
  };

  handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    Router.push({
      pathname: "/food",
      query: {
        page: 0,
      },
    });
  };

  render() {
    const { authData, data, pagination } = this.props;
    return (
      <Layout authData={authData}>
        <Table
          headers={[{ text: "date" }, { text: "mealCount" }, { text: "total" }]}
          rows={data.getDaysWithMyMeals.items.map(i => [
            {
              value: i.date,
            },
            { value: i.mealCount },
            { value: i.total },
          ])}
          pagination={{
            count: data.getDaysWithMyMeals.count,
            handleChangePage: this.handleChangePage,
            handleChangeRowsPerPage: this.handleChangeRowsPerPage,
            ...pagination,
          }}
        />
      </Layout>
    );
  }
}
export default LogsIndex;
