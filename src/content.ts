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
//

function inject() {
  let scr = document.createElement('script');
  scr.type = 'text/javascript';
  scr.src = chrome.runtime.getURL('runtime.js');
  try {
    (document.head || document.documentElement).appendChild(scr);
  } catch (e) {
    console.log(e);
  }

  // Lazy copy and paste, but clearer
  scr = document.createElement('script');
  scr.type = 'text/javascript';
  scr.src = chrome.runtime.getURL('polyfills.js');
  try {
    (document.head || document.documentElement).appendChild(scr);
  } catch (e) {
    console.log(e);
  }

  scr = document.createElement('script');
  scr.type = 'text/javascript';
  scr.src = chrome.runtime.getURL('main.js');
  try {
    (document.head || document.documentElement).appendChild(scr);
  } catch (e) {
    console.log(e);
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
}

// Inject the scripts into the page once it's loaded
document.addEventListener('DOMContentLoaded', function (event) {
  inject();
});
