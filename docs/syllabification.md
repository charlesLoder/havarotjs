# Syllabification

There are multiple types of schemas for syllabification:

1. [Traditional](#Traditional)
2. [Tiberian](#Tiberian)

This package follows Geoffrey Khan's _[The Tiberian Pronunciation Tradition of Biblical Hebrew](https://www.openbookpublishers.com/product/1144)_ for developing a schema similar to the Tiberian tradition.
This schema does not strictly adhere to the Tiberian tradition as laid out in Khan's work.
All references are to this work, unless otherwise noted.

## What Conistitutes a Syllable

In Biblical Hebrew, it is often considered that hatef vowels and vocalic shewas do not consitute syllabes.

In [GKC](https://en.wikisource.org/wiki/Gesenius%27_Hebrew_Grammar/26._Syllable-formation_and_its_Influence_on_the_Quantity_of_Vowels) §26m:

> Such a consonant with vocal Šewâ never has the value of an independent syllable, but rather attaches itself so closely to the following syllable that it forms practically one syllable with it, e.g. לְחִי (cheek) _lǝḥî_; חֳלִי (sickness) _ḥŏlî_; יִלְמְדוּ _yil-mǝdhû_.

As Khan says (I.2.5.2):

> In the Tiberian Masoretic literature a consonant with a vocalic shewa or a ḥaṭef vowel sign was not considered to stand independently, but was said to be bound to the following consonants. Thus the word תִּסְפְּר֖וּ ‘you shall count’ (Lev. 23.16) was considered to have been composed of two prosodic units [tis–paʀ̟uː]. The sources refer to these prosodic units by the Arabic term _maqṭaʿ_, which is used in the Arabic grammatical literature to refer to a syllable.

Though, as he demonstrates, it is better to understand the Tiberian syllables as feet. Thus, the word תִּסְפְּר֖וּ is really 3 syllables, but two metrical feet:

| tʰis. | pʰa. | ˈʀ̟uː |
| ----- | ---- | ---- |
| syl   | syl  | syl  |

| (tʰis.) | (pʰa.ˈʀ̟uː) |
| ------- | ---------- |
| foot    | foot       |

According to this decription, hatef vowels and vocalic shewas **do** constitute syllables.

## Traditional

The traditional schema for syllabification is that most commonly taught in schools and seminaries.
It is most similar to the Sephardi pronunciation (see especially, S. Morag, "Pronunciation of Hebrew" _EJ_ 16:547–562).

### Vocal & Silent Shewas

In regards to the realization of shewas, Khan remarks (I.2.5.1.1):

> The shewa (שְׁוָּא) sign (אְ) in the Tiberian vocalization system was read either as a vowel or as zero. When shewa was read as vocalic, its quality in the Tiberian tradition was by default the same as that of the pataḥ vowel sign

This package does **not** consider the quality of the realization of the shewa.
It only determines whether the shewa is vocal or silent.

#### Vocal Shewas

A shewa is considered vocalic (i.e. _shewa na'_) under the following conditions:

1. when it is the first vowel in a word
2. when two shewas occur together in the middle of word, the first is silent and the second is vocal
3. when it appears under a geminated consonant
4. when it is preceded by a long vowel except for a word initial shureq (i.e. a conjunctive vav)

#### Silent Shewas

If a shewa does not fall into the criteria above, it is generally silent (i.e. _shewa nach_).

There is one major exception:

- In the word שְׁתַּיִם _štayim_ (and variants), the first shewa is technially silent.

This package, however, considers it a vocal shewa.

## Tiberian

⚠️ Not developed yet ⚠️

#### Long Vowels

note: see p.325 for "word such as קוֹל [ˈq̟oː.ol]" and why it is counted as one syllable
