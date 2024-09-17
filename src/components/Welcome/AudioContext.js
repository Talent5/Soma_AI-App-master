import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import song from './song/peace.mp3';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const response = await fetch(song);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        
        audio.oncanplaythrough = () => {
          console.log("Audio can play through");
          audioRef.current = audio;
        };
        
        audio.onerror = (e) => {
          console.error("Error loading audio:", e);
          setError(`Failed to load audio file: ${e.message}`);
        };
      } catch (e) {
        console.error("Error fetching audio:", e);
        setError(`Failed to fetch audio file: ${e.message}`);
      }
    };

    loadAudio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playAudio = async () => {
      if (isPlaying) {
        try {
          await audio.play();
        } catch (error) {
          console.error("Error playing audio:", error);
          setError(`Failed to play audio: ${error.message}`);
          setIsPlaying(false);
        }
      } else {
        audio.pause();
      }
    };

    playAudio();
    
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (error) {
      console.log("Attempting to reload audio");
      setError(null);
      const audio = new Audio('/song/peace.mp3');
      audio.oncanplaythrough = () => {
        console.log("Audio reloaded and can play through");
        audioRef.current = audio;
        setIsPlaying(true);
      };
      audio.onerror = (e) => {
        console.error("Error reloading audio:", e);
        setError(`Failed to reload audio file: ${e.message}`);
      };
    } else {
      setIsPlaying(prevState => !prevState);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay, error }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};