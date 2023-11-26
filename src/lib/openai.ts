import OpenAI from "openai";

const openai = new OpenAI();

export const getImageDescription = async (imageUrl: string) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Give the most accurate metadata description of what is happening in this image. It will be used to perform semantic serach on the images",
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
  });

  const description = response.choices[0]?.message.content;

  return description;
};
