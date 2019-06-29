import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import React from "react";
import createStyle from "../../controllers/Style";
import {
  ProductInputWithValidation,
  UnitInputWithValidation,
} from "../../graphql/withValidation";

interface FormControllerPassedProps {
  unitFormValues: UnitFormValues[];
  unitErrorValues: UnitFormError[];
  productFormValues: ProductFormValues;
  productErrorValues: ProductFormError;
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
  handleSubmit: () => void;
}

class FormControllerProps {
  maxUnits: number = 5;
  handleSubmit: (
    values: FormValues,
    setErrors: (errors: Partial<FormErrors>) => void,
  ) => void;
  initialValues: FormValues = new FormValues();
  children!: (props: FormControllerPassedProps) => React.ReactNode;
}
class UnitFormValues {
  name: string = "";
  energy: string = "";
  [key: string]: string;
}
class UnitFormError {
  name: string[] = [];
  energy: string[] = [];
  [key: string]: string[];
}

class ProductFormValues {
  name: string = "";
  [key: string]: string;
}
class ProductFormError {
  name: string[] = [];
  [key: string]: string[];
}

class FormErrors {
  units: UnitFormError[] = [new UnitFormError()];
  product: ProductFormError = new ProductFormError();
}

class FormValues {
  units: UnitFormValues[] = [new UnitFormValues()];
  product: ProductFormValues = new ProductFormValues();
}

class FormControllerState {
  values: FormValues = new FormValues();
  errors: FormErrors = new FormErrors();
}

const validate = (values: FormValues): FormErrors => {
  let errors = new FormErrors();
  errors.units = values.units.map(_ => new UnitFormError());
  const err = validateSync(
    plainToClass(ProductInputWithValidation, values.product),
  );
  for (const e of err) {
    errors.product[e.property] = Object.entries(e.constraints).map(
      ([k, v]) => v as string,
    );
  }
  for (const [index, unitFormValue] of values.units.entries()) {
    const obj = {
      name: unitFormValue.name,
      energy: parseFloat(unitFormValue.energy),
    };
    const err = validateSync(plainToClass(UnitInputWithValidation, obj));
    for (const e of err) {
      errors.units[index][e.property] = Object.entries(e.constraints).map(
        ([k, v]) => v as string,
      );
    }
  }
  return errors;
};

const initializeErrors = (values: FormValues) => {
  const formErrors = new FormErrors();
  const unitErrors = values.units.map(u => new UnitFormError());
  formErrors.units = unitErrors;
  return formErrors;
};

export class FormController extends React.PureComponent<
  FormControllerProps,
  FormControllerState
