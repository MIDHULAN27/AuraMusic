import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { getLyrics, decodeHtmlEntities } from '../api/api';

const LyricsContext = createContext();

export const useLyrics = () => {
  const context = useContext(LyricsContext);
  if (!context) return { lyrics: null, parsedLyrics: [], activeLine: 0, isFetching: false };
  return context;
};

export const LyricsProvider = ({ children }) => {
  const { currentTrack, progress, isPlaying } = usePlayerStore();
  const [lyrics, setLyrics] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeLine, setActiveLine] = useState(0);
  const [parsedLyrics, setParsedLyrics] = useState([]);

  const parseLyrics = useCallback((lrcText) => {
    if (!lrcText || typeof lrcText !== 'string') return [];
    
    // Check if it's LRC format [mm:ss.xx]
    const hasTimestamps = lrcText.includes('[');
    
    if (!hasTimestamps) {
      // Fallback for plain text lyrics: divide duration by number of lines to simulate sync
      const lines = lrcText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const estDuration = 240; // Default estimate
      return lines.map((text, i) => ({
        text: decodeHtmlEntities(text),
        time: (i / lines.length) * estDuration
      }));
    }

    const lines = lrcText.split('\n');
    const result = [];
    // Enhanced regex for various LRC formats including [mm:ss:xx] and [mm:ss]
    const timeReg = /\[(\d{2,3}):(\d{2})(?:\.|\:)(\d{2,3})?\]/g;

    lines.forEach(line => {
      const text = line.replace(timeReg, '').trim();
      const times = line.match(timeReg);

      if (times && text) {
        times.forEach(t => {
          const match = /\[(\d{2,3}):(\d{2})(?:\.|\:)(\d{2,3})?\]/.exec(t);
          const mins = parseInt(match[1]);
          const secs = parseInt(match[2]);
          const ms = match[3] ? parseInt(match[3].padEnd(3, '0')) / 1000 : 0;
          const time = mins * 60 + secs + ms;
          result.push({ time, text: decodeHtmlEntities(text) });
        });
      }
    });

    return result.sort((a, b) => a.time - b.time);
  }, []);

  useEffect(() => {
    if (!currentTrack?.id) {
      setLyrics(null);
      setParsedLyrics([]);
      return;
    }

    const fetchLyrics = async () => {
      setIsFetching(true);
      try {
        const data = await getLyrics(currentTrack.id);
        if (data) {
          setLyrics(data);
          setParsedLyrics(parseLyrics(data.text));
        } else {
          setLyrics(null);
          setParsedLyrics([]);
        }
      } catch (e) {
        setLyrics(null);
      } finally {
        setIsFetching(false);
      }
    };

    fetchLyrics();
  }, [currentTrack?.id, parseLyrics]);

  useEffect(() => {
    if (!parsedLyrics.length || !isPlaying) return;

    const index = parsedLyrics.findIndex((line, i) => {
      const nextLine = parsedLyrics[i + 1];
      return progress >= line.time && (!nextLine || progress < nextLine.time);
    });

    if (index !== -1 && index !== activeLine) {
      setActiveLine(index);
    }
  }, [progress, parsedLyrics, activeLine, isPlaying]);

  return (
    <LyricsContext.Provider value={{
      lyrics,
      parsedLyrics,
      activeLine,
      isFetching
    }}>
      {children}
    </LyricsContext.Provider>
  );
};
