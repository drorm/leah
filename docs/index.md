# Leah: Language Educator And Helper

## Overview

Leah combines voice recognition, voice synthesis and ChatGPT to provide an environment where you can improve your foreign language skills.

## Basic operation

1. On page load, press the red button to tell Leah to start listening.
2. Leah converts your voice to text and sends it to ChatGPT.
3. ChatGPT responds and Leah speaks the response.

<img src="{{site.url}}/images/dual-language-screenshot.png" style="display: block; margin: auto;" />

## Prompts

Things get interesting once you incorporate prompts.

1. You choose a prompt in settings.
2. Leah sends the prompt to ChatGPT whenever you reload the page.
3. The prompt applies to the rest of the conversation with ChatGPT.

### Examples:

- I want you to pretend to be a French native speaker who lives in Paris. Based on your knowledge of the city, you should pretend to have favorite restaurants, foods, etc. I will speak in English and you will reply in French until I ask you to stop. Keep your responses brief and the language simple, at the A2 CEFR level. To start, tell me a random fact about Paris.
- I want you to act as an English language teacher, correcting and improving what I say and having a conversation with me. The corrected part should be between ``` to distinguish it from the conversation. I want you to only reply with the correction, the improvements, and nothing else, do not write explanations. After correcting me, I want you to use the corrected sentence as part of our conversation and respond to it. Keep the corrections and explanations brief and the language simple at the A1 CEFR level, but keep the conversation flowing. For instance: me: Hello, you good you: '''Hello, how are you doing?''' I'm doing fine, how are you? My first sentence is: 'you good today'.
- I want you to be a translator from English to Spanish as spoken in Spain. You should only translate, do not answer or comment on any of the content. My first sentence is "Hello, how are you?"

## Creating, updating and deleting prompts

Underneath the prompts drop down there's a table of the existing prompts.

- Click on _Create_ to create a new prompt
- Click on the _Edit_ (Pencil) icon to update a prompt
- Click on the _Delete_ (Garbage) icon to delete a prompt

### Prompts languages

To make prompts work correctly, they have listening and speaking languages associated with them. So for the last one, the translator from English to Spanish, they are:

- listenVoice: 'en-us' (US English)
- speakVoice: 'es-es' (Spain Spanish)

Note: Not all languages are available, so use the drop-downs to figure out which ones work for you.

### Prompts prefix

- You can set a prefix to send to the bot each time you talk to it.
  Sometimes it's hard to get the bot to stick to a task, so the prefix helps. In the case of asking it to be a translator:

```
I want you to be a translator from English to Spanish as spoken in Spain.
You should only translate, do not answer or comment on any of the content.
My first sentence is "Hello, how are you?"
```

it worked fine most of the time, and would translate, but with certain requests such as, "tell me a joke" or "what time is it", it would answer the request, rather than translating.
Adding a prefix: "translate: what time is it", fixes this issue.

## Settings

You can set the following in the settings:

- Bot speaking
  - language: the language the bot speaks to you
  - speed: the speed of the speech
- You speaking
  - language: the language the speech recognition expects
  - Recognition progress: when on, displays your words as they're recognized. These change as you speak.
- Prompt: which prompt you want to use. Hover over the choices to see the prompt.
