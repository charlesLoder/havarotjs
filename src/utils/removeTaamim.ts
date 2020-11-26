import { taamim } from "./regularExpressions";

export const removeTaamim = (word: string): [string, number[]] => {
  // https://stackoverflow.com/questions/4590298/how-to-ignore-whitespace-in-a-regular-expression-subject-string
  const globalTaamim = new RegExp(taamim.source, "gu");
  let noTaamim: string = "";
  const charPos: number[] = [];

  // builds a string with no taamim, while keeping track of the index
  for (const [index, element] of [...word].entries()) {
    if (!globalTaamim.test(element)) {
      noTaamim += element;
      charPos.push(index);
    }
  }
  return [noTaamim, charPos];
};
