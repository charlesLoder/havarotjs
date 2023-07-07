import { Text } from "../src/index";
import { Char } from "../src/char";

describe("cluster:", () => {
  test("if no cluster, null", () => {
    const char = new Char("ד");
    expect(char.cluster).toEqual(null);
  });

  test("ensure cluster text matches", () => {
    const text = new Text("דָּבָר");
    const firstChar = text.chars[0];
    const firstCluster = text.clusters[0];
    expect(firstChar.cluster?.text).toEqual(firstCluster.text);
  });
});
