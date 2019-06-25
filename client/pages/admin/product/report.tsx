import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Formik } from "formik";
import React from "react";
import Layout from "../../../components/Layout";
import createStyle from "../../../faacs/Style";
import { ReportReason } from "../../../graphql/generated/apollo";

const Style = createStyle((theme: Theme) => ({
  paper: {
    width: 500,
    paddingTop: 40,
    paddingBottom: 40,
    paddingRight: 60,
    paddingLeft: 60,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    minWidth: 120,
    width: "auto",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  title: {
    textTransform: "uppercase",
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

class ReportValues {
  message: string = "";
  reason: string = "";
}

interface ReportProductProps {}

export default class ReportProduct extends React.Component<ReportProductProps> {
  render() {
    return (
      <Layout>
        <Formik initialValues={new ReportValues()} onSubmit={() => {}}>
          {({ values, handleChange }) => (
            <Style>
              {({ classes }) => (
                <Paper className={classes.paper}>
                  <Typography variant="h6" className={classes.title}>
                    Report product
                  </Typography>
                  <TextField
                    label="message"
                    name="message"
                    value={values.message}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    className={classes.field}
                  />
                  <FormControl className={classes.formControl} fullWidth>
                    <InputLabel htmlFor="reason">Reason</InputLabel>
                    <Select
                      value={values.reason}
                      onChange={handleChange}
                      input={<OutlinedInput labelWidth={50} name="age" />}
                    >
                      {Object.entries(ReportReason).map(([k, v]) => (
                        <MenuItem value={v} key={k}>
                          {v}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    className={classes.button}
                    color="primary"
                  >
                    Report Product
                  </Button>
                </Paper>
              )}
            </Style>
          )}
        </Formik>
      </Layout>
    );
  }
}
