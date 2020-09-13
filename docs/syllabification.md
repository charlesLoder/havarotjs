# Syllabification

This project follows Geoffrey Khan's, "Remarks on Syllable Structure and Metrical Stucture Structure in Biblical Hebrew," _Journal of Afroasiatic Languages and Linguistics_ 12 (2020), 7–30, as it's basis for syllabification.

In Biblical Hebrew, it is often considered that hatef vowels and vocalic shewas do not consitute syllabes. As Khan says (p.5):

> In the Tiberian Masoretic literature a consonant with a vocalic shewa or a ḥaṭef vowel sign was not considered to stand independently, but was said to be bound to the following consonants. Thus the word תִּסְפְּר֖וּ ‘you shall count’ (Lev. 23.16) was considered to have been composed of two prosodic units \[tʰispʰaʀ̟uː\]. The sources refer to these prosodic units by the Arabic term _maqṭaʕ_, which is used in the Arabic grammatical literature to refer to a syllable.

Though, as he demonstrates, it is better to understand the Tiberian syllables as feet. Thus, the word תִּסְפְּר֖וּ is really 3 syllables, but two metrical feet:

| tʰis. | pʰa. | ˈʀ̟uː |
| ----- | ---- | ---- |
| syl   | syl  | syl  |

| tʰis. | pʰa.ˈʀ̟uː |
| ----- | -------- |
| foot  | foot     |

# Pronunciation

### Shewa
Within the Tiberian Masoretes, the shewa represent both a closed syllable and a reduced vowel. The Babylonian system is more similar to modern reading traditions, where the shewa ________

The transliteration in this library distinguishes between a silent shewa (shewa nach) and a vocal shewa (shewa na') according to the following:

##### Silent Shewa (shewa nach)
A shewa is regarded as silent and closes a syllable when:

1. it is preceded by a short vowel (see [Cluster.hasShortVowel](https://github.com/charlesLoder/havarot#Cluster))
2. it comes at the end of a word, like a final ךְ or תְּ.

##### Vocal Shewa (shewa na’)
The default for the shewa is vocal. For a word like `וְרוֹזְנִים`, the shewa under the zayin is preceded by a long vowel so it is vocal. Also, this form is a plural participles, which means the shewa under the zayin represents a reduced vowel (רֹוזֵן becomes רֹוזְנִים).

Modern Hebrew typically realizes many vocal shewa as closing syllables (like in וְרוֹזְנִים) or as zero-vowels [ø] creating consonants blends at the beginning of words, which is not how the Masoretes realized these pronunciations.

##### Shewa Edge Cases
There are some places where the havarot library umschrift will fail.

1. Words that are in the form of the number two. 
   For example, the shewa in `שְׁנַיִם` is silent, even though it begins a syllable.
2. In some cases of a plural form. 
   For example, `יֶֽחֶזְקוּ`. The shewa represents a reduced vowel so it is technically vocal, however since the shewa is preceded by a seghol, it would be marked as silent. Modern Hebrew would likely realize the shewa as silent, but technically it is not.
