import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";

const styles = {
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 500,
    marginTop: 20,
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
};
interface SearchBarProps extends WithStyles<typeof styles> {
  name: string;
  text: string;
  value: string;
  onChange: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const SearchBar = ({
  classes,
  value,
  onChange,
  onSubmit,
  isSubmitting,
  text,
  name,
}: SearchBarProps) => {
  return (
    <Paper className={classes.root} elevation={1}>
      <InputBase
        className={classes.input}
        placeholder={text}
        value={value}
        onChange={onChange}
        name={name}
        onKeyPress={event => {
          if (event.key === "Enter") onSubmit();
        }}
      />
      <Divider className={classes.divider} />
      <IconButton
        className={classes.iconButton}
        aria-label="Search"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default withStyles(styles)(SearchBar);
