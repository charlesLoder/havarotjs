---
title: Syllabification
---

:::caution
This is still a work in progrss
:::

There are two types of schemas for syllabification:

1. [Traditional](#traditional)
2. [Tiberian](#tiberian)

which set the options for syllabification.

This package follows Geoffrey Khan's _[The Tiberian Pronunciation Tradition of Biblical Hebrew](https://www.openbookpublishers.com/product/1144)_ for developing a schema similar to the Tiberian tradition.
This schema does not strictly adhere to the Tiberian tradition as laid out in Khan's work.
All references are to this work, unless otherwise noted.

## What Conistitutes a Syllable

In Biblical Hebrew, it is often considered that hatef vowels and vocalic shevas do not consitute syllabes.

In [GKC](https://en.wikisource.org/wiki/Gesenius%27_Hebrew_Grammar/26._Syllable-formation_and_its_Influence_on_the_Quantity_of_Vowels) §26m:

> Such a consonant with vocal Šewâ never has the value of an independent syllable, but rather attaches itself so closely to the following syllable that it forms practically one syllable with it, e.g. לְחִי (cheek) _lǝḥî_; חֳלִי (sickness) _ḥŏlî_; יִלְמְדוּ _yil-mǝdhû_.

As Khan says (I.2.5.2):

> In the Tiberian Masoretic literature a consonant with a vocalic sheva or a ḥaṭef vowel sign was not considered to stand independently, but was said to be bound to the following consonants. Thus the word תִּסְפְּר֖וּ ‘you shall count’ (Lev. 23.16) was considered to have been composed of two prosodic units [tis–paʀ̟uː]. The sources refer to these prosodic units by the Arabic term _maqṭaʿ_, which is used in the Arabic grammatical literature to refer to a syllable.

Though, as he demonstrates, it is better to understand the Tiberian syllables as feet. Thus, the word תִּסְפְּר֖וּ is really 3 syllables, but two metrical feet:

| tʰis. | pʰa. | ˈʀ̟uː |
| ----- | ---- | ---- |
| syl   | syl  | syl  |

| (tʰis.) | (pʰa.ˈʀ̟uː) |
| ------- | ---------- |
| foot    | foot       |

According to this decription, hatef vowels and _sheva na'_ **do** constitute syllables.

## Options for Syllabification

These are the options for syllabification.

### allowNoNiqqud

Takes a `boolean`. Default `false`.

Allows text with no niqqud to be passed; words with no niqqud or incomplete pointing will not be syllabified

```ts
const text = new Text("בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים", { allowNoNiqqud: true });
text.syllables.map((syl) => syl.text);
// [ 'בְּ', 'רֵא', 'שִׁ֖ית', 'בָּרא', 'אלהים' ]
// note 2nd word has incomplete pointing, and 3rd has none
```

### article

Takes a `boolean`. Default `true`.

Determines whether to regard the sheva under the letters ילמ when preceded by the article and with a missing dagesh chazaq as as a _sheva na'_.

```ts
const usingDefault = new Text("הַיְאֹ֗ר");
usingDefault.syllables.map((syl) => syl.text);
// ["הַ", "יְ", "אֹ֗ר"]

const optional = new Text("הַיְאֹ֗ר", { article: false });
optional.syllables.map((syl) => syl.text);
// ["הַיְ", "אֹ֗ר"]
```

_results in example displayed in reverse order to mimic Hebrew writing; the rightmost value is the 0 item_

### longVowles

Takes a options `"update" | "preserve" | "remove"`. Default `"preserve"`

**update**

Converts all holems in a vav + holem sequence where vav is a consonant to HOLAM HASER FOR VAV

```ts
const holemHaser = /\u{05BA}/u;
const str = "עָוֹן"; // vav + holem
holemHaser.test(str); // false
const newStr = new Text(updated, { holemHaser: "update" }).text;
holemHaser.test(newStr); // true
```

**preserve**

Leaves the text as is — does not remove HOLAM HASER FOR VAV, but does not update

```ts
const holemHaser = /\u{05BA}/u;
const str = "עָוֹן"; // vav + holem
holemHaser.test(str); // false
const newStr = new Text(updated, { holemHaser: "preserve" }).text;
holemHaser.test(newStr); // false
```

**remove**

Converts all HOLAM HASER FOR VAV to regular holem

```ts
const holemHaser = /\u{05BA}/u;
const str = "עָוֺן"; // vav + holem haser
holemHaser.test(str); // true
const newStr = new Text(updated, { holemHaser: "remove" }).text;
holemHaser.test(newStr); // false
```

### longVowles

Takes a `boolean`. Default `true`.

If `true`, regards a sheva after a long vowel (excluding waw-shureq) as a _sheva na'_ .

```typescript
const usingDefault = new Text("יָדְךָ");
usingDefault.syllables.map((syl) => syl.text);
// ["יָ", "דְ", "ךָ"]

const optional = new Text("יָדְךָ", { longVowels: false });
optional.syllables.map((syl) => syl.text);
// ["יָדְ", "ךָ"]
```

### qametsQatan

Takes a `boolean`. Default `true`.

If `true`, when appropriate qamets characters are converted to qamets-qatan characters.
The former is a "long-vowel" whereas the latter is a "short-vowel."

```typescript
const qQRegx = /\u{05C7}/u;
const usingDefault = new Text("חָפְנִי֙");
qQRegx.test(default.text);
// true

const optional = new Text("חָפְנִי֙", { qametsQatan: false });
qQRegx.test(optional.text);
// false
```

### shevaAfterMeteg

Takes a `boolean`. Default `true`.

If `true`, regards the sheva after a meteg as a _sheva na'_.

```ts
const usingDefault = new Text("יְדַֽעְיָה");
usingDefault.syllables.map((s) => ({ text: s.text, isClosed: s.isClosed }));
// [
//{ text: 'יְ', isClosed: false },
//{ text: 'דַֽ', isClosed: false },
//{ text: 'עְ', isClosed: false },
//{ text: 'יָה', isClosed: false }
// ]

const optional = new Text("יְדַֽעְיָה", { shevaAfterMeteg: false });
optional.syllables.map((s) => ({ text: s.text, isClosed: s.isClosed }));
// [
//{ text: 'יְ', isClosed: false },
//{ text: 'דַֽעְ', isClosed: true },
//{ text: 'יָה', isClosed: false }
// ]
```

### shevaWithMeteg

Takes a `boolean`. Default `true`.

If `true`, regards a sheva with a meteg as a _sheva na'_.

```ts
const usingDefault = new Text("אַ֥שְֽׁרֵי");
usingusingDefault.syllables.map((s) => ({ text: s.text, isClosed: s.isClosed }));
// [
//  { text: 'אַ֥', isClosed: false },
//  { text: 'שְֽׁ', isClosed: false },//  { text: 'רֵי', isClosed: false }
// ]

const optional = new Text("אַ֥שְֽׁרֵי", { shevaWithMeteg: false });
optional.syllables.map((s) => ({ text: s.text, isClosed: s.isClosed }));
// [
//  { text: 'אַ֥שְֽׁ', isClosed: true },
//  { text: 'רֵי', isClosed: false }
// ]
```

### strict

Takes a `boolean`. Default `true`.

Determines whether to syllabify incorrectly pointed text.

```ts
const text1 = new Text("לְוּדְרְדַּיְל", { strict: true });
// Error: Syllable לְ should not precede a Cluster with a Shureq in דַּיְלרְדְוּלְ

const text2 = new Text("לְוּדְרְדַּיְל", { strict: false });
text2.syllables.map((syl) => syl.text);
// [ 'וּ', 'דְ', 'רְ', 'דַּיְל' ]
```

### sqnmlvy

Takes a `boolean`. Default `true`.

If `true`, regards the sheva under the letters שׁשׂסצנמלוי when preceded by a waw-consecutive with a missing _dagesh chazaq_ as vocal. If a meteg is present, the sheva is always a _sheva na'_.

```typescript
const usingDefault = new Text("וַיְצַחֵק֙");
usingDefault.syllables.map((syl) => syl.text);
// ["וַ", "יְ", "צַ", "חֵק֙"]

const optional = new Text("וַיְצַחֵק֙", { sqnmlvy: false });
optional.syllables.map((syl) => syl.text);
// ["וַיְ", "צַ", "חֵק֙"]
```

### wawShureq

Takes a `boolean`. Default is `true`.

If `true`, regards a sheva after a waw-shureq as a _sheva na'_, unless a meteg is present.

```typescript
const usingDefault = new Text("וּלְמַזֵּר");
usingDefault.syllables.map((syl) => syl.text);
// "וּ", "לְ", "מַ", "זֵּר"]

const optional = new Text("וּלְמַזֵּר", { wawShureq: false });
optional.syllables.map((syl) => syl.text);
// ["וּלְ", "מַ", "זֵּר"]
```

## Schemas

### Traditional

The traditional schema for syllabification is that most commonly taught in schools and seminaries.
It is most similar to the Sephardi pronunciation (see especially, S. Morag, "Pronunciation of Hebrew" _EJ_ 16:547–562).

The `traditional` schema follows the default options.

```typescript
const defaut = new Text("וּלְמַזֵּר");
usingDefault.syllables.map((syl) => syl.text);
// "וּ", "לְ", "מַ", "זֵּר"]
```

### Tiberian

For Tiberian, the defaults are adjusted like this:

```typescript
{
  longVowels: false,
  qametsQatan: false,
  shevaAfterMeteg: false,
  wawShureq: false,
}
```

It can be imported from the `/schemas`:

```typescript
import { tiberian } from "havarotjs/schemas";
import { Text } from "havarotjs";

const defaut = new Text("וּלְמַזֵּר", tiberian);
usingDefault.syllables.map((syl) => syl.text);
// "וּלְ", "מַ", "זֵּר"]
```

#### Long Vowels

note: see p.325 for "word such as קוֹל [ˈq̟oː.ol]" and why it is counted as one syllable

## Vocal & Silent Shevas

In regards to the realization of shevas, Khan remarks (I.2.5.1.1):

> The shewa (שְׁוָּא) sign (אְ) in the Tiberian vocalization system was read either as a vowel or as zero. When shewa was read as vocalic, its quality in the Tiberian tradition was by default the same as that of the pataḥ vowel sign

This package does **not** consider the quality of the realization of the sheva.
It only determines whether the sheva is a _sheva na'_ (vocal) or _sheva nach_ (silent).

### Edge case

- In the word שְׁתַּיִם _štayim_ (and variants), the first sheva is technially silent.

This package, however, considers it a _sheva na'_.