> {
  static defaultProps = new FormControllerProps();

  state: FormControllerState = {
    values: this.props.initialValues,
    errors: new FormErrors(),
  };

  handleProductChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    event.persist();
    await this.setState(prevState => {
      const values = {
        ...prevState.values,
        product: {
          ...prevState.values.product,
          [event.target.name]: event.target.value,
        },
      };
      const errors = initializeErrors(values);
      return {
        ...prevState,
        errors,
        values,
      };
    });
  };

  handleUnitChange = (index: number) => async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    event.persist();
    await this.setState(prevState => {
      let unitFormValues = [...prevState.values.units];
      unitFormValues[index] = {
        ...unitFormValues[index],
        [event.target.name]: event.target.value,
      };
      const values = {
        ...prevState.values,
        units: unitFormValues,
      };
      const errors = initializeErrors(values);
      return {
        ...prevState,
        values,
        errors,
      };
    });
  };
  addFormGroup = async () => {
    await this.setState(prevState => {
      const values = {
        ...prevState.values,
        units: [...prevState.values.units, new UnitFormValues()],
      };
      const errors = initializeErrors(values);

      return {
        ...prevState,
        values,
        errors,
      };
    });
  };
  deleteFormGroup = (index: number) => async () => {
    await this.setState(prevState => {
      if (prevState.values.units.length > 1) {
        let unitFormValues = [...prevState.values.units];
        unitFormValues.splice(index, 1);
        const values = {
          ...prevState.values,
          units: unitFormValues,
        };
        const errors = initializeErrors(values);
        return {
          ...prevState,
          values,
          errors,
        };
      }
      return prevState;
    });
  };

  setErrors = (errors: Partial<FormErrors>) => {
    this.setState(prevState => ({
      ...prevState,
      errors: { ...prevState.errors, ...errors },
    }));
  };

  handleSubmit = () => {
    const errors = validate(this.state.values);
    if (this.areValuesValid(errors)) {
      this.props.handleSubmit(this.state.values, this.setErrors);
    } else {
      this.setState({ errors });
    }
  };

  areValuesValid = (errors: FormErrors): boolean => {
    for (const e of Object.entries(errors.product)) {
      const [_, v] = e;
      if (v.length > 0) {
        return false;
      }
    }
    for (const unitErrors of errors.units) {
      for (const e of Object.entries(unitErrors)) {
        const [_, v] = e;
        if (v.length > 0) {
          return false;
        }
      }
    }
    return true;
  };

  render() {
    return this.props.children({
      productFormValues: this.state.values.product,
      productErrorValues: this.state.errors.product,
      unitFormValues: this.state.values.units,
      unitErrorValues: this.state.errors.units,
      handleProductChange: this.handleProductChange,
      handleUnitChange: this.handleUnitChange,
      addFormGroup: this.addFormGroup,
      deleteFormGroup: this.deleteFormGroup,
      isDeleteButtonDisabled: this.state.values.units.length <= 1,
      isAddUnitButtonDisabled:
        this.state.values.units.length >= this.props.maxUnits,
      isSubmitButtonDisabled: false,
      handleSubmit: this.handleSubmit,
    });
  }
}

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
    marginTop: theme.spacing(4),
  },
  deleteIcon: {
    color: theme.palette.error.main,
  },
  title: {
    textTransform: "uppercase",
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

interface FormViewProps extends FormControllerPassedProps {
  submitText: string;
  titleText: string;
}

export const FormView = ({
  unitFormValues,
  unitErrorValues,
  handleUnitChange,
  productFormValues,
  productErrorValues,
  handleProductChange,
  addFormGroup,
  deleteFormGroup,
  isDeleteButtonDisabled,
  isAddUnitButtonDisabled,
  isSubmitButtonDisabled,
  handleSubmit,
  submitText,
  titleText,
}: FormViewProps) => (
  <Style>
    {({ classes }) => (
      <Paper className={classes.paper}>
        <Typography variant="h6" className={classes.title}>
          {titleText}
        </Typography>
        {/* <Divider variant="fullWidth" className={classes.mainDivider} /> */}
        <Typography variant="subtitle1">Please enter product's data</Typography>
        <TextField
          label="product name"
          name="product name"
          value={productFormValues.name}
          error={productErrorValues.name.length > 0}
          helperText={
            productErrorValues.name.length > 0
              ? productErrorValues.name.toString()
              : ""
          }
          onChange={handleProductChange}
          margin="normal"
          // variant="outlined"
          fullWidth
          className={classes.field}
        />
        {/* <Divider variant="fullWidth" className={classes.mainDivider} /> */}
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
            {/* <Divider variant="fullWidth" className={classes.divider} /> */}
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
              label="unit's name"
              name="name"
              fullWidth
              // variant="outlined"
              className={classes.field}
              onChange={handleUnitChange(i)}
              error={unitErrorValues[i].name.length > 0}
              helperText={
                unitErrorValues[i].name.length > 0
                  ? unitErrorValues[i].name.toString()
                  : ""
              }
            />
            <TextField
              value={values.energy}
              label="unit's energy"
              name="energy"
              type="number"
              fullWidth
              // variant="outlined"
              className={classes.field}
              onChange={handleUnitChange(i)}
              error={unitErrorValues[i].energy.length > 0}
              helperText={
                unitErrorValues[i].energy.length > 0
                  ? unitErrorValues[i].energy.toString()
                  : ""
              }
            />
          </div>
        ))}
        {/* <Divider variant="fullWidth" className={classes.mainDivider} /> */}
        <Button
          variant="contained"
          size="large"
          color="primary"
          fullWidth
          disabled={isSubmitButtonDisabled}
          onClick={handleSubmit}
          className={classes.submitButton}
        >
          {submitText}
        </Button>
      </Paper>
    )}
  </Style>
);
