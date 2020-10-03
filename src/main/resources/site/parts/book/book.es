import '/lib/nashorn/polyfills';
import libUtil from '/lib/util';
import libContent from '/lib/xp/content';
import libPortal from '/lib/xp/portal';

import libWords from '/site/parts/verse/word';
import libChapter from '/site/parts/chapter/chapterToHtml';

const toStr = libUtil.toStr;
const getChildren = libContent.getChildren;
//const queryContent = libContent.query;
//const getComponent = libPortal.getComponent;
const getCurrentContent = libPortal.getContent;
const getWords = libWords.getWords;

const analyzeChapter = libChapter.analyzeChapter;

export function get(request) {

  const words = getWords();
  //log.info(`words:${toStr(words)}`);

  const content = getCurrentContent();
  //log.info(`content:${toStr(content)}`);

  const childrenRes = getChildren({
    key: content._id,
    count: -1,
    //sort: 'displayName ASC' // Not numerical
    sort: '_manualordervalue DESC'
  });
  //log.info(`childrenRes:${toStr(childrenRes)}`);

  const found = {
    character: [],
    linking: [],
    person: [],
    god: []
  };

  const html = `<div class="book"><div class="book-name">${content.displayName}</div>${childrenRes.hits.map((chapter) => {
    const analyzedChapter = analyzeChapter({
      content: chapter,
      words
    });
    analyzedChapter.found.character.forEach((item) => {
      if (!found.character.includes(item)) {
        found.character.push(item);
      }
    });
    analyzedChapter.found.linking.forEach((item) => {
      if (!found.linking.includes(item)) {
        found.linking.push(item);
      }
    });
    analyzedChapter.found.person.forEach((item) => {
      if (!found.person.includes(item)) {
        found.person.push(item);
      }
    });
    analyzedChapter.found.god.forEach((item) => {
      if (!found.god.includes(item)) {
        found.god.push(item);
      }
    });
    return analyzedChapter.html;
  }).join('\n')}</div><h2>Found</h2>
<table>
  <tbody>
    <tr>
      <th>Characters:</th>
      <td>${found.character.join(', ')}</td>
    </tr>
    <tr>
      <th>God words:</th>
      <td>${found.god.join(', ')}</td>
    </tr>
    <tr>
      <th>Linking words:</th>
      <td>${found.linking.join(', ')}</td>
    </tr>
    <tr>
      <th>Persons:</th>
      <td>${found.person.join(', ')}</td>
    </tr>
  </tbody>
</table>`;

  return {
    body: html,
    contentType: 'text/html;charset=utf-8'
  }; // return
} // export function get
