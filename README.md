# Leah: Language Educator And Helper

## Overview

Leah is a Google Chrome extension that combines voice recognition, voice synthesis and ChatGPT to provide an environment where you can improve your foreign language skills.
_Leah works only on https://chat.openai.com/chat_.

## Installation

In Google Chrome go to XXX and install the extension

## Use

Read [the docs](href="https://drorm.github.io/leah/).

## From source

1. Clone this repo
2. Run yarn install
3. cd contenets
4. npm run dev
5. In Chrome, go to chrome://extensions/, click **Load unpacked** and point at the contents/dist directory.

## Repo structure and extension architecture

Leah is a Chrome extension, but almost all of the functionality is in the contents part of the extension. There's no background.js and very little in extern.html which is invoked when you click on the icon.

- The content of Leah is loaded by content.ts.
- Leah is implemented as an Angular Element which is in turn a Web Component and is loaded by injecting

```
<custom-root> Custom</custom-root>
<leah-content>leah</leah-content>
```
