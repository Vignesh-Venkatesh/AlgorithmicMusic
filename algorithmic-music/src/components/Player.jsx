import React, { useState, useEffect } from "react";
import { startAudioContext, setup, stopSequence } from "../utils/toneUtils";
import { FaPlay, FaStop } from "react-icons/fa6";

const Player = () => {
  const [isAudioStarted, setIsAudioStarted] = useState(false);

  const handleStartAudio = async () => {
    if (!isAudioStarted) {
      try {
        await startAudioContext();
        setup();
        setIsAudioStarted(true);
      } catch (error) {
        console.error("Error starting audio:", error);
      }
    }
  };

  const handleStopAudio = () => {
    if (isAudioStarted) {
      stopSequence();
      setIsAudioStarted(false);
    }
  };

  return (
    <div className="bg-gray-800 w-1/2 m-auto h-3/4 rounded-lg p-6 flex flex-col items-center justify-center">
      {/* Play/Stop button */}
      <div className="mt-4">
        {isAudioStarted ? (
          <FaStop
            onClick={handleStopAudio}
            className="text-7xl text-white cursor-pointer hover:text-red-400 transition-colors"
          />
        ) : (
          <FaPlay
            onClick={handleStartAudio}
            className="text-7xl text-white cursor-pointer hover:text-green-400 transition-colors"
          />
        )}
      </div>
    </div>
  );
};

export default Player;
