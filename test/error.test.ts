import { Text } from "../src/index";

describe.each`
  description              | hebrew                | errorMssg
  ${"Text without niqqud"} | ${"בראשית ברא אלהים"} | ${"Text must contain niqqud"}
`("$description", ({ hebrew, errorMssg }) => {
  test("", () => {
    expect(() => new Text(hebrew)).toThrow(errorMssg);
  });
});
