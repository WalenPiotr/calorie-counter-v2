import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React from "react";
import createStyle from "../../../faacs/Style";
import {
  GetMealsByDateComponent,
  GetProductComponent,
  AddEntryComponent,
  AddEntryMutation,
  AddEntryMutationVariables,
  AddMealMutation,
  AddMealMutationVariables,
  AddMealComponent,
  GetMealsByDateQueryVariables,
  GetMealsByDateQuery,
} from "../../../graphql/generated/apollo";
import Checkbox from "@material-ui/core/Checkbox";
import { MutationFn } from "react-apollo";
import TableBody from "@material-ui/core/TableBody";
import { ApolloQueryResult } from "apollo-boost";

const DialogStyle = createStyle((theme: Theme) => ({
  dialog: {
    padding: theme.spacing(2),
    width: 500,
    display: "flex",
    flexDirection: "column",
  },
  formControl: {
    minWidth: 120,
  },
  menuItemBold: {
    fontWeight: theme.typography.fontWeightBold,
  },
  dialogText: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  mealInput: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(5),
    width: "100%",
  },
  dateInput: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    width: "100%",
  },
  input: {
    marginTop: theme.spacing(3),
    width: "100%",
  },
  productName: {
    paddingTop: 0,
    color: theme.palette.primary,
  },
}));

interface AddEntryControllerPassedProps {
  handleQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  quantity: string;

  tab: string;
  handleTabChange: (event: React.ChangeEvent<any>, newValue: TabOption) => void;
  newMeal: string;
  handleNewMealChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  unitId: string | null;
  handleUnitRowClick: (event: React.MouseEvent, id: string) => void;

  mealId: string | null;
  handleMealRowClick: (event: React.MouseEvent, id: string) => void;

  handleSubmit: () => void;
}
interface AddEntryControllerProps {
  children: (props: AddEntryControllerPassedProps) => React.ReactNode;
  date: Date | null;
  addMeal: MutationFn<AddMealMutation, AddMealMutationVariables>;
  addEntry: MutationFn<AddEntryMutation, AddEntryMutationVariables>;
  initialUnitId: string | null;
  initialMealId: string | null;
}

enum TabOption {
  NewMeal = "New Meal",
  SelectExisting = "Select Existing",
}

interface AddEntryControllerState {
  quantity: string;
  tab: TabOption;
  newMeal: string;
  unitId: string | null;
  mealId: string | null;
}
class AddEntryController extends React.Component<
  AddEntryControllerProps,
  AddEntryControllerState
> {
  state: AddEntryControllerState = {
    tab: TabOption.SelectExisting,
    quantity: "",
    newMeal: "",
    mealId: this.props.initialMealId,
    unitId: this.props.initialUnitId,
  };
  handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    this.setState({ quantity: event.target.value });
  };

  handleTabChange = (event: React.ChangeEvent<any>, newValue: TabOption) => {
    event.persist();
    this.setState({
      tab: newValue,
    });
  };

  handleNewMealChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    this.setState({ newMeal: event.target.value });
  };

  handleUnitRowClick = (event: React.MouseEvent, id: string) => {
    this.setState({ unitId: id });
  };

  handleMealRowClick = (event: React.MouseEvent, id: string) => {
    this.setState({ mealId: id });
  };

  handleSubmit = async () => {
    if (this.state.tab === TabOption.NewMeal) {
      const result = await this.props.addMeal({
        variables: { name: this.state.newMeal, date: this.props.date },
      });
      if (result && result.data && this.state.unitId) {
        const { unitId } = this.state;
        const quantity = parseFloat(this.state.quantity);
        await this.props.addEntry({
          variables: {
            mealId: result.data.addMeal.id,
            unitId: unitId,
            quantity,
          },
        });
      }
    } else if (
      this.state.tab === TabOption.SelectExisting &&
      this.state.mealId &&
      this.state.unitId
    ) {
      const quantity = parseFloat(this.state.quantity);
      await this.props.addEntry({
        variables: {
          mealId: this.state.mealId,
          unitId: this.state.unitId,
          quantity,
        },
      });
    }
  };

  render() {
    return this.props.children({
      quantity: this.state.quantity,
      tab: this.state.tab,
      handleQuantityChange: this.handleQuantityChange,
      handleTabChange: this.handleTabChange,
      newMeal: this.state.newMeal,
      handleNewMealChange: this.handleNewMealChange,
      unitId: this.state.unitId,
      handleUnitRowClick: this.handleUnitRowClick,
      mealId: this.state.mealId,
      handleMealRowClick: this.handleMealRowClick,
      handleSubmit: this.handleSubmit,
    });
  }
}

interface AddDialogProps {
  open: boolean;
  handleClose: () => void;
  productId: string;
}

