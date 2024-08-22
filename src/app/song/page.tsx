"use client";

import { useState } from "react";

export default function Page() {
  const [songIdea, setSongIdea] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Pop"); // Default genre

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSongIdea(event.target.value);
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(event.target.value);
  };

  const isGenerateButtonEnabled = songIdea.trim() !== '';
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header (Assuming this is in your song/layout.tsx) */}

      <main className="container mx-auto p-8 flex-grow flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-6">Create New Song</h1>

        {/* Song Idea Input */}
        <textarea 
          className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Enter your song idea, lyrics, or any inspiration here..."
          value={songIdea}
          onChange={handleInputChange}
          rows={6}
        />

        {/* Style/Genre Selection */}
        <div className="mb-4">
          <label htmlFor="genre" className="block text-gray-700 font-semibold mb-2">
            Style/Genre
          </label>
          <select 
            id="genre" 
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={selectedGenre}
            onChange={handleGenreChange}
          >
            <option value="Pop">Pop</option>
            <option value="Rock">Rock</option>
            <option value="Hip-Hop">Hip-Hop</option>
            <option value="Electronic">Electronic</option>   

            <option value="Country">Country</option>   

            {/* Add more genres as needed */}
          </select>
        </div>

        {/* Additional Options (You can add these later if required) */}

        {/* Call to Action Button */}
        <button 
          className={`bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded ${
            !isGenerateButtonEnabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!isGenerateButtonEnabled}
          // onClick={handleGenerateSuggestions} (You'll implement this later)
        >
          Generate Suggestions
        </button>

      </main>

      {/* Footer (Optional, if not in layout) */}

    </div>
  )
}
