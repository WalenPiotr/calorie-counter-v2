import Paper from "@material-ui/core/Paper";
import { Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import createStyle from "../../faacs/Style";
import { User } from "../../graphql/generated/apollo";

const Style = createStyle((theme: Theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    marginTop: theme.spacing(3),
    width: "100%",
    overflowX: "auto",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
}));

interface TableProps {
  rows: Array<
    { __typename?: "User" } & Pick<
      User,
      | "id"
      | "email"
      | "displayName"
      | "role"
      | "provider"
      | "status"
      | "createdAt"
      | "updatedAt"
    >
  >;
}

export default function UsersTable({ rows }: TableProps) {
  return (
    <Style>
      {({ classes }) => (
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>id</TableCell>
                  <TableCell align="right">email</TableCell>
                  <TableCell align="right">displayName</TableCell>
                  <TableCell align="right">role</TableCell>
                  <TableCell align="right">provider</TableCell>
                  <TableCell align="right">status</TableCell>
                  <TableCell align="right">createdAt</TableCell>
                  <TableCell align="right">updatedAt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id} hover>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="right">{row.email}</TableCell>
                    <TableCell align="right">{row.displayName}</TableCell>
                    <TableCell align="right">{row.role}</TableCell>
                    <TableCell align="right">{row.provider}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                    <TableCell align="right">{row.createdAt}</TableCell>
                    <TableCell align="right">{row.updatedAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      )}
    </Style>
  );
}
