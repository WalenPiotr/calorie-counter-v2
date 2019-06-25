import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React from "react";
import createStyle from "../faacs/Style";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Link from "next/link";

const Style = createStyle((theme: Theme) => ({
  table: { width: "auto" },
  header: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

interface BaseInfoProps {
  data: { name: string; value: string; link?: string }[];
}

const BaseInfo = ({ data }: BaseInfoProps) => {
  return (
    <Style>
      {({ classes }) => (
        <Table className={classes.table}>
          <TableBody>
            {data.map(({ name, value, link }) => (
              <TableRow key={name}>
                <TableCell>
                  <Typography variant="body1" className={classes.header}>
                    {name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {link ? (
                    <Link href={link}>
                      <a>{value}</a>
                    </Link>
                  ) : (
                    <span>{value}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Style>
  );
};

export default BaseInfo;
