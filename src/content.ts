/*
 * this is a content script to initialize content on the web page.
 * The only thing we do is the equivalent of the following:
 * <head>
 *   <link rel="stylesheet" href="leah-styles.css" />
 * </head>
 *
 *  <body>
 *  ... openai's content
 *
 *    <custom-root> </custom-root>
 *    <leah-content></leah-content>
 *    <script src="leah-content.js"></script>
 *    <script src="runtime.js" type="module"></script><script src="polyfills.js" type="module"></script><script src="vendor.js" type="module"></script><script src="main.js" type="module"></script>
 *  </body>
 * which will load the content Angular essentials app.
 * This is similar to dist/index.html
 */

// Inject the CSS into the header
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = chrome.runtime.getURL('styles.css');
document.head.appendChild(link);

// Inject the angular tags
const html3 = `
    <custom-root> Custom</custom-root>
    <leah-content>leah</leah-content>
`;
const div = document.createElement('div');
div.innerHTML = html3;
document.body.appendChild(div);

function appendScript(src: string) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = chrome.runtime.getURL('src');
  script.async = false;
  script.defer = false;
  try {
    document.body.appendChild(script);
  } catch (e) {
    console.error(`error in loading ${script}`);
    console.error(e);
  }
}

appendScript('runtime.js');
appendScript('polyfills.js');
appendScript('main.js');
appendScript('vendor.js');
