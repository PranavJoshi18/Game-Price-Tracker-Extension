import { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [search,setSearch] = useState("");
  const [games,setGames] = useState([]);
  const [fav,setFav] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchGames(search);
  } 

  const handleSearch = (e) => {
    setSearch(e.target.value);
  }
  
  const addtoFav = (game) => {
    chrome.storage.local.get("favoriteGames", (result) => {
      if (!fav.some(f => f.gameID === game.gameID)) { 
        const updatedFav = [...fav, game]; 
        setFav(updatedFav);
        console.log("added!");
        chrome.storage.local.set({favoriteGames: updatedFav}); 
    }});
  };
  

  async function fetchGames(search) {
    const api = `https://www.cheapshark.com/api/1.0/games?title=${search}`;
    const endpoint = api;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Network Response is not Ok');
      }
      const data = await response.json();
      setGames(data);
      console.log(games);
    }
    catch (error) {
      console.error("Error!");
    }
  }

  return (
    <div>
      <h1>Game Price Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={search} onChange={handleSearch} placeholder='Enter the game name.....'/>
        <button type='submit'><i class="fa-solid fa-magnifying-glass"></i></button>
      </form>
      <div className='box'>
      {games.length > 0 ? (
          games.map((game) => (
            <div key={game.id} className="game-card">
              <div className='img'>
                <img src={game.thumb} alt={game.external} width={90} height={140}/>
              </div>
              <div className='desc'>
                <h3>{game.external}</h3>
                <button onClick={()=>addtoFav(game)}><i class="fa-regular fa-bookmark"></i></button>
                 
              </div>
            </div>
          ))
        ) : (
          <p>No games found</p>
        )}
      </div>
      {console.log(fav)}
    </div>
  )
}