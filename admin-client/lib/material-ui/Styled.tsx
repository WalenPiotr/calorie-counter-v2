import withStyles, {
  StyleRules,
  StyleRulesCallback,
  WithStyles,
} from "@material-ui/core/styles/withStyles";
import * as React from "react";

interface StyledProps<
  T extends string | StyleRules | StyleRulesCallback = string
> {
  children: (props: WithStyles<T, true>) => React.ReactNode;
}
interface InjectedProps {
  classes: any;
  theme: any;
}

function createStyled<ClassKey extends string>(
  styles: StyleRulesCallback<ClassKey> | StyleRules<ClassKey>,
): React.ComponentType<StyledProps<typeof styles>> {
  class Styled extends React.Component<
    StyledProps<typeof styles> & InjectedProps
  > {
    render() {
      return this.props.children({
        classes: this.props.classes,
        theme: this.props.theme,
      });
    }
  }
  return withStyles(styles, { withTheme: true })(Styled);
}
export default createStyled;
