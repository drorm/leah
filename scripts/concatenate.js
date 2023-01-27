#!/usr/bin/node
const fs = require("fs-extra");
const concat = require("concat");
const os = require("os");
const path = require("path");

const homeDir = os.homedir();
const targetDir = "../dist";

(async function build() {
  const files = ["./dist/runtime.js", "./dist/polyfills.js", "./dist/main.js"];
  await concat(files, `${targetDir}/leah-content.js`);
  await fs.copyFile("./dist/styles.css", `${targetDir}/leah-styles.css`);
  const mapfiles = [
    "./dist/runtime.js.map",
    "./dist/polyfills.js.map",
    "./dist/main.js.map",
  ];
  //  await concat(mapfiles, `${targetDir}/leah-content.js.map`);
})();
