/*
Gestionnaire de l'interface utilisateur
*/

export class UIManager {
    constructor() {
        this.searchBar = document.getElementById('searchBar');
        this.suggestions = document.getElementById('suggestions');
        this.pokemonData = document.getElementById('pokemonData');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Gestion des clics à l'extérieur des suggestions
        document.addEventListener('click', (event) => {
            const isClickInside = this.searchBar.contains(event.target) || 
                                this.suggestions.contains(event.target);
            if (!isClickInside) {
                this.suggestions.style.display = 'none';
            }
        });

        // Affichage des suggestions lors du focus
        this.searchBar.addEventListener('focus', () => {
            this.suggestions.style.display = 'block';
        });
    }

    clearSuggestions() {
        this.suggestions.innerHTML = '';
    }

    addSuggestion(pokemon, currentLanguage, onClick) {
        const capitalizedPokemon = this.capitalizeFirstLetter(pokemon);
        const li = document.createElement('li');
        li.textContent = capitalizedPokemon;
        li.addEventListener('click', () => onClick(pokemon, currentLanguage));
        this.suggestions.appendChild(li);
    }

    showPokemonNotFound() {
        this.pokemonData.innerHTML = `<div class="grid-item"><h2>Pokémon not found</h2></div>`;
    }

    displayPokemonData(html) {
        this.pokemonData.innerHTML = html;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getSearchQuery() {
        return this.searchBar.value.toLowerCase();
    }

    setupSearchInput(onInput) {
        this.searchBar.addEventListener('input', onInput);
    }
}