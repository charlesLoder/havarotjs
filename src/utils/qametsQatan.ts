import { sequence } from "./sequence";
import { removeTaamim } from "./removeTaamim";

const snippets = [
  "אָבְדַן",
  "אָבְנ",
  "אָזְנ",
  "אָכְל",
  "אָנִיּ",
  "אָפְנ",
  "אָרְח",
  "אָרְכּ",
  "אָשְׁר",
  "בָאְשׁ",
  "בָשְׁתּ",
  "בָּשְׁתּ",
  "גָבְה",
  "גָּבְה",
  "גָדְל",
  "גָּדְל",
  "גָרְנ",
  "גָּרְנ",
  "דָּכְי",
  "דָּרְבָֽן",
  "חָדְשׁ",
  "חָכְמ",
  "חָלְיֽוֹ",
  "חָלְיֹו",
  "חָפְנ",
  "חָפְשִׁי",
  "חָפְשִׁית",
  "חָרְב",
  "חָרְנֶפֶר",
  "חָרְפּ",
  "חָשְׁכּ",
  "יָפְי",
  "יָשְׁר",
  "מָרְדְּכַי",
  "מָתְנ",
  "סָלְתּ",
  "עָזּ",
  "עָמְרִי",
  "עָנְי",
  "עָפְנִי",
  "עָפְר",
  "עָרְל",
  "עָרְפּ",
  "עָשְׁר",
  "צָרְכּ",
  "קָדְק",
  "קָדְשׁ",
  "קָרְבּ",
  "קָרְח",
  "רָגְז",
  "רָחְבּ",
  "שָׁרְשׁ",
  "שָׁרָשׁ",
  "תָּכְנִית"
];

const wholeWords = [
  // nouns
  "חָק־",
  "^יָמִים$",
  "(מִ)?כָּל־", // kol w/ maqqef optionally preceded by mem
  "(וּבְ|וְ|בְּ|לְ)?כָל־", // kol w/ maqqef optionally preceded by shureq + bet, waw, bet, or lamed
  "^(מִ)?כָּל $", // kol w/o maqqef optionally preceded by mem
  "^(וּבְ|וְ|בְּ|לְ)?כָל $", // kol w/o maqqef optionally preceded by shureq + bet, waw, bet, or lamed
  "מָר־",
  "עָתְנִיאֵל",
  "רָב־",
  "תָם־",
  "תָּם־",
  // verbs
  "חָנֵּנִי",
  "וַיָּמָת",
  "וַיָּנָס",
  "וַיָּקָם",
  "וַיָּרָם",
  "וַיָּשָׁב",
  "וַתָּמָת",
  "וַתָּקָם",
  "וַתָּשָׁב"
];

const sequenceSnippets = (arr: string[]) => { 
  return arr.map((snippet) => (sequence(snippet.normalize("NFKD")).flat().join(""));
};

const snippetsRegx = sequenceSnippets(snippets);
const wholeWordsRegx = sequenceSnippets(wholeWords);

export const convertsQametsQatan = (word: string): string => {
  const qametsReg = /\u{05B8}/u;
  const hatefQamRef = /\u{05B3}/u;

  // if no qamets, return
  if (!qametsReg.test(word)) {
    return word;
  }

  // check for hatef qamets followed by qamets pattern
  if (hatefQamRef.test(word)) {
    const hatefPos = word.indexOf("\u{05B3}");
    const qamPos = word.indexOf("\u{05B8}");
    if (qamPos !== -1 && qamPos < hatefPos) {
      return word.substring(0, qamPos) + "\u{05C7}" + word.substring(qamPos + 1);
    }
  }

  const [noTaamim, charPos] = removeTaamim(word);

  // check if in verbal list (more frequent)
  for (const wholeWord of wholeWordsRegx) {
    const regEx = new RegExp(wholeWord);
    const match = noTaamim.match(regEx);

    if (!match) {
      continue;
    } else {
      const lastQam = word.lastIndexOf("\u{05B8}");
      return word.substring(0, lastQam) + "\u{05C7}" + word.substring(lastQam + 1);
    }
  }
  // check if in nominal list
  for (const snippet of snippetsRegx) {
    const regEx = new RegExp(snippet);
    const match = noTaamim.match(regEx);

    if (!match) {
      continue;
    } else {
      const start = charPos[match.index!]; // eslint-disable-line
      const end = charPos[match[0].length] + start;
      const matched = word.substring(start, end);
      const withQQatan = matched.split(qametsReg).join("\u{05C7}");
      word = word.split(matched).join(withQQatan);
      return word;
    }
  }

  return word;
};
