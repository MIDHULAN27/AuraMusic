import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useQueueStore } from '../../store/useQueueStore';

const AudioEngine = () => {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    repeatMode,
    setProgress,
    setDuration,
    setIsPlaying,
    setCurrentTrack
  } = usePlayerStore();
  
  const { queue, currentIndex, setCurrentIndex, playNext, playPrevious } = useQueueStore();
  const audioRef = useRef(null);

  // Synchronize audio source and playback state
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    // Handle source updates
    if (currentTrack?.url) {
      if (audio.src !== currentTrack.url) {
        console.log(`[AudioEngine] Loading track source: ${currentTrack.title}`);
        audio.src = currentTrack.url;
        audio.load();
      }
    } else {
      audio.src = '';
      audio.pause();
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
      return;
    }

    // Handle play/pause state
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // If play was aborted due to source swap, do NOT pause or desync isPlaying!
          if (error.name !== 'AbortError') {
            console.warn("[AudioEngine] Play failed:", error.message);
            setIsPlaying(false); // Sync store with actual state
          } else {
            console.log("[AudioEngine] Play aborted due to track change. Keeping isPlaying=true.");
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [currentTrack?.id, currentTrack?.url, isPlaying]);

  // Handle Seeking
  const { seekTo, setSeekTo } = usePlayerStore();
  useEffect(() => {
    if (audioRef.current && seekTo !== null) {
      audioRef.current.currentTime = seekTo;
      setSeekTo(null); // Reset after applying
    }
  }, [seekTo, setSeekTo]);

  // Handle Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      console.log(`[AudioEngine] Metadata loaded. Duration: ${audioRef.current.duration}`);
      setDuration(audioRef.current.duration);
    }
  };



  const onEnded = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      playNext();
    }
  };

  const onError = (e) => {
    console.error("[AudioEngine] Audio playback error:", e);
    // If a track fails, maybe skip to next?
    // playNext();
  };

  // Global Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input/textarea
      const target = e.target;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case 'ArrowRight':
          if (audioRef.current) {
            e.preventDefault();
            audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
          }
          break;
        case 'ArrowLeft':
          if (audioRef.current) {
            e.preventDefault();
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
          }
          break;
        case 'KeyN':
          if (e.shiftKey) playNext();
          break;
        case 'KeyP':
          if (e.shiftKey) playPrevious();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentIndex, queue, setCurrentIndex, setCurrentTrack, setIsPlaying, playNext, playPrevious]);

  return (
    <audio
      ref={audioRef}
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={onLoadedMetadata}
      onEnded={onEnded}
      onError={onError}
      preload="auto"
      style={{ display: 'none' }}
    />
  );
};

export default AudioEngine;
