import { Text } from "../src/index";

// Test for throwing errors
describe.each`
  description              | hebrew                            | errorMssg
  ${"Text without niqqud"} | ${"בראשית ברא אלהים"}             | ${"Text must contain niqqud"}
  ${"Text with numbers"}   | ${"1 בְּרֵאשִׁית בָּרָא אֱלֹהִים"} | ${"Text should not contain non-Hebrew text"}
  ${"Text with English"}   | ${"HEllO הָעֹולָם"}               | ${"Text should not contain non-Hebrew text"}
`("$description", ({ hebrew, errorMssg }) => {
  test("", () => {
    expect(() => new Text(hebrew)).toThrow(errorMssg);
  });
});

// Test should not throw error
describe.each`
  description       | hebrew
  ${"Regular Text"} | ${"בְּרֵאשִׁית בָּרָא אֱלֹהִים"}
  ${"Only Mater"}   | ${"קוּם"}
`("$description", ({ hebrew }) => {
  test("", () => {
    expect(() => new Text(hebrew)).not.toThrow();
  });
});
