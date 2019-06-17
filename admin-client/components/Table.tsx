import Paper from "@material-ui/core/Paper";
import { Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import createStyle from "../faacs/Style";
import { User } from "../graphql/generated/apollo";

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
  fields: { field: string; name?: string }[];
  rows: Array<any>;
}

export default function EntityTable({ rows, fields }: TableProps) {
  return (
    <Style>
      {({ classes }) => (
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Table className={classes.table} size="small">
              <TableHead>
                <TableRow>
                  {fields.map((f, i) => (
                    <TableCell
                      align={i === 0 ? "inherit" : "right"}
                      key={f.field}
                    >
                      {f.name ? f.name : f.field}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id} hover>
                    {fields.map((f, i) => (
                      <TableCell
                        align={i === 0 ? "inherit" : "right"}
                        key={f.field}
                      >
                        {row[f.field]}
                      </TableCell>
                    ))}
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
