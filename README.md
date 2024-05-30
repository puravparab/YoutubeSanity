# YoutubeSanity

YoutubeSanity is an AI powered browser extension that selectively hides youtube videos that do not match the user's specified filter.

## Example

Prompt = "Machine learning, Gen AI, LLMS, Startups and Computer Science videos"

Model = "gpt-4o-2024-05-13"

Before             | After
:-------------------------:|:-------------------------:
![](https://github.com/puravparab/YoutubeSanity/blob/006d0cb2cb850ad3d60d840f23f790ffe40792a9/assets/YoutubeSanityBefore.png)  |  ![](https://github.com/puravparab/YoutubeSanity/blob/006d0cb2cb850ad3d60d840f23f790ffe40792a9/assets/YoutubeSanityAfter.png)

## Setup

Run following commands. This will create a dist directory. (Alternatively, you could download the dist.zip from releases)
```bash
git clone git@github.com:puravparab/YoutubeSanity.git
cd youtubesanity
npm ci
npm run build
```

Open Google Chrome and navigate to chrome://extensions. Enable "Developer mode" using the toggle switch in the top right corner. Click on "Load unpacked" and select the dist directory.

YoutubeSanity should now be installed and visible in your extensions list.

Click on the extension and add the following in the popup:
```bash
Prompt = <your prompt>
Model = "gpt-4o-2024-05-13"
API Key = <your OpenAI API key>
```