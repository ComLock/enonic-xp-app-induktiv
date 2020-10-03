import '/lib/nashorn/polyfills';
import libUtil from '/lib/util';
//import libContent from '/lib/xp/content';
import libPortal from '/lib/xp/portal';

import libWords from '/site/parts/verse/word';
import libChapter from '/site/parts/chapter/chapterToHtml';

const toStr = libUtil.toStr;
//const getChildren = libContent.getChildren;
//const queryContent = libContent.query;
//const getComponent = libPortal.getComponent;
const getCurrentContent = libPortal.getContent;
const getWords = libWords.getWords;


export function get(request) {
  //log.info(`request:${toStr(request)}`);

  const words = getWords();
  //log.info(`words:${toStr(words)}`);

  const content = getCurrentContent();
  //log.info(`content:${toStr(content)}`);

  const res = libChapter.analyzeChapter({
    content,
    words
  });
  //log.info(`res.found:${toStr(res.found)}`);

  const html = `${res.html}<h2>Found</h2>
<table>
  <tbody>
    <tr>
      <th>Characters:</th>
      <td>${res.found.character.join(', ')}</td>
    </tr>
    <tr>
      <th>God words:</th>
      <td>${res.found.god.join(', ')}</td>
    </tr>
    <tr>
      <th>Linking words:</th>
      <td>${res.found.linking.join(', ')}</td>
    </tr>
    <tr>
      <th>Persons:</th>
      <td>${res.found.person.join(', ')}</td>
    </tr>
  </tbody>
</table>`

  return {
    body: html,
    contentType: 'text/html;charset=utf-8'
  }; // return
} // function get
