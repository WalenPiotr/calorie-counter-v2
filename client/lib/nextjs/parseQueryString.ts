export const parseRowsPerPage = (
  val: string | string[] | undefined,
  acceptedValues: number[] = [5, 10, 15],
): number => {
  if (val !== undefined && typeof val === "string") {
    const parsedRows = parseInt(val);
    if (parsedRows && acceptedValues.indexOf(parsedRows) >= 0) {
      return parsedRows;
    }
  }
  return acceptedValues[0];
};

export const parseString = (val: string | string[] | undefined): string => {
  if (val !== undefined && typeof val === "string") {
    return val;
  }
  return "";
};

export const parsePage = (val: string | string[] | undefined): number => {
  if (val !== undefined && typeof val === "string") {
    const parsed = parseInt(val);
    if (parsed) {
      return parsed;
    }
  }
  return 0;
};
