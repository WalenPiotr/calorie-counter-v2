import React from "react";
import Layout from "../../components/Layout";
import {
  GetProductComponent,
  Role,
  GetProductDocument,
  GetProductQuery,
  DeleteProductComponent,
} from "../../graphql/generated/apollo";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import createStyle from "../../faacs/Style";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Button from "@material-ui/core/Button";
import { authorized } from "../../lib/nextjs/authorized";
import { parseString } from "../../lib/nextjs/parseQueryString";
import { Context } from "../../types/Context";
import { redirect } from "../../lib/nextjs/redirect";
import Router from "next/router";

const Style = createStyle((theme: Theme) => ({
  table: { width: "auto" },
  paper: {
    padding: theme.spacing(5),
    display: "inline-block",
    margin: "0 auto",
  },
  title: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  header: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

class ProductViewProps {
  data: GetProductQuery;
}
export default class ProductView extends React.Component<ProductViewProps> {
  static async getInitialProps(props: Context) {
    await authorized(props, [Role.Admin]);
    const id = parseString(props.query.id);
    const { apolloClient } = props;
    const { data, errors } = await apolloClient.query({
      query: GetProductDocument,
      variables: { id },
    });
    if (errors && errors.length > 0) {
      redirect(props, "/error");
    }
    return {
      data,
    };
  }
  render() {
    const { data } = this.props;
    return (
      <Layout>
        <Style>
          {({ classes }) => (
            <Paper className={classes.paper}>
              <Typography variant="h4" className={classes.title}>
                Product
              </Typography>
              <Table className={classes.table}>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" className={classes.header}>
                        name
                      </Typography>
                    </TableCell>
                    <TableCell>{data!.getProduct.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" className={classes.header}>
                        createdAt
                      </Typography>
                    </TableCell>
                    <TableCell>{data!.getProduct.createdAt}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" className={classes.header}>
                        createdBy (displayName)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {data!.getProduct.createdBy!.displayName}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Typography variant="h6" className={classes.title}>
                Products Units
              </Typography>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" className={classes.header}>
                        id
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" className={classes.header}>
                        name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" className={classes.header}>
                        energy
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={classes.table}>
                  {data!.getProduct.units.items.map((u, i) => (
                    <TableRow>
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.energy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography variant="h6" className={classes.title}>
                Products Reports
              </Typography>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" className={classes.header}>
                        id
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" className={classes.header}>
                        reason
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" className={classes.header}>
                        message
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" className={classes.header}>
                        status
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" className={classes.header}>
                        createdAt
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" className={classes.header}>
                        createdBy (displayName)
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={classes.table}>
                  {data!.getProduct.reports.items.map((r, i) => (
                    <TableRow>
                      <TableCell>{r.id}</TableCell>
                      <TableCell>{r.reason}</TableCell>
                      <TableCell>{r.message}</TableCell>
                      <TableCell>{r.status}</TableCell>
                      <TableCell>{r.createdAt}</TableCell>
                      <TableCell>{r.createdBy!.displayName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography variant="h6" className={classes.title}>
                Actions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                onClick={async () => {
                  Router.push(
                    `/product/edit?id=${this.props.data.getProduct.id}`,
                  );
                }}
              >
                Edit
              </Button>

              <DeleteProductComponent>
                {deleteProduct => (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    className={classes.button}
                    onClick={async () => {
                      await deleteProduct({
                        variables: { id: this.props.data.getProduct.id },
                      });
                      Router.push("/product");
                    }}
                  >
                    Delete
                  </Button>
                )}
              </DeleteProductComponent>
            </Paper>
          )}
        </Style>
      </Layout>
    );
  }
}