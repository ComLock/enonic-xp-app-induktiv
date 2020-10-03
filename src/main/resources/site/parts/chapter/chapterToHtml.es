//import libUtil from '/lib/util';
import libContent from '/lib/xp/content';
import libWords from '/site/parts/verse/word';

module.exports = {
  analyzeChapter: (params) => {
    const content = params.content;
    const words = params.words;
    const childrenRes = libContent.getChildren({
      key: content._id,
      count: -1,
      //sort: 'displayName ASC' // Not numerical
      sort: '_manualordervalue DESC'
    });
    const found = {
      character: [],
      linking: [],
      person: [],
      god: []
    };
    //log.info(`childrenRes:${libUtil.toStr(childrenRes)}`);
    const html = `<div class="chapter"><div class="chapter-number">${content.displayName}</div>${childrenRes.hits.map((verse) => {
      const analyzedVerse = libWords.analyzeText({
        text: verse.data.text,
        words
      });
      analyzedVerse.found.character.forEach((item) => {
        if (!found.character.includes(item)) {
          found.character.push(item);
        }
      });
      analyzedVerse.found.linking.forEach((item) => {
        if (!found.linking.includes(item)) {
          found.linking.push(item);
        }
      });
      analyzedVerse.found.person.forEach((item) => {
        if (!found.person.includes(item)) {
          found.person.push(item);
        }
      });
      analyzedVerse.found.god.forEach((item) => {
        if (!found.god.includes(item)) {
          found.god.push(item);
        }
      });
      return `<div class="verse"><div class="verse-number">${verse.displayName}</div>${analyzedVerse.html}</div>`;
    }).join('\n')}</div>`;
    return {
      found,
      html
    };
  } // analyzeChapter
};
