# Changelog

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
