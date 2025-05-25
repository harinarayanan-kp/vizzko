// components/PromptLayout.tsx
'use client';

import { useState } from 'react';

const SIZES = ['M', 'L', 'XL'];

export default function PromptLayout() {
  const [prompt, setPrompt] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');

  return (
    <div className="w-full min-h-screen bg-white/80 backdrop-blur-md flex flex-col items-center py-12">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* Image and Options Row */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Box */}
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-gray-200 rounded-lg shadow-md w-full h-64 flex items-center justify-center text-gray-500 text-lg">
              Image will appear here
            </div>
          </div>
          {/* Right Controls */}
          <div className="flex flex-col items-start gap-8 min-w-[120px] md:min-w-[150px]">
            {/* Size Selector */}
            <div className="flex gap-3">
              {SIZES.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-1 rounded-lg font-bold shadow transition-all 
                    ${selectedSize === size 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {/* Buy Button */}
            <button
              className="w-32 h-10 rounded-md bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition-colors flex items-center justify-center text-base"
              onClick={() => alert(`Buy T-shirt size: ${selectedSize}`)}
            >
              Buy
            </button>
          </div>
        </div>
        {/* Prompt Input Row */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            className="flex-1 bg-gray-100 rounded-md py-4 px-6 shadow text-lg text-black outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
            placeholder="Type your prompt here..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
          <button
            className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Send prompt"
            onClick={() => {
              // Add your send logic here
              alert(`Sent prompt: ${prompt} (Size: ${selectedSize})`);
              setPrompt('');
            }}
            disabled={!prompt.trim()}
            style={{ opacity: prompt.trim() ? 1 : 0.7 }}
          >
            {/* Send Icon (SVG) */}
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M22 2L11 13"></path>
              <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
