import { getHomeData, getAlbum } from './sonicstream-app/src/api/api.js';

async function test() {
  console.log("Testing getHomeData...");
  const home = await getHomeData();
  console.log("Home data trending count:", home.trending?.length);
  
  console.log("Testing getAlbum...");
  const album = await getAlbum('11345431'); // Dheema
  console.log("Album title:", album?.title);
  console.log("Album songs count:", album?.songs?.length);
  if (album?.songs?.length > 0) {
      console.log("First song lyrics:", album.songs[0].lyrics ? "Found" : "Not Found");
  }
}
test();
