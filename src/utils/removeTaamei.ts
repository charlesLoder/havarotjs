export const removeTaamei = (word: string): [string, number[]] => {
  // https://stackoverflow.com/questions/4590298/how-to-ignore-whitespace-in-a-regular-expression-subject-string
  const taamei = /[\u{0591}-\u{05AF}\u{05BF}\u{05C0}\u{05C3}-\u{05C6}\u{05F3}\u{05F4}]/gu;
  let noTaamei: string = "";
  let charPos: number[] = [];

  // builds a string with no taamei, while keeping track of the index
  for (const [index, element] of [...word].entries()) {
    if (!taamei.test(element)) {
      noTaamei += element;
      charPos.push(index);
    }
  }
  return [noTaamei, charPos];
};
