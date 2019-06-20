import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { transformAndValidate } from "class-transformer-validator";
import React from "react";
import Layout from "../../components/Layout";
import createStyle from "../../faacs/Style";
import {
  ProductInputWithValidation,
  UnitInputWithValidation,
} from "../../graphql/generated/withValidation";

const Style = createStyle((theme: Theme) => ({
  paper: {
    width: 500,
    paddingTop: 40,
    paddingBottom: 40,
    paddingRight: 60,
    paddingLeft: 60,
    margin: "0 auto",
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
  },
  mainDivider: {
    backgroundColor: "black",
    marginTop: 10,
    marginBottom: 10,
  },
  field: {
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  titleGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteIcon: {
    color: theme.palette.error.main,
  },
  title: {
    textTransform: "uppercase",
  },
}));

interface UnitFormControllerPassedProps {
  unitFormValues: UnitFormValues[];
  productFormValues: ProductFormValues;
  handleUnitChange: (
    index: number,
  ) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleProductChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  addFormGroup: () => void;
  deleteFormGroup: (index: number) => () => void;
  isDeleteButtonDisabled: boolean;
  isAddUnitButtonDisabled: boolean;
  isSubmitButtonDisabled: boolean;
}

class FormControllerProps {
  maxUnits: number = 5;
  children!: (props: UnitFormControllerPassedProps) => React.ReactNode;
}
class UnitFormValues {
  name: string = "";
  energy: string = "";
  [key: string]: string;
}
class UnitFormError {
  name: string[] | null = null;
  energy: string[] | null = null;
  [key: string]: string[] | null;
}

class ProductFormValues {
  name: string = "";
  [key: string]: string;
}
class ProductFormError {
  name: string[] | null = null;
  [key: string]: string[] | null;
}

class FormErrors {
  units: UnitFormError[] = [];
  product: ProductFormError = new ProductFormError();
}

class FormValues {
  units: UnitFormValues[] = [new UnitFormValues()];
  product: ProductFormValues = new ProductFormValues();
}

class FormControllerState {
  values: FormValues = new FormValues();
}

class FormController extends React.Component<
  FormControllerProps,
  FormControllerState
> {
  static defaultProps = new FormControllerProps();
  state = new FormControllerState();

  handleProductChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    event.persist();
    this.setState(prevState => ({
      ...prevState,
      values: {
        ...prevState.values,
        product: {
          ...prevState.values.product,
          [event.target.name]: event.target.value,
        },
      },
    }));
  };

  handleUnitChange = (index: number) => async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    event.persist();
    this.setState(prevState => {
      let unitFormValues = [...prevState.values.units];
      unitFormValues[index] = {
        ...unitFormValues[index],
        [event.target.name]: event.target.value,
      };
      return {
        ...prevState,
        values: {
          ...prevState.values,
          units: unitFormValues,
        },
      };
    });
  };
  addFormGroup = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        values: {
          ...prevState.values,
          units: [...prevState.values.units, new UnitFormValues()],
        },
      };
    });
  };
  deleteFormGroup = (index: number) => () => {
    this.setState(prevState => {
      if (prevState.values.units.length > 1) {
        let unitFormValues = [...prevState.values.units];
        unitFormValues.splice(index, 1);
        return {
          ...prevState,
          values: {
            ...prevState.values,
            units: unitFormValues,
          },
        };
      }
      return prevState;
    });
  };

  validate = async (): Promise<FormErrors> => {
    let errors = new FormErrors();
    errors.units = this.state.values.units.map(_ => new UnitFormError());
    try {
      await transformAndValidate(
        ProductInputWithValidation,
        this.state.values.product,
      );
    } catch (err) {
      for (const e of err) {
        errors.product[e.property] = Object.entries(e.constraints).map(
          ([k, v]) => v as string,
        );
      }
    }

    for (const [index, unitFormValue] of this.state.values.units.entries()) {
      console.log(index);

      const obj = {
        name: unitFormValue.name,
        energy: parseFloat(unitFormValue.energy),
      };
      try {
        await transformAndValidate(UnitInputWithValidation, obj);
      } catch (err) {
        for (const e of err) {
          errors.units[index][e.property] = Object.entries(e.constraints).map(
            ([k, v]) => v as string,
          );
        }
      }
    }
    return errors;
  };
  render() {
    this.validate()
      .then(errors => console.log())
      .catch(err => console.error(err));

    console.log(this.state);
    return this.props.children({
      productFormValues: this.state.values.product,
      unitFormValues: this.state.values.units,
      handleProductChange: this.handleProductChange,
      handleUnitChange: this.handleUnitChange,
      addFormGroup: this.addFormGroup,
      deleteFormGroup: this.deleteFormGroup,
      isDeleteButtonDisabled: this.state.values.units.length <= 1,
      isAddUnitButtonDisabled:
        this.state.values.units.length >= this.props.maxUnits,
      isSubmitButtonDisabled: false,
    });
  }
}

class NewProductProps {}

class ProductNew extends React.Component<NewProductProps> {
  render() {
    return (
      <Layout>
        <FormController>
          {({
            unitFormValues,
            handleUnitChange,
            productFormValues,
            handleProductChange,
            addFormGroup,
            deleteFormGroup,
            isDeleteButtonDisabled,
            isAddUnitButtonDisabled,
            isSubmitButtonDisabled,
          }) => (
            <Style>
              {({ classes }) => (
                <Paper className={classes.paper}>
                  <Typography variant="h6" className={classes.title}>
                    Add new product
                  </Typography>
                  <Divider
                    variant="fullWidth"
                    className={classes.mainDivider}
                  />
                  <Typography variant="subtitle1">
                    Please enter product's data
                  </Typography>

                  <TextField
                    label="name"
                    name="name"
                    value={productFormValues.name}
                    onChange={handleProductChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    className={classes.field}
                  />
                  <Divider
                    variant="fullWidth"
                    className={classes.mainDivider}
                  />
                  <div className={classes.titleGroup}>
                    <Typography variant="subtitle1">
                      Please enter product's units
                    </Typography>
                    <Button
                      color="primary"
                      onClick={addFormGroup}
                      disabled={isAddUnitButtonDisabled}
                    >
                      Add next unit
                    </Button>
                  </div>
                  {unitFormValues.map((values, i) => (
                    <div key={i}>
                      <Divider
                        variant="fullWidth"
                        className={classes.divider}
                      />
                      <div className={classes.titleGroup}>
                        <Typography>Please enter unit's data</Typography>
                        <Button
                          onClick={deleteFormGroup(i)}
                          disabled={isDeleteButtonDisabled}
                          className={classes.deleteIcon}
                        >
                          Delete Unit
                        </Button>
                      </div>
                      <TextField
                        value={values.name}
                        label="name"
                        name="name"
                        fullWidth
                        variant="outlined"
                        className={classes.field}
                        onChange={handleUnitChange(i)}
                      />
                      <TextField
                        value={values.energy}
                        label="energy"
                        name="energy"
                        type="number"
                        fullWidth
                        variant="outlined"
                        className={classes.field}
                        onChange={handleUnitChange(i)}
                      />
                    </div>
                  ))}
                  <Divider
                    variant="fullWidth"
                    className={classes.mainDivider}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    fullWidth
                    disabled={isSubmitButtonDisabled}
                  >
                    Add new product
                  </Button>
                </Paper>
              )}
            </Style>
          )}
        </FormController>
      </Layout>
    );
  }
}
export default ProductNew;
