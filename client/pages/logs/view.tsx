import React from "react";
import Layout from "../../components/common/Layout";
import {
  GetDaysWithMealsQuery,
  GetMealsByDateDocument,
  Role,
  GetMealsByDateQuery,
  Meal,
  Entry,
  GetMyEnergyValueDocument,
  GetMyEnergyValueQuery,
} from "../../graphql/generated/apollo";
import { AuthData, authorized } from "../../lib/nextjs/authorized";
import { parseString } from "../../lib/nextjs/parseQueryString";
import { redirect } from "../../lib/nextjs/redirect";
import { Context } from "../../types/Context";
import Table from "../../components/common/Table";
import { Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import createStyle from "../../faacs/Style";
import Paper from "@material-ui/core/Paper";

const Style = createStyle((theme: Theme) => ({
  topBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  bottomBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row-reverse",
    padding: theme.spacing(2),
    width: "100%",
  },
  titleBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(3),
  },
}));

interface LogsIndexProps {
  authData: AuthData;
  data: GetMealsByDateQuery;
  pagination: {
    rowsPerPage: number;
    page: number;
    rowsOptions: number[];
  };
  date: Date;
  totalData: GetMyEnergyValueQuery;
}

const mealTotal = (meal: Meal): number => {
  return meal.entries.items.reduce(
    (prev: number, curr: Entry) => prev + curr.unit.energy * curr.quantity,
    0,
  );
};
const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

class LogsIndex extends React.Component<LogsIndexProps> {
  static async getInitialProps(props: Context) {
    const authData = await authorized(props, [Role.User, Role.Admin]);
    if (!authData.isLoggedIn) {
      redirect(props, "/access-denied");
      return;
    }
    const date = new Date(parseString(props.query.date));
    const { apolloClient } = props;
    const { data, errors } = await apolloClient.query({
      query: GetMealsByDateDocument,
      variables: {
        date: date,
      },
    });

    if (errors && errors.length > 0) {
      redirect(props, "/error");
      return;
    }
    const { data: totalData, errors: totalErrors } = await apolloClient.query({
      query: GetMyEnergyValueDocument,
      variables: {
        date: date,
      },
    });
    if (totalErrors && totalErrors.length > 0) {
      redirect(props, "/error");
      return;
    }
    return {
      authData,
      data,
      date,
      totalData,
    };
  }

  render() {
    const { authData, data, totalData } = this.props;
    const date = new Date(this.props.date);
    return (
      <Style>
        {({ classes }) => (
          <Layout authData={authData}>
            <Paper className={classes.paper}>
              <div className={classes.titleBox}>
                <div>
                  <Typography variant="h6">Food Dairy</Typography>
                  <Typography variant="subtitle2" color={"textSecondary"}>
                    {date.toLocaleDateString("en-EN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    {isToday(date) ? " (Today)" : ""}
                  </Typography>
                </div>
                <div>
                  <Typography variant="h6">
                    {isToday(date) ? "This day's total" : "Today's total"}
                  </Typography>
                  <Typography variant="h4" align="right" color={"primary"}>
                    {totalData.getMyEnergyValue}
                  </Typography>
                </div>
              </div>

              {data.getMealsByDate.items.map(meal =>
                meal.entries.items.length > 0 ? (
                  <Table
                    top={
                      <div className={classes.topBox}>
                        <Typography variant="h6">{meal.name}</Typography>
                      </div>
                    }
                    bottom={
                      <div className={classes.bottomBox}>
                        <Typography variant="subtitle2">
                          {meal.name}'s total = {mealTotal(meal as Meal)} kcal
                        </Typography>
                      </div>
                    }
                    key={meal.id}
                    headers={[
                      { text: "product name" },
                      { text: "quantity" },
                      { text: "unit name" },
                      { text: "unit energy" },
                      { text: "entry energy" },
                    ]}
                    rows={meal.entries.items.map(entry => [
                      { value: entry.unit.product.name },
                      { value: entry.quantity.toString() },
                      { value: entry.unit.name },
                      { value: entry.unit.energy.toString() + " kcal" },
                      {
                        value:
                          (entry.unit.energy * entry.quantity).toString() +
                          " kcal",
                      },
                    ])}
                  />
                ) : null,
              )}
            </Paper>
          </Layout>
        )}
      </Style>
    );
  }
}
export default LogsIndex;
