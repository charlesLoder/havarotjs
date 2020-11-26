# havarot

A Typescript package for getting syllabic data about Hebrew text with niqqud.

## example

```typescript
import { Text } from "havarotjs";
const heb: string = "אֱלֹהִים";
const text: Text = new Text(heb);
const sylText = text.syllables.map((syl) => syl.text);
sylText;
//  [
//    "אֱ"
//    "לֹ"
//    "הִים"
//  ]
```

## install

Using `npm`:

```
npm install havarotjs
```

To call using TypeScript:

```typescript
import { Text } from "havarotjs";
```

Or Node:

```javascript
const havarot = require("havarotjs");
const Text = havarot.Text;
const heb = new Text("אֱלֹהִים");
```

## DOCS

The general idea of this package is that a [`Text`](#Text) is composed of [`Words`](#Word) which are composed of [`Syllables`](#Syllable) which are composed of [`Clusters`](#Cluster) which are composed of [`Characters`](#Char).

### Text

`Text()` requires an input string, and has optional arguments for syllabification, which can be read about in the [syllabification doc](./docs/syllabification.md)

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("הֲבָרֹות");
```

#### Text.original

Returns the original string.

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("הֲבָרֹות");
text.original;
// "הֲבָרֹות"
```

#### Text.text

Returns a string that has been decomposed, sequenced, qamets qatan patterns converted to the appropriate unicode character (U+05C7), and holem-waw sequences corrected.

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("וַתָּשָׁב");
text.text;
// וַתָּשׇׁב
```

#### Text.words

Returns a one dimensional array of [Words](#Word)

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("הֲבָרֹות");
text.words;
// [Word { original: "הֲבָרֹות" }]
```

#### Text.syllables

Returns a one dimensional array of [Syllables](#Syllable)

```typescript
import { Text } from "havarotjs";
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
import { Text } from "havarotjs";
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
import { Text } from "havarotjs";
const text: Text = new Text("יָד");
text.chars;
//  [
//    Char { original: "י" },
//    Char { original: "ָ" },
//    Char { original: "ד" }
//  ]
```

### Word

`Text.text` is split at each space and maqqef (U+05BE) both of which are captured. Thus, the string passed to instantiate each `Word` is already properly decomposed, sequenced, qamets qatan patterns converted to the appropriate unicode character (U+05C7), and holem-waw sequences corrected.

#### Word.original

Returns the original string passed which has been decomposed, sequenced, qamets qatan patterns converted to the appropriate unicode character (U+05C7), and holem-waw sequences corrected.

```typescript
import { Text } from "havarotjs";
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

Returns a string that has been properly trimmed from `.original`.

```typescript
import { Text } from "havarotjs";
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
import { Text } from "havarotjs";
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
import { Text } from "havarotjs";
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
import { Text } from "havarotjs";
const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
text.words[0].chars;
// [
//    Char { original: "א" },
//    Char { original: "ֵ" }, (tsere)
//    Char { original: "פ" },
//    Char { original: "ֹ" }, (holem)
//    Char { original: "ה"},
//    Char { original: "־" }
//  ]
```

#### Word.whiteSpaceAfter & Word.whiteSpaceBefore

Returns a string with any whitespace characters (e.g. `/\s/`) from before the word.
It does **not** capture whitespace at the start of a `Text`.

```typescript
import { Text } from "havarotjs";
const heb = `
עֶבֶד
אֱלֹהִים
`;
const text: Text = new Text(heb);
text.words;
// [
//   Word {
//     original: 'עֶבֶד\n',
//     text: 'עֶבֶד',
//     whiteSpaceBefore: '',
//     whiteSpaceAfter: '\n'
//   },
//   Word {
//     original: 'אֱלֹהִים',
//     text: 'אֱלֹהִים',
//     whiteSpaceBefore: '',
//     whiteSpaceAfter: ''
//   }
// ]
```

#### Word.isDivineName

Returns a `boolean` indicating if the word is a form of the Divine Name.
Only recognizes forms that have all four letters.

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("יְהוָה");
text.words[0].isDivineName;
// true
```

### Syllable

A `Syllable` is created from an array of `Clusters`.

See the [syllabification](./docs/syllabification.md) doc for how a syllable is determined.
Currently, the Divine Name (e.g. יהוה) and non-Hebrew text is treated as a _single syllable_ because these do not follow the rules of Hebrew syllabification.

#### Syllable.text

Returns a string that has been built up from the `.text` of its constituent parts.

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("וַיִּקְרָ֨א");
const sylText = text.syllables.map((syl) => syl.text);
sylText;
//  [
//    "וַ"
//    "יִּקְ"
//    "רָ֨א"
//  ]
```

#### Syllable.clusters

Returns a one dimensional array of [Clusters](#Cluster)

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("וַיִּקְרָ֨א");
text.syllables[1].clusters;
// [
//    Cluster { original: "יִּ" },
//    Cluster { original: "קְ" }
//  ]
```

#### Syllable.chars

Returns a one dimensional array of [Chars](#Char)

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("וַיִּקְרָ֨א");
text.syllables[2].chars;
// [
//    Char { original: "ר" },
//    Char { original: "ָ" },
//    Char { original: "" }, i.e. \u{05A8} (does not print well)
//    Char { original: "א" }
//  ]
```

#### Syllable.isClosed

Returns a `boolean`.

```typescript
import { Text } from "havarotjs";
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
import { Text } from "havarotjs";
const text: Text = new Text("וַיִּקְרָ֨א"); // note the taamei over the ר
text.syllables[0].isAccented; // i.e. "וַ"
// false
text.syllables[2].isAccented; // i.e. "רָ֨א"
// true
```

#### Syllable.isFinal

Returns a `boolean`.

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("וַיִּקְרָ֨א"); // note the taamei over the ר
text.syllables[0].isFinal; // i.e. "וַ"
// false
text.syllables[2].isFinal; // i.e. "רָ֨א"
// true
```

### Cluster

A cluster is group of Hebrew character constituted by:

- an obligatory Hebrew consonant character
- an optional ligature mark
- an optional vowel
- an optional taamei

A `Syllable` is a linguistic unit, whereas a `Cluster` is an orthgraphic one.
The word `יֹו֑ם` is only one syllable, but it has three clusters—`יֹ`, `ו֑`, `ם`.

Because Hebrew orthography is both sub and supra linear, clusters can be encoded in various ways.
For the issues concerning normalization, see the [SBL Hebrew Font Manual](https://www.sbl-site.org/Fonts/SBLHebrewUserManual1.5x.pdf), p.8.

#### Cluster.text

Returns a string that has been built up from the `.text` of its constituent parts.

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("הֲבָרֹות");
const clusters = text.clusters.map((cluster) => cluster.text);
// [
//  "הֲ",
//  "בָ",
//  "רֹ",
//  "ו",
//  "ת"
// ]
```

#### Cluster.chars

Returns a one dimensional array of [Chars](#Char).

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("הֲבָרֹות");
text.clusters[0].chars;
// [
//  Char { original: "ה" },
//  Char { original: "ֲ " },   i.e. \u{05B2} (does not print well)
// ]
```

#### Cluster.hasLongVowel

Returns `true` if the following long vowel character are present:

- \u{05B5} TSERE
- \u{05B8} QAMATS
- \u{05B9} HOLAM
- \u{05BA} HOLAM HASER FOR VAV

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("הֲבָרֹות");
text.clusters[0].hasLongVowel;
// false
text.clusters[1].hasLongVowel;
// true
```

#### Cluster.hasShortVowel

Returns `true` if the following long vowel character are present:

- \u{05B4} HIRIQ
- \u{05B6} SEGOL
- \u{05B7} PATAH
- \u{05BB} QUBUTS
- \u{05C7} QAMATS QATAN

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("מַלְכָּה");
text.clusters[0].hasShortVowel;
// true
text.clusters[2].hasShortVowel;
// false
```

#### Cluster.hasHalfVowel

Returns `true` if the following long vowel character are present:

- \u{05B1} HATAF SEGOL
- \u{05B2} HATAF PATAH
- \u{05B3} HATAF QAMATS

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("הֲבָרֹות");
text.clusters[0].hasHalfVowel;
// true
text.clusters[1].hasHalfVowel;
// false
```

#### Cluster.hasVowel

Returns `true` if `Cluster.hasLongVowel`, `Cluster.hasShortVowel`, or `Cluster.hasHalfVowel` is true.

According to [syllbaification](./docs/syllabfication.md), a shewa is a vowel and serves as the nucleus of a syllable. Because `Cluster` is concerned with orthography, a shewa is **not** a vowel character.

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("הֲבָרֹות");
text.clusters[0].hasVowel;
// true
text.clusters[4].hasVowel;
// false
```

#### Cluster.isShureq

Returns `true` if `Cluster.hasVowel` is `false` and `Cluster.text` is a waw followed by a dagesh (e.g. `וּ`)

A shureq is vowel itself, but contains no vowel characters (hence why `hasVowel` cannot be `true`).
This allows for easier syllabification

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("קוּם");
text.clusters[0].isShureq;
// false
text.clusters[1].isShureq;
// true
```

#### Cluster.isMater

Returns `true` if `Cluster.hasVowel`, `Cluster.hasShewa`, and, `Cluster.isShureq` are all `false` and `Cluster.text` contains a:

- `ה` preceded by a qamets, tsere, or seghol
- `ו` preceded by a holem
- `י` preceded by a hiriq, tsere, or seghol

There are potentially other instances when a consonant may be a _mater_ (e.g. a final aleph, ), but these are the most common.

Though a shureq is a mater letter, it is also a vowel itself, and thus separate from `isMater`.

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("סוּסָה");
text.clusters[1].isMater; // the shureq
// false
text.clusters[3].isMater; // the heh
// true
```

#### Cluster.hasMetheg

Returns `true` is the following character is present:

- \u{05BD} METEG

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("הֲבָרֹות");
text.clusters[0].hasMetheg;
// false
```

#### Cluster.hasShewa

Returns `true` is the following character is present:

- \u{05B0} SHEWA

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("מַלְכָּה");
text.clusters[0].hasShewa;
// false
text.clusters[1].hasShewa;
// true
```

#### Cluster.hasTaamim

Returns `true` is the following characters are present:

- \u{0591}-\u{05AF}\u{05BF}\u{05C0}\u{05C3}-\u{05C6}\u{05F3}\u{05F4}

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("אֱלֹהִ֑ים");
text.clusters[0].hasTaamim;
// false
text.clusters[2].hasTaamim;
// true
```

### Char

A Hebrew character and it's positioning number for being sequenced correctly.
See [`Cluster`](#Cluster) for correct normalization.

#### Char.text

Returns a string of the character that is passed in

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("אֱלֹהִ֑ים");
text.chars[0].text;
// "א"
```

#### Char.sequencePosition

Returns a number used for sequencing

- consonants = 0
- ligatures = 1
- dagesh or rafe = 2
- niqqud (vowels) = 3
- taamei (accents) = 4

```typescript
import { Text } from "havarotjs";
const text: Text = new Text("אֱלֹהִ֑ים");
text.chars[0].sequencePosition; // the aleph
// 0
text.chars[1].sequencePosition; // the segol
// 3
```

## Contributing

See the [TODO](./docs/TODO.md) list for some ideas of what needs to get done.
Of feel free to open an issue or pull request.

See the [terms list](./docs/terms.md) for a list of naming convention.
