import React from 'react';
import { useAudio } from '../Welcome/AudioContext';

const Header = () => {
  const { isPlaying, togglePlay } = useAudio();

  return (
    <header className="flex top-4 left-4"> {/* Fixed positioning to stay in view */}
      <button className="text-black p-2 rounded-full" onClick={togglePlay}>
        <i className={`bi ${isPlaying ? 'bi-pause-circle' : 'bi-play-circle'} text-4xl`}></i>
      </button>
    </header>
  );
};

export default Header;