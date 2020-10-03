import '/lib/nashorn/polyfills';
import libUtil from '/lib/util';
import libPortal from '/lib/xp/portal';

const toStr = libUtil.toStr;
const assetUrl = libPortal.assetUrl;
const getCurrentContent = libPortal.getContent;

export function get(request) {
  //log.info(`request:${toStr(request)}`);

  const content = getCurrentContent();
  //log.info(`content:${toStr(content)}`);

  //const regions = content.page.regions;
  //log.info(`regions:${toStr(regions)}`);

  const components = content.page.regions.main.components;
  //log.info(`components:${toStr(components)}`);

  return {
    body: `<html>
  <head>
    <link rel="stylesheet" type="text/css" href="${assetUrl({path:'style/all.min.css'})}"/>
    <title></title>
  </head>
  <body>
    <main data-portal-region="main">${(components && components.length) ? components.map((c) => `<!--# COMPONENT ${c.path} -->`) : ''}</main>
  </body>
</html>`,
    contentType: 'text/html;charset=utf-8'
  }; // return
} // export function get
