import { Video } from './interfaces';
import OpenAI from 'openai';

// get prompt, model and apiKey from localStorage
const getConfig = async (): Promise<{ prompt: string; model: string; apiKey: string }> => {
	return new Promise((resolve) => {
		chrome.storage.local.get(['prompt', 'model', 'apiKey'], (result) => {
			resolve({
				prompt: result.prompt,
				model: result.model,
				apiKey: result.apiKey
			})
		});
	})
};

// call the openAI api
const openAIClassify = async (videos: Video[]): Promise<Video[]> => {
	const { prompt, model, apiKey } = await getConfig();
	console.log("model: ", model);
	const openai = new OpenAI({apiKey: apiKey});
	const systemPrompt = 'Given a dataset, output a json "output":  with an array with 1 for items related to ' + prompt + ' and 0 for those that are not. No extra tokens only the array.';
	console.log("systemPrompt: ", systemPrompt);

	const batchSize = 20;
	const totalBatches = Math.ceil(videos.length / batchSize);
	for (let i = 0; i < totalBatches; i++){
		const batchData = videos.slice(i * batchSize, (i + 1) * batchSize);
		const userPrompt = `Dataset: ${JSON.stringify(batchData.map(video => video.title))}`;
    console.log("userPrompt: ", userPrompt);

		const ones = Array.from({ length: batchData.length }, () => 1);

		try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
					{ "role": 'system', "content": systemPrompt},
					{ "role": 'user', "content": userPrompt}
				]
      });

      const output = JSON.parse(response.choices[0].message.content || `${JSON.stringify(ones)}`);
      console.log(output);
			batchData.forEach((video, index) => {
        video.visible = output["output"][index] === 1;
      });
    } catch (error) {
			batchData.forEach((video, index) => {
        video.visible = ones[index] === 1;
      });
      console.error("Error calling OpenAI API:", error);
    }
	}

	return videos;
}

// classify videos
const classify = async (videoList: Video[]) : Promise<Video[]> => {
	return await openAIClassify(videoList);
};

export default classify;