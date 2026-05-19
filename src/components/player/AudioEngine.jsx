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
  
  const { queue, currentIndex, setCurrentIndex } = useQueueStore();
  const audioRef = useRef(null);

  // Synchronize audio source
  useEffect(() => {
    if (!audioRef.current || !currentTrack?.url) return;

    const audio = audioRef.current;
    
    // Only change source if it's different
    if (audio.src !== currentTrack.url) {
      if (!currentTrack.url) {
        console.error("[AudioEngine] Cannot load track: URL is empty", currentTrack);
        return;
      }
      console.log(`[AudioEngine] Loading track: ${currentTrack.title}`);
      audio.src = currentTrack.url;
      audio.load();
      
      // Attempt to play if isPlaying is true
      if (isPlaying) {
        audio.play().catch(err => {
          console.warn("[AudioEngine] Play failed on source change:", err.message);
          // Auto-play might be blocked, but we don't force pause here
        });
      }
    }
  }, [currentTrack?.id, currentTrack?.url]);

  // Handle Play/Pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("[AudioEngine] Play blocked or failed:", error.message);
          setIsPlaying(false); // Sync store with actual state
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

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

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentTrack(queue[nextIndex]);
      setIsPlaying(true);
    } else if (repeatMode === 'all' && queue.length > 0) {
      setCurrentIndex(0);
      setCurrentTrack(queue[0]);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
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
          if (e.shiftKey) {
            // Simple prev logic
            if (audioRef.current.currentTime > 5) {
              audioRef.current.currentTime = 0;
            } else if (currentIndex > 0) {
              const prevIndex = currentIndex - 1;
              setCurrentIndex(prevIndex);
              setCurrentTrack(queue[prevIndex]);
              setIsPlaying(true);
            }
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentIndex, queue, setCurrentIndex, setCurrentTrack, setIsPlaying]);

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
