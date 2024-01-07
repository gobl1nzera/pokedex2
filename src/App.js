import './style.css';
import pokedexImage from './img/pokedex.png'; // Importe a imagem usando um alias (import) para facilitar o uso
import React, { useState, useEffect } from 'react';

function PokemonApp() {
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState('name'); // 'name' or 'id'
  const [pokemonName, setPokemonName] = useState('Loading...');
  const [pokemonNumber, setPokemonNumber] = useState('');
  const [pokemonImage, setPokemonImage] = useState('');

  const fetchPokemon = async (pokemon) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      return null;
    }
  };

  const renderPokemon = async () => {
    if (!searchInput) {
      // Limpar os estados quando não há entrada no input
      setPokemonName('');
      setPokemonNumber('');
      setPokemonImage('');
      return;
    }
  
    setPokemonName('Loading...');
    setPokemonNumber('');
    setPokemonImage('');
  
    try {
      let data;
      if (searchType === 'id') {
        data = await fetchPokemon(searchInput);
      } else {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchInput.toLowerCase()}`);
        data = await response.json();
      }
  
      if (data) {
        setPokemonImage(data.sprites.versions['generation-v']['black-white'].animated.front_default);
        setPokemonName(data.name);
        setPokemonNumber(data.id);
      } else {
        // Exibir "Not found :c" se ocorrer um erro na chamada à API
        setPokemonName('Not found :c');
        setPokemonNumber('');
      }
    } catch (error) {
      // Exibir "Not found :c" se ocorrer um erro na chamada à API
      setPokemonName('Not found :c');
      setPokemonNumber('');
      console.error('Error rendering Pokemon:', error);
    }
  };
  

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const lowercaseInput = searchInput.toLowerCase();
    setSearchInput(lowercaseInput);  // Atualiza o estado com o input em minúsculas
    renderPokemon();
  };

  const handleButtonPrevClick = () => {
    if (pokemonNumber > 1) {
      setSearchInput((prevNumber) => Number(prevNumber) - 1);
      setSearchType('id');
    }
  };

  const handleButtonNextClick = () => {
    setSearchInput((prevNumber) => Number(prevNumber) + 1);
    setSearchType('id');
  };

  useEffect(() => {
    renderPokemon();
  }, [searchInput, searchType]);

  return (
    <main>
      <h3 className="creator"> by lucas vale</h3>
      <img src={pokedexImage} alt="pokedex" />
      {pokemonImage && <img src={pokemonImage} alt="pokemon" className="pokemon__image" />}
      

      <h1 className="pokemon__data">
        <span className="pokemon__number">{pokemonNumber}  </span> 
        <span className="pokemon__name">{pokemonName}</span>
      </h1>

      <form className="form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="input__search"
          placeholder="Nome ou número..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          required
        />
      </form>

      <div className="buttons">
        <button className="button btn-prev" onClick={handleButtonPrevClick}>
          Prev &lt;
        </button>
        <button className="button btn-next" onClick={handleButtonNextClick}>
          Next &gt;
        </button>
      </div>
    </main>
  );
}

export default PokemonApp;