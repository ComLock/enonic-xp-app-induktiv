import getIn from 'get-value';
import libContent from '/lib/xp/content';
import libUtil from '/lib/util';

const forceArray = libUtil.data.forceArray;
const queryContent = libContent.query;
const toStr = libUtil.toStr;

const FORMS = [
  'singularItemSet.masculin',
  'singularItemSet.feminine',
  'singularItemSet.neuter',
  'singularItemSet.indefinite',
  'singularItemSet.indefiniteGenitive',
  'singularItemSet.particularGenitive',
  'pluralItemSet.plural',
  'pluralItemSet.indefinite',
  'pluralItemSet.indefiniteGenitive',
  'pluralItemSet.particular',
  'pluralItemSet.particularGenitive'
];

const VERB_FORMS = [
  'infinitive',
  'present',
  'preteritum',
  'presentPerfectTense',
  'imperative',
  'perfectParticipleItemSet.masculin',
  'perfectParticipleItemSet.feminine',
  'perfectParticipleItemSet.neuter',
  'perfectParticipleItemSet.particular',
  'perfectParticipleItemSet.plural',
  'presentParticiple'
];

function getWords() {
  const wordsRes = queryContent({
    contentTypes: [
      `${app.name}:verb`,
      `${app.name}:word`
    ],
    count: -1
  });
  //log.info(`wordsRes:${toStr(wordsRes)}`);

  const words = {
    adverbArray: [],
    characterArray: [],
    godArray: [],
    linkingWordArray: [],
    personArray: [],
    nounArray: [],
    prepositionArray: [],
    pronounArray: [],
    verbArray: []
  };

  wordsRes.hits.forEach((item) => {
    //log.info(`item:${toStr(item)}`);
    FORMS.forEach((path) => {
      //log.info(`path:${toStr(path)}`);
      const word = getIn(item.data,path,'').toLowerCase();
      //log.info(`word:${toStr(word)}`);
      if (word) {
        if(item.data.character && !words.characterArray.includes(word)) {
          //log.info(`character word:${toStr(word)}`);
          words.characterArray.push(word);
        }
        if(item.data.god && !words.godArray.includes(word)) {
          //log.info(`god word:${toStr(word)}`);
          words.godArray.push(word);
        }
        if(item.data.pronoun && !words.pronounArray.includes(word)) {
          //log.info(`pronoun word:${toStr(word)}`);
          words.pronounArray.push(word);
        }
      } // if word
    }); // foreach path

    VERB_FORMS.forEach((path) => {
      forceArray(getIn(item.data,path,'')).forEach((word) => {
        const lowerCaseWord = word.toLowerCase();
        if (lowerCaseWord) {
          if(item.data.verb && !words.verbArray.includes(lowerCaseWord)) {
            //log.info(`verb word:${toStr(lowerCaseWord)}`);
            words.verbArray.push(lowerCaseWord);
          }
        }
      });


    });

    if (item.data.character) {
      if (!words.characterArray.includes(item.displayName.toLowerCase())) {
        words.characterArray.push(item.displayName.toLowerCase());
      }
    }

    if (item.data.god) {
      if (!words.godArray.includes(item.displayName.toLowerCase())) {
        words.godArray.push(item.displayName.toLowerCase());
      }
    }

    if (item.data.linkingWord) {
      if (!words.linkingWordArray.includes(item.displayName.toLowerCase())) {
        words.linkingWordArray.push(item.displayName.toLowerCase());
      }
    }

    if (item.data.person) {
      if (!words.personArray.includes(item.displayName.toLowerCase())) {
        words.personArray.push(item.displayName.toLowerCase());
      }
    }

    if (item.data.adverb) {
      if (!words.adverbArray.includes(item.displayName.toLowerCase())) {
        words.adverbArray.push(item.displayName.toLowerCase());
      }
    }

    if (item.data.noun) {
      if (!words.nounArray.includes(item.displayName.toLowerCase())) {
        words.nounArray.push(item.displayName.toLowerCase());
      }
    }

    if (item.data.preposition) {
      if (!words.prepositionArray.includes(item.displayName.toLowerCase())) {
        words.prepositionArray.push(item.displayName.toLowerCase());
      }
    }

    if (item.data.pronoun) {
      if (!words.pronounArray.includes(item.displayName.toLowerCase())) {
        words.pronounArray.push(item.displayName.toLowerCase());
      }
    }

    if (item.data.verb) {
      if (!words.verbArray.includes(item.displayName.toLowerCase())) {
        words.verbArray.push(item.displayName.toLowerCase());
      }
    }
  });
  //log.info(`words:${toStr(words)}`);
  return words;
} // export function getWords


function analyzeText(params) {
  const text = params.text;
  const words = params.words;
  const found = {
    character: [],
    linking: [],
    person: [],
    god: []
  };
  const html = text.split(/\b/).map((word) => {
    const lowerCaseWord = word.toLowerCase();
    const classes = [];
    if (words.adverbArray.includes(lowerCaseWord)) { classes.push('adverb'); }
    if (words.personArray.includes(lowerCaseWord)) {
      classes.push('person');
      if (!found.person.includes(word)) { found.person.push(word); }
    }
    if (words.godArray.includes(lowerCaseWord)) {
      classes.push('god');
      if (!found.god.includes(word)) { found.god.push(word); }
    }
    if (words.characterArray.includes(lowerCaseWord)) {
      classes.push('character');
      if (!found.character.includes(word)) { found.character.push(word); }
    }
    if (words.linkingWordArray.includes(lowerCaseWord)) {
      classes.push('bind');
      if (!found.linking.includes(word)) { found.linking.push(word); }
    }
    if (words.prepositionArray.includes(lowerCaseWord)) { classes.push('preposition'); }
    if (words.pronounArray.includes(lowerCaseWord)) { classes.push('pronoun'); }
    if (words.nounArray.includes(lowerCaseWord)) { classes.push('noun'); }
    if (words.verbArray.includes(lowerCaseWord)) { classes.push('verb'); }
    if ([
      '.',
      ':',
      ': «',
      '.»',
      ' – ',
      ',',
      ', '
    ].includes(word)) { classes.push('punctuation'); }
    return `<span class="${classes.join(' ')}">${word}</span>`;
  }).join('');
  return {
    found,
    html
  };
}

module.exports = {
  analyzeText: analyzeText,
  getWords: getWords
};
