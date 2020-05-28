# havarot

A Typescript package for getting syllabic data about Hebrew text with niqqud.

## example

```typescript
import { Text } from "havarot";

const heb: string = "וְשָׁמַרְתָּ֖";
const text: Text = new Text(heb);
const sylText: string[] = text.syllables.map(syl => syl.text);

>>> ["וְשָׁ", "מַרְ", "תָּ֖"]
```

## Contributing

See the [TODO](./TODO.md) list for some ideas of what needs to get done.
Of feel free to open an issue or pull request.

See the [terms list](./terms.md) for a list of naming convention.
