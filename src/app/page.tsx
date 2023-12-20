"use client";
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { RingLoader } from "react-spinners"; // Import the 

import { Prediction } from "replicate";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // State to track loading status

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when the request starts

    const response = await fetch("/api/predictions", {
      method: "POST",
      body: new FormData(e.currentTarget),
    });

    let prediction = await response.json();

    if (response.status !== 201) {
      setError(prediction.detail);
      setIsLoading(false); // Stop loading on error
      return;
    }

    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id, { cache: 'no-store' });
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        setIsLoading(false); // Stop loading on error
        return;
      }
      setPrediction(prediction);
    }
    setIsLoading(false); // Stop loading when the request completes
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="flex flex-col z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex bg-white p-10 border-solid border-2 border-gray-300 rounded-3xl">
        <Head>
          <title>ZiggySlide</title>
        </Head>
      
       
        
      
          <p className="mb-4 text-lg text-gray-700">ZiggySlide</p>
          <p className="mb-4 text-lg text-gray-700">A Synthetic Influencer</p>
                
                <Image
                    src="/1.png"
                    alt={`ziggyslide`}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full rounded-md border-gray-300"
                  />
          <p className="m-4 text-lg text-gray-700 "> A Colorful Male Red Hair Influencer having Adventures on an Inflatable Sliding Board</p>
          <p>Instantiate a Synthetic Influencer with this AI model trained to create and instantiate an specific fictional character and world.</p>
          <br/>
        <p>You may play with the following prompt samples copy pasting, mixing and adding | always invoque the concept with the word: ziggyslide:</p>
        <br/>
         <p> <i>ziggyslide, wide angle, handsome guy ginger, selfie,  colorful outfit,  mirror goggles,  colorful helmet designs,  short beard,  bulge, water slide, splash action shot, expressive </i></p> 
         <br/>
         <p> <i>ziggyslide, wide angle, handsome guy ginger with long curly hair floating in all directions and shirtless, selfie,  muscular torso and legs, colorful kilt short and open,  mirror goggles,  short beard and mustache,  bulge, under water, synchronized swimming, colorful boots </i></p> 
         <br/>
         <p> <i>ziggyslide, wide angle, handsome guy ginger  shirtless, selfie,  muscular torso and legs, colorful speedo bulge,  mirror goggles, colorful helmet, short beard and mustache,  splashing water,  colorful boots </i></p> 
          <br/>
          <p> <i>ziggyslide, wide angle, handsome guy ginger sin colorful outfit, selfie,  muscular torso and legs,  bulge,  mirror goggles, colorful helmet, short beard and mustache,  splashing water,  colorful boots , screeming</i></p> 
          <br/>
        

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
          <input
            type="text"
            name="prompt"
            placeholder="Enter ziggyslide + prompt to generate images"
            className="px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 mt-4 w-full bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate Adventure!
          </button>
        </form>
        <br/>
        <p>This app and model are part of the project The (AI) Model is the Message</p>
         <p> Concept and development by Marlon Barrios Solano running {" "}
          <a href="https://replicate.com/marlonbarrios/sdxl-ziggislide">
            SDXL on Replicate.
          
          </a>
        </p>
        <p>Follow me on {" "}
          <a href="https://www.instagram.com/marlonbarriossolano/">
            Instagram.
          
          </a>
        </p>
        {error && <div className="mt-4 text-red-500">{error}</div>}

        {isLoading ? (
          <div className="mt-4">
            <RingLoader color="#104a7d"
            size={120}  />
           
          </div>
        ) : (
          prediction && (
            <div className="mt-4">
              {prediction.output && prediction.output.map((url: string, index: number) => (
                <div key={index} className="flex flex-col items-center justify-center w-full mb-4">
                  <Image
                    src={url}
                    alt={`output ${index}`}
                    width={500}
                    height={500}
                    className="object-cover w-full h-full rounded-md border-gray-300"
                  />
                </div>
              ))}
          
              <p className="mt-4 text-lg text-gray-700">status: {prediction.status}</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
