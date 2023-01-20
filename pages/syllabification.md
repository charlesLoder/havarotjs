# Syllabification

⚠️ This section is still a work in progress ⚠️

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

### longVowles

Takes a `boolean`. Default `true`.

If `true`, regards a sheva after a long vowel (excluding waw-shureq) as a _sheva na'_ .

```typescript
const default = new Text("יָדְךָ");
default.syllables.map(syl => syl.text);
// ["יָ", "דְ", "ךָ"]

const optional = new Text("יָדְךָ", { longVowels: false });
optional.syllables.map(syl => syl.text);
// ["יָדְ", "ךָ"]
```

### sqnmlvy

Takes a `boolean`. Default `true`.

If `true`, regards the sheva under the letters שׁשׂסצנמלוי when preceded by a waw-consecutive with a missing _dagesh chazaq_ as vocal. If a meteg is present, the sheva is always a _sheva na'_.

```typescript
const default = new Text("וַיְצַחֵק֙");
default.syllables.map(syl => syl.text);
// ["וַ", "יְ", "צַ", "חֵק֙"]

const optional = new Text("וַיְצַחֵק֙", { sqnmlvy: false });
optional.syllables.map(syl => syl.text);
// ["וַיְ", "צַ", "חֵק֙"]
```

### qametsQatan

Takes a `boolean`. Default `true`.

If `true`, when appropriate qamets characters are converted to qamets-qatan characters.
The former is a "long-vowel" whereas the latter is a "short-vowel."

```typescript
const qQRegx = /\u{05C7}/u;
const default = new Text("חָפְנִי֙");
qQRegx.test(default.text);
// true

const optional = new Text("חָפְנִי֙", { qametsQatan: false });
qQRegx.test(optional.text);
// false
```

### wawShureq

Takes a `boolean`. Default is `true`.

If `true`, regards a sheva after a waw-shureq as a _sheva na'_, unless a meteg is present.

```typescript
const default = new Text("וּלְמַזֵּר");
default.syllables.map(syl => syl.text);
// "וּ", "לְ", "מַ", "זֵּר"]

const optional = new Text("וּלְמַזֵּר", { wawShureq: false });
optional.syllables.map(syl => syl.text);
// ["וּלְ", "מַ", "זֵּר"]
```

## Schemas

### Traditional

The traditional schema for syllabification is that most commonly taught in schools and seminaries.
It is most similar to the Sephardi pronunciation (see especially, S. Morag, "Pronunciation of Hebrew" _EJ_ 16:547–562).

The syllabification options the default that are set as follows:

```typescript
{ longVowels: true, sqnmlvy: true, qametsQatan: true, wawShureq: true }
```

The `traditional` schema follows the default options.

```typescript
const defaut = new Text("וּלְמַזֵּר");
default.syllables.map(syl => syl.text);
// "וּ", "לְ", "מַ", "זֵּר"]

```

#### Vocal & Silent Shevas

In regards to the realization of shevas, Khan remarks (I.2.5.1.1):

> The shewa (שְׁוָּא) sign (אְ) in the Tiberian vocalization system was read either as a vowel or as zero. When shewa was read as vocalic, its quality in the Tiberian tradition was by default the same as that of the pataḥ vowel sign

This package does **not** consider the quality of the realization of the sheva.
It only determines whether the sheva is a _sheva na'_ (vocal) or _sheva nach_ (silent).

##### Vocal Shevas

A sheva is considered a _sheva na'_ under the following conditions:

1. when it is the first vowel in a word
2. when two shevas occur together in the middle of word, the first is silent and the second is vocal
3. when it appears under a geminated consonant
4. when it is preceded by a long vowel

##### Silent Shevas

If a sheva does not fall into the criteria above, it is generally silent (i.e. _sheva nach_).

There is one major exception:

- In the word שְׁתַּיִם _štayim_ (and variants), the first sheva is technially silent.

This package, however, considers it a _sheva na'_.

### Tiberian

The syllabification options are set as follows:

```typescript
{ qametsQatan: false, sqnmlvy: true, longVowels: false, wawShureq: false }
```

It can be imported from the `/schemas`:

```typescript
import { tiberian } from "havarotjs/schemas";
import { Text } from "havarotjs";

const defaut = new Text("וּלְמַזֵּר", tiberian);
default.syllables.map(syl => syl.text);
// "וּלְ", "מַ", "זֵּר"]
```

#### Long Vowels

note: see p.325 for "word such as קוֹל [ˈq̟oː.ol]" and why it is counted as one syllable
