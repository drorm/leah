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
// Inject the scripts into the page
let scr = document.createElement('script');
scr.type = 'text/javascript';
scr.src = chrome.runtime.getURL('runtime.js');
scr.async = false;
scr.defer = false;
try {
  (document.head || document.documentElement).appendChild(scr);
} catch (e) {
  console.error('error in loading runtime.js');
  console.error(e);
}

// Lazy copy and paste, but clearer
scr = document.createElement('script');
scr.type = 'text/javascript';
scr.src = chrome.runtime.getURL('polyfills.js');
scr.async = false;
scr.defer = false;
try {
  (document.head || document.documentElement).appendChild(scr);
} catch (e) {
  console.error('error in loading polyfills.js');
  console.error(e);
}

scr = document.createElement('script');
scr.type = 'text/javascript';
scr.src = chrome.runtime.getURL('main.js');
scr.async = false;
scr.defer = false;
try {
  (document.head || document.documentElement).appendChild(scr);
} catch (e) {
  console.error('error in loading main.js');
  console.error(e);
}

// Inject the CSS into the page
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = chrome.runtime.getURL('styles.css');
document.head.appendChild(link);
const html3 = `
    <custom-root> Custom</custom-root>
    <leah-content>leah</leah-content>
`;
const div = document.createElement('div');
div.innerHTML = html3;
document.body.insertBefore(div, document.body.firstChild);
