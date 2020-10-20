import { taamei } from "./regularExpressions";

export const removeTaamei = (word: string): [string, number[]] => {
  // https://stackoverflow.com/questions/4590298/how-to-ignore-whitespace-in-a-regular-expression-subject-string
  const globalTaamei = new RegExp(taamei.source, "gu");
  let noTaamei: string = "";
  const charPos: number[] = [];

  // builds a string with no taamei, while keeping track of the index
  for (const [index, element] of [...word].entries()) {
    if (!globalTaamei.test(element)) {
      noTaamei += element;
      charPos.push(index);
    }
  }
  return [noTaamei, charPos];
};