const AddDialog = ({ handleClose, open, productId }: AddDialogProps) => (
  <AddMealComponent>
    {addMeal => (
      <AddEntryComponent>
        {addEntry => (
          <GetProductComponent variables={{ id: productId }}>
            {({ data, loading }) => {
              const renderProduct = Boolean(
                !loading && data && data.getProduct,
              );
              const units =
                !loading && data && data.getProduct.units.items.length > 0
                  ? data.getProduct.units.items
                  : [];

              if (renderProduct) {
                return (
                  <GetMealsByDateComponent variables={{ date: Date() }}>
                    {({ data: mealData, loading, refetch }) => {
                      const renderOptions = Boolean(
                        !loading &&
                          mealData &&
                          mealData.getMealsByDate &&
                          mealData.getMealsByDate.items.length > 0,
                      );
                      const meals = renderOptions
                        ? mealData!.getMealsByDate.items
                        : [];
                      if (!loading && mealData) {
                        const date = mealData!.getMealsByDate.items[0]
                          ? mealData!.getMealsByDate.items[0].date
                          : new Date();
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <AddEntryController
                              addEntry={addEntry}
                              addMeal={addMeal}
                              initialUnitId={data!.getProduct.units.items[0].id}
                              initialMealId={
                                mealData!.getMealsByDate.items[0]
                                  ? mealData!.getMealsByDate.items[0].id
                                  : null
                              }
                              date={date}
                            >
                              {({
                                quantity,
                                handleQuantityChange,
                                tab,
                                handleTabChange,
                                newMeal,
                                handleNewMealChange,
                                unitId,
                                handleUnitRowClick,
                                mealId,
                                handleMealRowClick,
                                handleSubmit,
                              }) => (
                                <DialogStyle>
                                  {({ classes }) => (
                                    <Dialog
                                      onClose={handleClose}
                                      aria-labelledby="simple-dialog-title"
                                      open={open}
                                    >
                                      <div className={classes.dialog}>
                                        <DialogTitle id="simple-dialog-title">
                                          Add food to your dairy:
                                        </DialogTitle>
                                        <DialogTitle
                                          id="simple-dialog-title"
                                          color="primary"
                                          className={classes.productName}
                                        >
                                          {data!.getProduct.name}
                                        </DialogTitle>
                                        <DialogContent>
                                          <DialogContentText>
                                            Select products unit
                                          </DialogContentText>
                                          <Table>
                                            <TableBody>
                                              {units.map((unit, index) => (
                                                <TableRow
                                                  hover
                                                  onClick={event =>
                                                    handleUnitRowClick(
                                                      event,
                                                      unit.id,
                                                    )
                                                  }
                                                  role="checkbox"
                                                  aria-checked={
                                                    unitId === unit.id
                                                  }
                                                  tabIndex={-1}
                                                  key={unit.name}
                                                  selected={unitId === unit.id}
                                                >
                                                  <TableCell padding="checkbox">
                                                    <Checkbox
                                                      checked={
                                                        unitId === unit.id
                                                      }
                                                    />
                                                  </TableCell>
                                                  <TableCell
                                                    component="th"
                                                    scope="row"
                                                    padding="none"
                                                  >
                                                    {unit.name}
                                                  </TableCell>
                                                  <TableCell align="right">
                                                    {unit.energy} kcal
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>

                                          <TextField
                                            className={classes.input}
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            name="quantity"
                                            label="Enter product quantity"
                                            type="number"
                                          />

                                          <KeyboardDatePicker
                                            margin="normal"
                                            id="mui-pickers-date"
                                            label="Select date for added product"
                                            value={date}
                                            onChange={date => {
                                              refetch({ date });
                                            }}
                                            KeyboardButtonProps={{
                                              "aria-label": "change date",
                                            }}
                                            className={classes.dateInput}
                                          />

                                          <>
                                            <Tabs
                                              value={tab}
                                              indicatorColor="primary"
                                              textColor="primary"
                                              onChange={handleTabChange}
                                            >
                                              <Tab
                                                label={TabOption.SelectExisting}
                                                value={TabOption.SelectExisting}
                                                disabled={!renderOptions}
                                              />
                                              <Tab
                                                label={TabOption.NewMeal}
                                                value={TabOption.NewMeal}
                                              />
                                            </Tabs>
                                            {tab === TabOption.SelectExisting &&
                                            renderOptions ? (
                                              <Table>
                                                <TableBody>
                                                  {meals.map((meal, index) => (
                                                    <TableRow
                                                      hover
                                                      onClick={event =>
                                                        handleMealRowClick(
                                                          event,
                                                          meal.id,
                                                        )
                                                      }
                                                      role="checkbox"
                                                      aria-checked={
                                                        mealId === meal.id
                                                      }
                                                      tabIndex={-1}
                                                      key={meal.name}
                                                      selected={
                                                        mealId === meal.id
                                                      }
                                                    >
                                                      <TableCell padding="checkbox">
                                                        <Checkbox
                                                          checked={
                                                            mealId === meal.id
                                                          }
                                                        />
                                                      </TableCell>
                                                      <TableCell component="th">
                                                        {meal.name}
                                                      </TableCell>
                                                    </TableRow>
                                                  ))}
                                                </TableBody>
                                              </Table>
                                            ) : null}
                                            {tab === TabOption.NewMeal ? (
                                              <TextField
                                                className={classes.mealInput}
                                                value={newMeal}
                                                onChange={handleNewMealChange}
                                                name="Add new meal"
                                                label="Enter new meal's name"
                                                type="text"
                                              />
                                            ) : null}
                                          </>

                                          <Button
                                            color="primary"
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            onClick={() => {
                                              handleSubmit();
                                              handleClose();
                                            }}
                                          >
                                            Add entry
                                          </Button>
                                        </DialogContent>
                                        <DialogActions>
                                          <Button
                                            onClick={handleClose}
                                            color="primary"
                                          >
                                            Cancel
                                          </Button>
                                        </DialogActions>
                                      </div>
                                    </Dialog>
                                  )}
                                </DialogStyle>
                              )}
                            </AddEntryController>
                          </MuiPickersUtilsProvider>
                        );
                      }
                      return null;
                    }}
                  </GetMealsByDateComponent>
                );
              }
              return null;
            }}
          </GetProductComponent>
        )}
      </AddEntryComponent>
    )}
  </AddMealComponent>
);

export default AddDialog;
