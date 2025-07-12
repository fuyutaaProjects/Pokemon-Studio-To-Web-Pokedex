/*
Main file : starting point for loading the PokemonSearch page.
*/

import { PokemonSearchBar } from './modules/PokemonSearchBar.js';
import { UIManager } from './modules/UIManager.js';

document.addEventListener('DOMContentLoaded', () => {
    // cannot have two instances of the languageManager
    // languageManager should exist because in every page, in their html we init the LanguageManager as a script.
    if (window.languageManager) {
        const languageManager = window.languageManager;
        const uiManager = new UIManager();
        const pokemonSearch = new PokemonSearchBar(languageManager, uiManager);
        
        pokemonSearch.init();
    } else {
        console.error("LanguageManager isn't accessible in PokemonSearch.js although it should be running.");
    }
});