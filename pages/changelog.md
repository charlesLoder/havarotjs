# Changelog

## 2023-01-22 0.13.0

- fix syllabification w/ the spelling of Jerusalem (Issue #83)
- standardize Hebrew character name (Issue #76)
- `Syllable` extends `Node`
- Add `hasVowelName` to `Syllable` (Issue #80)
- Add `vowelName` property to `Syllable` (Issue #81)
- Add `vowel` property to `Syllable` (Issue #82)
- Add `hasVowelName` property to `Cluster` (Issue #77)
- Add `vowelName` property to `Cluster` (Issue #75)
- Add `vowel` property to `Cluster` (Issue #74)
- Fix two holems dropping one (Issue #74)

## 2022-12-17 0.12.0

- Add support for holem haser (Issue #72)

## 2022-11-14 0.11.3

- Fix medial shureqs incorrect when strict is false (Issue #70)

## 2022-11-09 0.11.2

- Fix medial maters incorrect when strict is false (Issue #68)

## 2022-11-04 0.11.1

- Add documentation for `strict` 🤦‍♂️

## 2022-11-03 0.11.0

- Add syllabification option for `strict`
  - if true, then text must be correctly pointed

## 2022-10-20 0.10.1

- Fix broken exports

## 2022-10-20 0.10.0

- Update how schemas are created (Issue #63)
- Fix failing doc builds (Issue #47)

## 2022-09-24 0.9.2

- Fix Divine Name w/ Latin Chars
- Fix holem waw and proceding word
- the above two were inter-related

## 2022-09-24 0.9.1

- Add CI testing checks
- Add a q.q. check (Issue #50)
- Fix single syllable holem-waw error (Issue #58)

## 2022-09-03 0.9.0

### Change

- fix Issue #38 by allowing Hebrew without niqqud
  - introduces the `allowNoNiqqud` option for syllabification
- fix Issue #44 by fixing Divine Name w/ Latin characters

## 2022-08-27 0.8.1

### Change

- fix Issue #24 by updating the regex for kol
- fix Issue #35 by improving how hyphens are handled
- fix Issue #36 of single shureq failing

## 2022-07-04 0.8.0

### Change

- fix Issue #31 by adding check for Othniel
- fix Issue #32 by adding check non-Hebrew chars

### Add

- add `isNotHebrew` property on `Word`

## 2022-04-11 0.7.4

### Change

- fix Issue #26 Jerusalem failing for some texts
- fix Issue #29 with aleph with a shureq being treated like a mater

## 2022-03-04 0.7.3

### Change

- fix Issue #20 — when an aleph had a shureq as a vowel and was preceded by a shewa it would throw and error

## 2022-01-02 0.7.2

### Change

- fix false `Cluster.isMater` when a he was preceded by qamets, but had a shureq as vowel

## 2022-01-01 0.7.1

### Change

- improve syllabification of words with two holem waws

### Change

## 2021-12-23 0.7.0

### Change

- improve syllabification for quiesced aleph
- improve syllabification for consonants w/o a vowel
- correct syllabification for omitted _dagesh chazaq_ ([Issue #14](https://github.com/charlesLoder/hebrew-transliteration/issues/14))
  - added `article` to `SylOpts`

## 2021-12-06 0.6.2

### Change

- fixed holem-waw followed by silent aleph not included in 0.6.1

## 2021-12-06 0.6.1

### Change

- fixed syllabification for word holem-waw and and waw with a holem

## 2021-09-14 0.6.0

### Add

- `hasDivineName` property to `Word`

### Change

- updated packages

### Removed

- `hebrew-transliteration` package used in testing

## 2021-09-04 0.5.3

### Change

- improve qamets qatan checking for כל without a maqqef

## 2021-08-28 0.5.2

### Change

- latin char in `0.5.1` was not robust enough:
  - wrong regex in Char sequencing caused incorrect syl data
  - latin chars are there own cluster

## 2021-08-23 0.5.1

### Add

- a changelog!!!
- documentation tooling
- gh action for publishing: UNTESTED!
- improved handling of latin chars mixed with heb; latin chars are now own cluster
