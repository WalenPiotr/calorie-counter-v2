import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Link from "next/link";
import React from "react";
import createStyle from "../../faacs/Style";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number,
  ) => void;
}

const ActionStyles = createStyle((theme: Theme) => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props: TablePaginationActionsProps) {
  const { count, page, rowsPerPage, onChangePage } = props;
  function handleFirstPageButtonClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    onChangePage(event, 0);
  }
  function handleBackButtonClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    onChangePage(event, page - 1);
  }
  function handleNextButtonClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    onChangePage(event, page + 1);
  }
  function handleLastPageButtonClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  }
  return (
    <ActionStyles>
      {({ classes, theme }) => (
        <div className={classes.root}>
          <IconButton
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="First Page"
          >
            {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
          </IconButton>
          <IconButton
            onClick={handleBackButtonClick}
            disabled={page === 0}
            aria-label="Previous Page"
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </IconButton>
          <IconButton
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Next Page"
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </IconButton>
          <IconButton
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="Last Page"
          >
            {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
          </IconButton>
        </div>
      )}
    </ActionStyles>
  );
}

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

interface Field {
  value: string;
  link?: string;
  component?: React.ReactNode;
}
interface Header {
  text: string;
}

export class Pagination {
  page: number = 0;
  rowsPerPage: number = 5;
  rowsOptions: number[] = [5];
}

interface TableProps {
  headers: Header[];
  rows: Field[][];
  pagination: {
    count: number;
    page: number;
    rowsPerPage: number;
    rowsOptions: number[];
    handleChangePage: (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
      newPage: number,
    ) => void;
    handleChangeRowsPerPage: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
  };
}

export default function EntityTable({ rows, headers, pagination }: TableProps) {
  return (
    <Style>
      {({ classes }) => (
        <div className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {headers.map((header, i) => (
                  <TableCell
                    align={i === 0 ? "inherit" : "right"}
                    key={header.text}
                  >
                    {header.text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i} hover>
                  {row.map((field, j) => (
                    <TableCell align={j === 0 ? "inherit" : "right"} key={j}>
                      {field.link ? (
                        <Link href={field.link}>
                          <a>{field.value}</a>
                        </Link>
                      ) : field.component ? (
                        field.component
                      ) : (
                        <span>{field.value}</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={pagination.rowsOptions}
                  count={pagination.count}
                  rowsPerPage={pagination.rowsPerPage}
                  page={pagination.page}
                  SelectProps={{
                    inputProps: { "aria-label": "Rows per page" },
                    native: true,
                  }}
                  onChangePage={pagination.handleChangePage}
                  onChangeRowsPerPage={pagination.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </Style>
  );
}
