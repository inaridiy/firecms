import { singularize } from "./inflection";

export const relationTableName = (
  column: string,
  name1: string,
  name2: string
) => {
  return `${singularize(name1)}_to_${singularize(name2)}_for_${column}`;
};

export const relationIdName = (name: string) => {
  return `${singularize(name)}_id`;
};
