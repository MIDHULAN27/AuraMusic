import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import AlbumDetails from './pages/AlbumDetails';
import Favorites from './pages/Favorites';
import Albums from './pages/Albums';
import Artists from './pages/Artists';
import ArtistDetails from './pages/ArtistDetails';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import { LyricsProvider } from './context/LyricsContext';

function App() {
  useEffect(() => {
    document.title = "AuraMusic | Feel the Cosmic Rhythm";
  }, []);

  return (
    <BrowserRouter>
      <LyricsProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="album/:id" element={<AlbumDetails />} />
          <Route path="playlist/:id" element={<AlbumDetails />} />
          <Route path="artist/:id" element={<ArtistDetails />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="albums" element={<Albums />} />
          <Route path="artists" element={<Artists />} />
          <Route path="library" element={<Library />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        </Routes>
      </LyricsProvider>
    </BrowserRouter>
  );
}

export default App;
