import { TextField } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Typography from "@material-ui/core/Typography";
import MoreIcon from "@material-ui/icons/MoreVert";
import React from "react";
import Layout from "../../components/Layout";
import Table from "../../components/Table";
import MenuController from "../../controllers/Menu";
import createStyle from "../../controllers/Style";
import {
  Entry,
  GetMealsByDateComponent,
  GetMealsByDateQuery,
  GetMyEnergyValueComponent,
  GetMyEnergyValueQuery,
  Meal,
  RemoveEntryComponent,
  Role,
  UpdateEntryComponent,
  RemoveMealComponent,
  UpdateMealComponent,
} from "../../graphql/generated/apollo";
import { AuthData, authorized } from "../../lib/nextjs/authorized";
import { parseString } from "../../lib/nextjs/parseQueryString";
import { redirect } from "../../lib/nextjs/redirect";
import { Context } from "../../types/Context";
import Button from "@material-ui/core/Button";
import { zeroDate } from "../../helpers/date";
import ToggleController from "../../controllers/Toggle";
import { Formik } from "formik";
import { plainToClass } from "class-transformer";
import {
  EntryInputWithValidation,
  MealInputWithValidation,
} from "../../graphql/withValidation";
import { validateSync } from "class-validator";
import StateController from "../../controllers/StateController";

const Style = createStyle((theme: Theme) => ({
  paper: {
    padding: theme.spacing(3),
  },
  notFound: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(10),
  },
}));

const mealTotal = (
  meal: Meal,
  id: string | null,
  quantity: string,
  unitId: string,
): number => {
  const base = meal.entries.items.reduce(
    (prev: number, curr: Entry) => prev + curr.unit.energy * curr.quantity,
    0,
  );
  if (id === null || quantity === "" || unitId === "") {
    return base;
  }
  const updatedEntry = meal.entries.items.filter(e => e.id === id)[0];
  const newUnit = updatedEntry.unit.product.units.items.filter(
    u => u.id === unitId,
  )[0];
  if (!newUnit) {
    return NaN;
  }
  const newQuantity = parseFloat(quantity);
  const update =
    -updatedEntry.quantity * updatedEntry.unit.energy +
    newUnit.energy * newQuantity;
  return base + update;
};
const isToday = (someDate: Date) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

const dynamicEntryUnit = (
  id: string | null,
  unitId: string,
  entry: Entry,
): string =>
  id === entry.id && unitId !== ""
    ? entry.unit.product.units.items
        .filter(u => u.id === unitId)[0]
        .energy.toString() + " kcal"
    : entry.unit.energy.toString() + " kcal";

const dynamicEntryValue = (
  id: string | null,
  unitId: string,
  quantity: string,
  entry: Entry,
) =>
  id === entry.id && quantity !== "" && unitId !== ""
    ? (
        entry.unit.product.units.items.filter(u => u.id === unitId)[0].energy *
        parseFloat(quantity)
      ).toString() + " kcal"
    : (entry.unit.energy * entry.quantity).toString() + " kcal";

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

class Log extends React.Component<LogsIndexProps> {
  static async getInitialProps(props: Context) {
    const authData = await authorized(props, [Role.User, Role.Admin]);
    if (!authData.isLoggedIn) {
      redirect(props, "/please-login");
      return;
    }
    const date = zeroDate(new Date(parseString(props.query.date)));
    return {
      authData,
      date,
    };
  }

  render() {
    const { authData } = this.props;
    const date = new Date(this.props.date);
    return (
      <Layout authData={authData}>
        <GetMyEnergyValueComponent
          variables={{ date }}
          fetchPolicy="network-only"
        >
          {({ data: totalData, refetch: totalRefetch, loading }) => {
            return !loading &&
              totalData &&
              totalData.getMyEnergyValue !== null &&
              totalData.getMyEnergyValue !== undefined ? (
              <GetMealsByDateComponent
                variables={{ date }}
                fetchPolicy="network-only"
              >
                {({ data, refetch, loading }) => {
                  const refresh = () => {
                    refetch({ date });
                    totalRefetch({ date });
                  };
                  return !loading && data && data.getMealsByDate ? (
                    <Style>
                      {({ classes }) => (
                        <Paper className={classes.paper}>
                          <LogTop date={date} totalData={totalData} />
                          {data.getMealsByDate.items.map(meal => (
                            <MealComponent
                              key={meal.id}
                              meal={meal as Meal}
                              refresh={refresh}
                            />
                          ))}
                          {data.getMealsByDate.items.length === 0 ? (
                            <Typography
                              variant="h5"
                              align="center"
                              className={classes.notFound}
                            >
                              No meal found for this day
                            </Typography>
                          ) : null}
                        </Paper>
                      )}
                    </Style>
                  ) : null;
                }}
              </GetMealsByDateComponent>
            ) : null;
          }}
        </GetMyEnergyValueComponent>
      </Layout>
    );
  }
}
export default Log;

