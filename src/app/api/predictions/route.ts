import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {

  const data = await req.formData();
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const prediction = await replicate.predictions.create({
    // Pinned to a specific version of Stable Diffusion
    // See https://replicate.com/stability-ai/sdxl
    version: "5a5401246950a98445013f4dc6372b40e23f2ff9ad4b846ce5d120b7477660bb",

    // This is the text prompt that will be submitted by a form on the frontend
    input: 
    { prompt: data.get("prompt"),
    width: 1024,
      height: 1024,
    //  seed: 42,
      scheduler: "K_EULER",
      lora_scale: 0.42,
      num_outputs: 2,
      guidance_scale: 7.5,
      apply_watermark: true,
      high_noise_frac: 0.8,
      negative_prompt: "no wrinkles in face",
      prompt_strength: 0.92,
      num_inference_steps: 50
  
  
  },
  });

  if (prediction?.error) {
    return new Response(
      JSON.stringify({ detail: prediction.error.detail }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify(prediction),
    { status: 201 }
  );
}