export const ALLOWED_FILTERS = [
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "contain",
] as const;
export const FILTER_SQL_OPERATORS = {
  eq: "=",
  neq: "!=",
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
  contain: "like",
} as const;

export const parseFilters = <T extends Readonly<string[]>>(
  filtersStr: string,
  allowedOperators: T
): {
  field: string;
  operator: T[number];
  value: string;
}[] => {
  let filters = filtersStr.split(",").map((filter) => {
    const [field, operator, value] = filter.split(":");
    return {
      field,
      operator,
      value,
    };
  });
  if (allowedOperators)
    filters = filters.filter((filter) =>
      allowedOperators.includes(filter.operator)
    );
  return filters;
};
