import '/lib/nashorn/polyfills';
import libUtil from '/lib/util';
import libContent from '/lib/xp/content';
import libPortal from '/lib/xp/portal';

import libWords from '/site/parts/verse/word';

const toStr = libUtil.toStr;
const queryContent = libContent.query;
//const getComponent = libPortal.getComponent;
const getCurrentContent = libPortal.getContent;
const getWords = libWords.getWords;
const analyzeText = libWords.analyzeText;



export function get(request) {
  //log.info(`request:${toStr(request)}`);

  const words = getWords();

  //const component = getComponent();
  //log.info(`component:${toStr(component)}`);

  const content = getCurrentContent();
  //log.info(`content:${toStr(content)}`);

  const text = content.data.text;
  //log.info(`text:${toStr(text)}`);

  const res = analyzeText({
    text,
    words
  });

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
</table>`;

  //log.info(`html:${toStr(html)}`);

  return {
    body: html,
    contentType: 'text/html;charset=utf-8'
  }; // return
} // export function get
