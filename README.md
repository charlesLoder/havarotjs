# havarot

A Typescript package for getting syllabic data about Hebrew text with niqqud.

## example

```typescript
import { Text } from "havarot";
const heb: string = "אֱלֹהִים";
const text: Text = new Text(heb);
const sylText = text.syllables.map((syl) => syl.text);
sylText;
//
//  [
//    "אֱ"
//    "לֹ"
//    "הִים"
//  ]
```

## DOCS

The general idea of this package is that a [`Text`](#Text) is composed of [`Words`](#Word) which are composed of [`Syllables`](#Syllable) which are composed of [`Clusters`](#Cluster) which are composed of [`Characters`](#Character).

### Text

`Text()` requires an input string.

```typescript
import { Text } from "havarot";
const text: Text = new Text("הֲבָרֹות");
```

#### Text.original

Returns the original string.

```typescript
import { Text } from "havarot";
const text: Text = new Text("הֲבָרֹות");
text.original;
// "הֲבָרֹות"
```

#### Text.text

Returns a string that has been decomposed, sequenced, and qamets qatan patterns converted to the appropriate unicode character (U+05C7).

```typescript
import { Text } from "havarot";
const text: Text = new Text("וַתָּשָׁב");
text.text;
// וַתָּשׇׁב
```

#### Text.words

Returns a one dimensional array of [Words](#Word)

```typescript
import { Text } from "havarot";
const text: Text = new Text("הֲבָרֹות");
text.words;
// [Word { original: "הֲבָרֹות" }]
```

#### Text.syllables

Returns a one dimensional array of [Syllables](#Syllable)

```typescript
import { Text } from "havarot";
const text: Text = new Text("הֲבָרֹות");
text.syllables;
// [
//    Syllable { original: "הֲ" },
//    Syllable { original: "בָ" },
//    Syllable { original: "רֹות" }
//  ]
```

#### Text.clusters

Returns a one dimensional array of [Clusters](#Cluster)

```typescript
import { Text } from "havarot";
const text: Text = new Text("יָד");
text.clusters;
// [
//    Cluster { original: "יָ" },
//    Cluster { original: "ד" }
//  ]
```

#### Text.chars

Returns a one dimensional array of [Chars](#Char)

```typescript
import { Text } from "havarot";
const text: Text = new Text("יָד");
text.chars;

//  [
//    Char { original: "י" },
//    Char { original: "ָ" },
//    Char { original: "ד" }
//  ]
```

### Word

`Text.text` is split at each space and maqqef (U+05BE) both of which are captured. Thus, the string passed to instantiate each `Word` is already properly decomposed, sequenced, and qamets qatan patterns converted to the appropriate unicode character (U+05C7).

#### Word.original

Returns the original string passed which has been decomposed, sequenced, and qamets qatan patterns converted to the appropriate unicode character (U+05C7).

```typescript
import { Text } from "havarot";
const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
const words = text.words.map((word) => word.original);
words;
// [
//    "אֵיפֹה־",
//    "אַתָּה",
//    "מֹשֶׁה " (note the included space)
//  ]
```

#### Word.text

Returns a string that has been properly trimmed, built up from the `.text` of its constituent parts.

```typescript
import { Text } from "havarot";
const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
const words = text.words.map((word) => word.text);
words;
// [
//    "אֵיפֹה־",
//    "אַתָּה",
//    "מֹשֶׁה"
//  ]
```

#### Word.syllables

Returns a one dimensional array of [Syllables](#Syllable)

```typescript
import { Text } from "havarot";
const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
text.words[0].syllables;
// [
//    Syllable { original: "אֵי" },
//    Syllable { original: "פֹה־" }
//  ]
```

#### Word.clusters

Returns a one dimensional array of [Clusters](#Cluster)

```typescript
import { Text } from "havarot";
const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
text.words[0].clusters;
// [
//    Cluster { original: "אֵ" },
//    Cluster { original: "י" },
//    Cluster { original: "פֹ" },
//    Cluster { original: "ה־" }
//  ]
```

#### Word.chars

Returns a one dimensional array of [Chars](#Char)

```typescript
import { Text } from "havarot";
const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
text.words[0].clusters;
// [
//    Char { original: "א" },
//    Char { original: "ֵ" }, (tsere)
//    Char { original: "פ" },
//    Char { original: "ֹ" }, (holem)
//    Char { original: "ה"},
//    Char { original: "־" }
//  ]
```

### Syllable

A `Syllable` is created from an array of `Clusters`.

This is where things get tricky. The string from `Word.original` is passed into `syllabify()` from `"./src/utils/syllabifier"`.
This string is then converted into `Clusters` which are analyzed as being part of a syllable since a syallble can have more than one cluster.
The `syllabify()` function determines if a what is a syllable and if it is closed, accented, or final.

See the [syllabification](./docs/syllabification.md) doc for how a syllable is determined

#### Syllable.isClosed

Returns a `boolean`.

```typescript
import { Text } from "havarot";
const text: Text = new Text("וַיִּקְרָ֨א");
text.syllables[0].isClosed;
// true
text.syllables[2].isClosed;
// false
```

#### Syllable.isAccented

Returns a `boolean`.

Though Hebrew words are typically accented on the final syllable, this is not always the case.

```typescript
import { Text } from "havarot";
const text: Text = new Text("וַיִּקְרָ֨א"); // note the taamei over the ר
text.syllables[0].isAccented; // i.e. "וַ"
// false
text.syllables[2].isAccented; // i.e. "רָ֨א"
// true
```

#### Syllable.isFinal

Returns a `boolean`.

```typescript
import { Text } from "havarot";
const text: Text = new Text("וַיִּקְרָ֨א"); // note the taamei over the ר
text.syllables[0].isFinal; // i.e. "וַ"
// false
text.syllables[2].isFinal; // i.e. "רָ֨א"
// true
```

#### Syllable.text

Returns a string that has been built up from the `.text` of its constituent parts.

```typescript
import { Text } from "havarot";
const text: Text = new Text("וַיִּקְרָ֨א");
const sylText = text.syllables.map((syl) => syl.text);
sylText;
//
//  [
//    "וַ"
//    "יִּקְ"
//    "רָ֨א"
//  ]
```

#### Syllable.clusters

Returns a one dimensional array of [Clusters](#Cluster)

```typescript
import { Text } from "havarot";
const text: Text = new Text("וַיִּקְרָ֨א");
text.syllables[1].clusters;
// [
//    Cluster { original: "יִּ" },
//    Cluster { original: "קְ" }
//  ]
```

#### Syllable.chars

Returns a one dimensional array of [Clusters](#Cluster)

```typescript
import { Text } from "havarot";
const text: Text = new Text("וַיִּקְרָ֨א");
text.syllables[2].chars;
// [
//    Char { original: "ר" },
//    Char { original: "ָ" },
//    Char { original: "" }, i.e. \u{05A8} (does not print well)
//    Char { original: "א" }
//  ]
```

## Contributing

See the [TODO](./docs/TODO.md) list for some ideas of what needs to get done.
Of feel free to open an issue or pull request.

See the [terms list](./docs/terms.md) for a list of naming convention.
