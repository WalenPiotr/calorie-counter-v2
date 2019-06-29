import { TextField } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
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
} from "../../graphql/generated/apollo";
import { AuthData, authorized } from "../../lib/nextjs/authorized";
import { parseString } from "../../lib/nextjs/parseQueryString";
import { redirect } from "../../lib/nextjs/redirect";
import { Context } from "../../types/Context";
import Button from "@material-ui/core/Button";
import { zeroDate } from "../../helpers/date";

interface EditRowControllerPassedProps {
  id: string | null;
  inputQuantity: string | null;
  currentUnitId: string | null;
  handleQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUnitChange: (event: React.ChangeEvent<HTMLInputElement<any>>) => void;
  set: (
    id: string | null,
    initalQuantity: number | null,
    currentUnitId: string | null,
  ) => void;
}
interface EditRowControllerState {
  id: string | null;
  inputQuantity: string | null;
  currentUnitId: string | null;
}
interface EditRowControllerProps {
  children: (props: EditRowControllerPassedProps) => React.ReactNode;
}
class EditRowController extends React.Component<
  EditRowControllerProps,
  EditRowControllerState
> {
  state: EditRowControllerState = {
    id: null,
    inputQuantity: null,
    currentUnitId: null,
  };
  set = (
    id: string | null,
    initialQuantity: number | null,
    initialUnitId: string | null,
  ) => {
    this.setState({
      id,
      inputQuantity:
        initialQuantity === null ? initialQuantity : initialQuantity.toString(),
      currentUnitId: initialUnitId,
    });
  };
  handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    this.setState({
      inputQuantity: event.target.value,
    });
  };

  handleUnitChange = (event: React.ChangeEvent<any>) => {
    event.persist();
    this.setState({
      currentUnitId: event.target.value,
    });
  };

  render() {
    return this.props.children({
      id: this.state.id,
      inputQuantity: this.state.inputQuantity,
      currentUnitId: this.state.currentUnitId,
      set: this.set,
      handleQuantityChange: this.handleQuantityChange,
      handleUnitChange: this.handleUnitChange,
    });
  }
}

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
  inputQuantity: string | null,
  currentUnitId: string | null,
): number => {
  const base = meal.entries.items.reduce(
    (prev: number, curr: Entry) => prev + curr.unit.energy * curr.quantity,
    0,
  );
  if (id === null || inputQuantity === null || currentUnitId === null) {
    return base;
  }
  const updatedEntry = meal.entries.items.filter(e => e.id === id)[0];
  const newUnit = updatedEntry.unit.product.units.items.filter(
    u => u.id === currentUnitId,
  )[0];
  const newQuantity = parseFloat(inputQuantity);
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
  currentUnitId: string | null,
  entry: Entry,
): string =>
  id === entry.id
    ? entry.unit.product.units.items
        .filter(u => u.id === currentUnitId)[0]
        .energy.toString() + " kcal"
    : entry.unit.energy.toString() + " kcal";

const dynamicEntryValue = (
  id: string | null,
  currentUnitId: string | null,
  inputQuantity: string | null,
  entry: Entry,
) =>
  id === entry.id && inputQuantity !== null
    ? (
        entry.unit.product.units.items.filter(u => u.id === currentUnitId)[0]
          .energy * parseFloat(inputQuantity)
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
      redirect(props, "/access-denied");
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
        <GetMyEnergyValueComponent variables={{ date }}>
          {({ data: totalData, refetch: totalRefetch, loading }) => {
            console.log(totalData);
            return !loading &&
              totalData &&
              totalData.getMyEnergyValue !== null &&
              totalData.getMyEnergyValue !== undefined ? (
              <GetMealsByDateComponent variables={{ date }}>
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
                          {data.getMealsByDate.items.map(meal =>
                            meal.entries.items.length > 0 ? (
                              <MealComponent
                                key={meal.id}
                                meal={meal as Meal}
                                refresh={refresh}
                              />
                            ) : null,
                          )}
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
  topBox: {
    display: "flex",
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
  input: {
    width: 100,
  },
}));

interface MealComponentProps {
  meal: Meal;
  refresh: () => void;
}

const MealComponent = ({ meal, refresh }: MealComponentProps) => (
  <EditRowController>
    {({
      id,
      inputQuantity,
      currentUnitId,
      handleQuantityChange,
      handleUnitChange,
      set,
    }) => (
      <MealComponentStyle>
        {({ classes }) => (
          <Table
            top={
              <div className={classes.topBox}>
                <IconButton>
                  <MoreIcon />
                </IconButton>
                <Typography variant="h6">{meal.name}</Typography>
              </div>
            }
            bottom={
              <div className={classes.bottomBox}>
                <Typography variant="subtitle2">
                  {meal.name}'s total ={" "}
                  {mealTotal(meal as Meal, id, inputQuantity, currentUnitId)}{" "}
                  kcal
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
              { text: "" },
            ]}
            rows={meal.entries.items.map(entry => [
              { value: entry.unit.product.name },
              {
                component:
                  id === entry.id ? (
                    <TextField
                      value={inputQuantity}
                      type="number"
                      onChange={handleQuantityChange}
                      className={classes.input}
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
                        value={currentUnitId}
                        onChange={handleUnitChange}
                        inputProps={{
                          name: "",
                          id: "unit-simple",
                        }}
                      >
                        {entry.unit.product.units.items.map(u => (
                          <MenuItem value={u.id}>{u.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    entry.unit.name
                  ),
              },
              {
                value: dynamicEntryUnit(id, currentUnitId, entry as Entry),
              },
              {
                value: dynamicEntryValue(
                  id,
                  currentUnitId,
                  inputQuantity,
                  entry as Entry,
                ),
              },
              {
                align: "right",
                component: (
                  <OptionMenu
                    meal={meal as Meal}
                    entry={entry as Entry}
                    refresh={refresh}
                    id={id}
                    inputQuantity={inputQuantity}
                    currentUnitId={currentUnitId}
                    set={set}
                  />
                ),
              },
            ])}
          />
        )}
      </MealComponentStyle>
    )}
  </EditRowController>
);

const OptionMenuStyle = createStyle((theme: Theme) => ({
  actionGroup: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row-reverse",
    marginLeft: "auto",
  },
}));

interface OptionMenuProps {
  meal: Meal;
  entry: Entry;
  refresh: () => void;
  id: string | null;
  inputQuantity: string | null;
  currentUnitId: string | null;
  set: (
    id: string | null,
    initalQuantity: number | null,
    currentUnitId: string | null,
  ) => void;
}

const OptionMenu = ({
  meal,
  entry,
  refresh,
  id,
  inputQuantity,
  currentUnitId,
  set,
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
                <UpdateEntryComponent>
                  {update => (
                    <Button
                      size={"small"}
                      onClick={async () => {
                        if (inputQuantity && currentUnitId) {
                          await update({
                            variables: {
                              id: id,
                              newEntry: {
                                quantity: parseFloat(inputQuantity),
                                unitId: currentUnitId,
                                mealId: meal.id,
                              },
                            },
                          });
                          refresh();
                        }
                      }}
                    >
                      Save
                    </Button>
                  )}
                </UpdateEntryComponent>

                <Button
                  size={"small"}
                  onClick={() => {
                    set(null, null, null);
                  }}
                >
                  Cancel
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
                  set(entry.id, entry.quantity, entry.unit.id);
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
