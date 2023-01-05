/*
 * this is a content script to initialize content on the web page.
 * The only thing we do is the equivalent of the following:
 * <head>
 *   <link rel="stylesheet" href="leah-styles.css" />
 * </head>
 *
 *  <body>
 *    <custom-root> </custom-root>
 *    <leah-content></leah-content>
 *    <script src="leah-content.js"></script>
 *  </body>
 * which will load the content Angular essentials app
 */

// Inject the script into the page
let scr = document.createElement('script');
scr.type = 'text/javascript';
scr.src = chrome.runtime.getURL('leah-content.js');
try {
  (document.head || document.documentElement).appendChild(scr);
} catch (e) {
  console.log(e);
}

// Inject the CSS into the page
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'leah-styles.css';
document.head.appendChild(link);
const html3 = `
    <custom-root> Custom</custom-root>
    <leah-content>leah</leah-content>
`;
const div = document.createElement('div');
div.innerHTML = html3;
document.body.insertBefore(div, document.body.firstChild);
