# Terms

Because multiple terms exist to describe the same forms in Hebrew grammar, this list is lays out the terminology used in this projects and acts as a naming standard.
Preference is to use Hebrew names with simplified spellings for particular variables and properties, but not for classes.

|      Form Used       |                   Alternate Form                   |
| :------------------: | :------------------------------------------------: |
|        dagesh        |                        dot                         |
|        hatef         |                hateph, ultra-short                 |
|        niqqud        |                  points, pointing                  |
|        shewa         |                    sheva, shva                     |
| taam, taamim, taamei | ta'amei, ta'amei ha-miqra, accents\*, cantillation |
|     qamets qatan     |                    qamets hatuf                    |

\*the `Syllable` object has a property `isAccented` which is a linguistic property (i.e. stress), but the `Cluster` object has the property `hasTaamim` since this references the characters.