const LogTopStyle = createStyle((theme: Theme) => ({
  titleBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1),
  },
}));

interface LogIndexTopProps {
  date: Date;
  totalData: any;
}

const LogTop = ({ date, totalData }: LogIndexTopProps) => (
  <LogTopStyle>
    {({ classes }) => (
      <div className={classes.titleBox}>
        <div>
          <Typography variant="h6">Food Dairy</Typography>
          <Typography variant="subtitle2" color={"textSecondary"}>
            {date.toLocaleDateString("en-EN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
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
    )}
  </LogTopStyle>
);

const MealComponentStyle = createStyle((theme: Theme) => ({
  bottomBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row-reverse",
    padding: theme.spacing(2),
    width: "100%",
  },
  input: {
    width: 100,
  },
}));

interface MealComponentProps {
  meal: Meal;
  refresh: () => void;
}

const MealComponent = ({ meal, refresh }: MealComponentProps) => (
  <StateController<{ id: string | null }> initialState={{ id: null }}>
    {({ set: setId, state: { id } }) => (
      <UpdateEntryComponent>
        {update => (
          <Formik
            initialValues={{
              quantity: "",
              unit: "",
            }}
            onSubmit={async (
              { quantity, unit },
              { setErrors, setSubmitting },
            ) => {
              if (id !== null) {
                setSubmitting(true);
                const newEntry = {
                  quantity: parseFloat(quantity),
                  unitId: unit,
                  mealId: meal.id,
                };
                const errors = validateSync(
                  plainToClass(EntryInputWithValidation, newEntry),
                );
                if (errors.length > 0) {
                  setSubmitting(false);
                  close();
                  setErrors(
                    errors.reduce(
                      (prev, curr) => ({
                        ...prev,
                        [curr.property]: Object.values(curr.constraints)[0],
                      }),
                      {},
                    ),
                  );
                  return;
                }
                await update({
                  variables: {
                    id: id,
                    newEntry,
                  },
                });
                setId({ id: null });
                setSubmitting(false);
                refresh();
              }
            }}
          >
            {({ values, errors, handleChange, handleSubmit, setValues }) => (
              <MealComponentStyle>
                {({ classes }) => (
                  <Table
                    top={<TopComponent meal={meal} refresh={refresh} />}
                    bottom={
                      <div className={classes.bottomBox}>
                        <Typography variant="subtitle2">
                          {meal.name}
                          {"'s total = "}
                          {mealTotal(
                            meal as Meal,
                            id,
                            values.quantity,
                            values.unit,
                          )}
                          {" kcal"}
                        </Typography>
                      </div>
                    }
                    key={meal.id}
                    headers={[
                      { text: "", align: "right", padding: "checkbox" },
                      { text: "product name", align: "left" },
                      { text: "quantity" },
                      { text: "unit name" },
                      { text: "unit energy" },
                      { text: "entry energy" },
                    ]}
                    rows={meal.entries.items.map(entry => [
                      {
                        align: "right",
                        padding: "checkbox",
                        component: (
                          <OptionMenu
                            meal={meal as Meal}
                            entry={entry as Entry}
                            refresh={refresh}
                            id={id}
                            setId={({ id }) => {
                              setValues({
                                quantity: entry.quantity.toString(),
                                unit: entry.unit.id,
                              });
                              setId({ id });
                            }}
                            handleSubmit={handleSubmit}
                          />
                        ),
                      },
                      { value: entry.unit.product.name, align: "left" },
                      {
                        component:
                          id === entry.id ? (
                            <TextField
                              value={values.quantity}
                              name="quantity"
                              type="number"
                              onChange={handleChange}
                              className={classes.input}
                              error={Boolean(errors.quantity)}
                              helperText={
                                Boolean(errors.quantity) ? errors.quantity : ""
                              }
                            />
                          ) : (
                            entry.quantity.toString()
                          ),
                      },
                      {
                        value:
                          id === entry.id ? (
                            <FormControl className={classes.input}>
                              <Select
                                value={values.unit}
                                onChange={handleChange}
                                inputProps={{
                                  name: "unit",
                                  id: "unit-simple",
                                }}
                              >
                                {entry.unit.product.units.items.map(u => (
                                  <MenuItem key={u.id} value={u.id}>
                                    {u.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            entry.unit.name
                          ),
                      },
                      {
                        value: dynamicEntryUnit(id, values.unit, entry),
                      },
                      {
                        value: dynamicEntryValue(
                          id,
                          values.unit,
                          values.quantity,
                          entry,
                        ),
                      },
                    ])}
                  />
                )}
              </MealComponentStyle>
            )}
          </Formik>
        )}
      </UpdateEntryComponent>
    )}
  </StateController>
);

interface TopComponentProps {
  meal: Pick<Meal, "id" | "name" | "date">;
  refresh: () => void;
}

const TopComponentStyle = createStyle((theme: Theme) => ({
  topBox: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
}));

const TopComponent = ({ meal, refresh }: TopComponentProps) => (
  <UpdateMealComponent>
    {update => (
      <ToggleController>
        {({ isOpen, open, close, toggle }) => (
          <Formik
            initialValues={{
              name: meal.name,
            }}
            onSubmit={async ({ name }, { setSubmitting, setErrors }) => {
              setSubmitting(true);
              const newMeal = {
                name,
                date: new Date(meal.date),
              };
              const errors = validateSync(
                plainToClass(MealInputWithValidation, newMeal),
              );
              if (errors.length > 0) {
                setSubmitting(false);
                close();
                setErrors(
                  errors.reduce(
                    (prev, curr) => ({
                      ...prev,
                      [curr.property]: Object.values(curr.constraints)[0],
                    }),
                    {},
                  ),
                );
                return;
              }
              await update({
                variables: { data: { newMeal, id: meal.id } },
              });
              setSubmitting(false);
              close();
              refresh();
            }}
          >
            {({ handleChange, values, handleSubmit, errors }) => (
              <TopComponentStyle>
                {({ classes }) => (
                  <MenuController>
                    {({ anchorEl, handleClose, handleMenu }) => (
                      <div className={classes.topBox}>
                        <>
                          <IconButton onClick={handleMenu}>
                            <MoreIcon />
                          </IconButton>
                          <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                          >
                            <MenuItem
                              onClick={async () => {
                                open();
                              }}
                            >
                              Edit
                            </MenuItem>
                            <RemoveMealComponent>
                              {remove => (
                                <MenuItem
                                  onClick={async () => {
                                    await remove({
                                      variables: {
                                        data: { id: meal.id },
                                      },
                                    });
                                    handleClose();
                                    refresh();
                                  }}
                                >
                                  Delete
                                </MenuItem>
                              )}
                            </RemoveMealComponent>
                          </Menu>
                        </>
                        {isOpen ? (
                          <>
                            <TextField
                              label="meal name"
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                              error={Boolean(errors.name)}
                              helperText={
                                Boolean(errors.name) ? errors.name : ""
                              }
                            />
                            <Button onClick={() => handleSubmit()}>Save</Button>
                          </>
                        ) : (
                          <Typography variant="h6">{meal.name}</Typography>
                        )}
                      </div>
                    )}
                  </MenuController>
                )}
              </TopComponentStyle>
            )}
          </Formik>
        )}
      </ToggleController>
    )}
  </UpdateMealComponent>
);

const OptionMenuStyle = createStyle((theme: Theme) => ({
  actionGroup: {
    width: 50,
    margin: "0 auto",
  },
}));

interface OptionMenuProps {
  meal: Meal;
  entry: Entry;
  refresh: () => void;
  id: string | null;
  setId: (state: { id: string | null }) => void;
  handleSubmit: () => void;
}

const OptionMenu = ({
  entry,
  refresh,
  id,
  setId,
  handleSubmit,
}: OptionMenuProps) => (
  <MenuController>
    {({ anchorEl, handleClose, handleMenu }) => (
      <OptionMenuStyle>
        {({ classes }) => (
          <>
            {id === null ? (
              <div className={classes.actionGroup}>
                <IconButton size="small" onClick={handleMenu}>
                  <MoreIcon />
                </IconButton>
              </div>
            ) : id === entry.id ? (
              <div className={classes.actionGroup}>
                <Button size={"small"} onClick={handleSubmit}>
                  Save
                </Button>
              </div>
            ) : null}

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={async () => {
                  setId({ id: entry.id });
                  handleClose();
                }}
              >
                Edit
              </MenuItem>
              <RemoveEntryComponent>
                {remove => (
                  <MenuItem
                    onClick={async () => {
                      await remove({
                        variables: {
                          id: entry.id,
                        },
                      });
                      refresh();
                    }}
                  >
                    Delete
                  </MenuItem>
                )}
              </RemoveEntryComponent>
            </Menu>
          </>
        )}
      </OptionMenuStyle>
    )}
  </MenuController>
);
