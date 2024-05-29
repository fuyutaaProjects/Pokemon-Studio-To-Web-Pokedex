/*
fuyutaa: 
I suggest you inspect the page in your browser to see how it's structured. 
The page works in multiple divs that are tagged as layers: .grid-container-layer1, and it currently goes to 4.
*/


document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const suggestions = document.getElementById('suggestions');
    const pokemonData = document.getElementById('pokemonData');
    let pokemonList = [];

    // Checks for clicks outside of result suggestions when searching in the searchbar, and if you click outside it, the results are closed.
    document.addEventListener('click', (event) => {
        const isClickInside = searchBar.contains(event.target) || suggestions.contains(event.target);
        if (!isClickInside) {
            suggestions.style.display = 'none';
        }
    });

    searchBar.addEventListener('focus', () => {
        suggestions.style.display = 'block';
    });

    const urlParams = new URLSearchParams(window.location.search);
    const languageParam = urlParams.get('lang');
    currentLanguage = languageParam || 'fr';

    // Called when pressing buttons to change language (the flags next to the searchbar)
    function changeLanguage(language) {
        currentLanguage = language;
        const url = new URL(window.location.href);
        url.searchParams.set('lang', language); // Mettre à jour le paramètre de langue
        window.location.href = url.href;
    }

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const language = button.dataset.language;
            changeLanguage(language);
        });
    });


    // This value is used to retrieve the good translation from the CSVs containing translations of moves / description of abilities...
    /* Exemple: 100004.csv
    -------------------------------------------------------------------
        en,fr,it,de,es,ko,kana
        —,-,-,-,—,-,―
        Sturdy,Fermeté,Vigore,Robustheit,Robustez,옹골참,がんじょう
    -------------------------------------------------------------------
    if we are in english, we retrieve the first, so index 0 according to the "en,fr,it,de,es,ko,kana".
    */
    function getLangIndex(language) {
        const languages = ['en', 'fr', 'it', 'de', 'es', 'ko', 'kana'];
        return languages.indexOf(language);
    }
    

    // Generic translator used in all the script.
    // For a word like "Height", we will do ${await getTranslation("Height & Weight")}.
    // This function will return the translation of that word in the right language, using jsons in directory "translations". 
    // One json per language. And yes, it's by default in english and there's a en.json file
    async function getTranslation(word) {
        try {
            const response = await fetch(`translations/${currentLanguage}.json`);
            const translations = await response.json();
            return translations[word] || word; // Retourne la traduction si elle existe, sinon le mot original
        } catch (error) {
            console.error(`Error fetching translations for ${currentLanguage}:`, error);
            return word; // En cas d'erreur, retourne le mot original
        }
    }

    // Gets the list of the pokemons names from the national.json renamed as pokedex.json here.
    fetch('pokedex.json')
        .then(response => response.json())
        .then(data => {
            pokemonList = data.creatures.map(creature => creature.dbSymbol);
        })
        .catch(error => {
            console.error('Error fetching Pokémon list:', error);
        });

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        suggestions.innerHTML = '';
        if (query) {
            const filteredPokemons = pokemonList.filter(pokemon => pokemon.toLowerCase().includes(query));
            filteredPokemons.forEach(pokemon => {
                const capitalizedPokemon = capitalizeFirstLetter(pokemon); // Capitalize the first letter
                const li = document.createElement('li');
                li.textContent = capitalizedPokemon;
                li.addEventListener('click', () => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('pokemon', pokemon);
                    url.searchParams.set('lang', currentLanguage); // Ensure language parameter is preserved
                    window.location.href = url.href;
                });
                suggestions.appendChild(li);
            });
        }
    });
        

    // Function to fetch and display Pokémon data based on the URL parameter "pokemon"
    function fetchAndDisplayPokemon() {
        const urlParams = new URLSearchParams(window.location.search);
        const pokemonName = urlParams.get('pokemon');
        if (pokemonName) {
            fetchPokemonData(pokemonName);
        }
    }

    fetchAndDisplayPokemon();

    function fetchPokemonData(pokemonName) {
        fetch(`./pokemon/${pokemonName}.json`)
            .then(response => response.json())
            .then(data => {
                displayPokemonData(data, pokemonName);
            })
            .catch(error => {
                pokemonData.innerHTML = `<div class="grid-item"><h2>Pokémon not found</h2></div>`;
            });
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // the json of an ability looks like that:
    // {"klass":"Ability","dbSymbol":"adaptability","id":67,"textId":91}
    // that text id corresponds to a line in a csv file that contains the description of the ability. 
    // it works the same for the translation of the ability name, the moves. Only thing that changes is where to get the textId (variable is sometimes "id", often "textId")
    function getAbilityTextId(ability) {
        return fetch(`./abilities/${ability}.json`)
            .then(response => response.json())
            .then(data => data.textId)
            .catch(error => {
                console.error(`Error fetching ability data for ${ability}:`, error);
                return null;
            });
    }

    // read the comment for getAbilityTextId to have explanation on translators and getTextId functions
    function getMoveTextId(moveName) {
        return fetch(`./moves/${moveName}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching move id for ${moveName}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                return data.id;
            })
            .catch(error => {
                console.error(`Error fetching move id for ${moveName}:`, error);
                return null;
            });
    }
    
    // read the comment for getAbilityTextId to have explanation on translators and getTextId functions
    async function getMoveNameTranslated(moveName) {
        try {
            const textId = await getMoveTextId(moveName);
            if (textId === null) {
                return null;
            }
                        
            const csvResponse = await fetch(`./csv/100006.csv`);
            if (!csvResponse.ok) {
                throw new Error(`Error fetching CSV file: ${csvResponse.statusText}`);
            }
            const csvText = await csvResponse.text();
            
            const lines = csvText.split('\n');
            const line = lines[textId + 1];
            if (!line) {
                console.error(`Line not found for textId: ${textId}`);
                return null;
            }
            
            const columns = line.split(',');
            return columns[getLangIndex(currentLanguage)];
        } catch (error) {
            console.error(`Error fetching name translation for ${moveName}:`, error);
            return null;
        }
    }
    
    // read the comment for getAbilityTextId to have explanation on translators and getTextId functions
    async function getAbilityNameTranslated(textId) {
        try {
            const csvResponse = await fetch(`./csv/100004.csv`);
            const csvText = await csvResponse.text();
            const lines = csvText.split('\n');
            const line = lines[textId + 1];
            if (!line) {
                return { name: ability, description: "Name not found" };
            }

            const columns = line.split(',');
            return columns[getLangIndex(currentLanguage)];
        } catch (error) {
            console.error(`Error fetching name translation for ${ability}:`, error);
            return null;
        }
    }

    // read the comment for getAbilityTextId to have explanation on translators and getTextId functions
    function getAbilityDescription(id) {
        return fetch(`./csv/100005.csv`)
            .then(response => response.text())
            .then(csvText => {
                const lines = csvText.split('\n');
                const line = lines[id + 1];
                if (!line) {
                    return "Description not found";
                }

                const columns = [];
                let currentColumn = '';
                let inQuotes = false;

                for (let i = 0; i < line.length; i++) {
                    const char = line[i];

                    if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                        columns.push(currentColumn);
                        currentColumn = '';
                    } else {
                        currentColumn += char;
                    }
                }
                columns.push(currentColumn); // Ajouter la dernière colonne

                return columns[getLangIndex(currentLanguage)] || "Description not found"; // la deuxième colonne est la description française
            })
            .catch(error => {
                console.error(`Error fetching ability description for id ${id}:`, error);
                return "Description not found";
            });
    }

    // example: transforms é in e. is used because translateTypeToFrench returns stuff like "ténèbres". and i wanted to keep the accents in that function (turned out useless doing that)

    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function translateTypeToFrench(type) {
        const translations = {
            normal: 'normal',
            fire: 'feu',
            water: 'eau',
            electric: 'électrique',
            grass: 'plante',
            ice: 'glace',
            fighting: 'combat',
            poison: 'poison',
            ground: 'sol',
            flying: 'vol',
            psychic: 'psy',
            bug: 'insecte',
            rock: 'roche',
            ghost: 'spectre',
            dragon: 'dragon',
            dark: 'ténèbres',
            steel: 'acier',
            fairy: 'fée'
        };
        return translations[type.toLowerCase()] || type;
    }

    async function displayPokemonData(data, pokemonName) {
        const form = data.forms[0];
        const hpTxt = await getTranslation('HP');
        const attackTxt = await getTranslation('Attack');
        const defenseTxt = await getTranslation('Defense');
        const speedTxt = await getTranslation('Speed');
        const specialAttackTxt = await getTranslation("Special Attack");
        const specialDefenseTxt = await getTranslation("Special Defense");
        const stats = [
            { name: hpTxt, value: form.baseHp },
            { name: attackTxt, value: form.baseAtk },
            { name: defenseTxt, value: form.baseDfe },
            { name: speedTxt, value: form.baseSpd },
            { name: specialAttackTxt, value: form.baseAts },
            { name: specialDefenseTxt, value: form.baseDfs }
        ];

        const statsData = stats.map(stat => {
            const percentage = (stat.value / 255) * 100;
            const color = calculateColor(stat.value);
            const width = (stat.value / 255) * 100;
            return `
                <tr>
                    <td><span>${stat.name}:</span> ${stat.value}</td>
                    <td>
                        <div class="stat-bar-container">
                            <div class="stat-bar" style="background-color: ${color}; width: ${width}%;"></div>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        const evolutionsData = form.evolutions.length > 0 ? form.evolutions.map(evo => `
            <div class="evolution-item">
                <img src="pokefront/${evo.dbSymbol}.png" alt="${capitalizeFirstLetter(evo.dbSymbol)}">
                <p>${capitalizeFirstLetter(evo.dbSymbol)} (level ${evo.conditions[0].value})</p>
            </div>
        `).join('') : 'None';

        const type1French = removeAccents(translateTypeToFrench(form.type1));
        const type2French = form.type2 !== "__undef__" ? removeAccents(translateTypeToFrench(form.type2)) : '';
        const typesImages = `
            <br>
            <img src="imgs/${type1French}.png" alt="${type1French}" class="img-pokemon-types-layer1">
            ${type2French ? `<img src="imgs/${type2French}.png" alt="${type2French}" class="img-pokemon-types-layer1">` : ''}
        `;

        // Fetch abilities and their textIds
        const displayedAbilities = new Set();
        const abilitiesData = await Promise.all(form.abilities.map(async ability => {
        if (!displayedAbilities.has(ability)) {
            displayedAbilities.add(ability);
            const textId = await getAbilityTextId(ability);
            const abilityNameTranslated = await getAbilityNameTranslated(textId);
            const description = await getAbilityDescription(textId);
            return `<span>${abilityNameTranslated}</span>: ${description}`;
        }
    }));

        // Fetch moves and their data (pp, accuracy, etc...)
        const moveNames = form.moveSet.map(moveInfo => moveInfo.move);
        const movesData = await getMovesData(pokemonName, moveNames);


        pokemonData.innerHTML = `
        <div class="grid-container-layer1">
            <div class="grid-item grid-item-large">
                <h2>${capitalizeFirstLetter(pokemonName)}</h2>
                <img src="./pokefront/${pokemonName}.png" alt="${pokemonName}">
                ${typesImages}
            </div>
            <div class="grid-item grid-item-large">
                <h2>${await getTranslation('Stats')}</h2>
                <table>
                    ${statsData}
                </table>
            </div>
        </div>
    
        <div class="grid-container-layer2">
            <div class="grid-item">
                <h2>${await getTranslation("Height & Weight")}</h2>
                <p><span>${await getTranslation('Height')}:</span> ${form.height} m</p>
                <p><span>${await getTranslation('Weight')}:</span> ${form.weight} kg</p>
            </div>
            <div class="grid-item">
                <h2>${await getTranslation('Evolution')}</h2>
                ${evolutionsData}
            </div>
            <div class="grid-item">
                <h2>${await getTranslation('Experience')}</h2>
                <p><span>${await getTranslation("Base Experience")}:</span> ${form.baseExperience}</p>
                <p><span>${await getTranslation("Experience Type")}:</span> ${form.experienceType}</p>
            </div>
            <div class="grid-item">
                <h2>${await getTranslation("Breeding Info")}</h2>
                <p><span>${await getTranslation("Egg Groups")}:</span> ${form.breedGroups.join(', ')}</p>
                <p><span>${await getTranslation("Hatch Steps")}:</span> ${form.hatchSteps}</p>
                <p><span>${await getTranslation("Baby form")}:</span> ${capitalizeFirstLetter(form.babyDbSymbol)}</p>
            </div>
        </div>

        <div class="grid-container-layer3">
            <div class="grid-item">
                <h2>${await getTranslation('Abilities')}</h2>
                <p>${abilitiesData.join('<br><br>')}</p>
            </div>
        </div>
    
        <div class="grid-container-layer4">
            <div class="grid-item-large">
                <h2>Moves</h2>                
                ${movesData}
            </div>
        </div>
    `;
}

// used for statistics colored bars
function calculateColor(value) {
    let r, g, b;

    if (value <= 50) {
        // Dégradé de rouge (de rouge foncé à rouge clair)
        r = 255;
        g = Math.floor((value / 50) * 50);
        b = Math.floor((value / 50) * 50);
    } else if (value <= 90) {
        // Dégradé de jaune (de jaune foncé à jaune clair)
        r = 255;
        g = 255;
        b = Math.floor(((value - 50) / 50) * 50);
    } else if (value <= 190) {
        // Dégradé de vert (de vert foncé à vert clair)
        r = Math.floor(((value - 100) / 100) * 50);
        g = 255;
        b = Math.floor(((value - 100) / 100) * 50);
    } else {
        // Dégradé de bleu (de bleu foncé à bleu clair)
        r = Math.floor(((value - 200) / 55) * 50);
        g = Math.floor(((value - 200) / 55) * 50);
        b = 255;
    }

    return `rgb(${r}, ${g}, ${b})`;
}





// used for moves tables
async function getCategoryImage(category) {
    let imageName = '';
    if (category === 'physical') {
        imageName = 'physique.png';
    } else if (category === 'status') {
        imageName = 'statut.png';
    } else if (category === 'special') {
        imageName = 'special.png';
    } else {
        imageName = 'placeholder.png';
    }

    return `imgs/${imageName}`;
}

async function getMovesData(pokemonName, moveNames) {
    let levelMovesHtml = '';
    let tutorMovesHtml = '';
    let techMovesHtml = '';
    let breedMovesHtml = '';

    // Sets to track added moves for each category. It is required because a move can be learned from level and by tech at the same time.
    // This causes duplicate items. to avoid that, we keep track and check if move has already been displayed.
    const levelMovesSet = new Set();
    const tutorMovesSet = new Set();
    const techMovesSet = new Set();
    const breedMovesSet = new Set();

    for (const moveName of moveNames) {
        try {
            const response = await fetch(`./pokemon/${pokemonName}.json`);
            const pokemonData = await response.json();
            const moveInfo = pokemonData.forms[0].moveSet.find(move => move.move === moveName);

            if (!moveInfo) {
                throw new Error(`Move data not found for ${moveName}`);
            }

            const responseMove = await fetch(`./moves/${moveName}.json`);
            const moveData = await responseMove.json();
            const categoryImage = await getCategoryImage(moveData.category);
            const typeFrench = removeAccents(translateTypeToFrench(moveData.type));
            const typeImage = `imgs/${typeFrench}.png`;
            const moveNameTranslated = await getMoveNameTranslated(moveName);

            // Construct table line for each move.
            const moveHtml = `
                <tr>
                <td>${moveInfo.level || ''}</td>
                    <td><strong>${moveNameTranslated}</strong></td>
                    <td><img src="${typeImage}" alt="${typeFrench}"></td>
                    <td><img src="${categoryImage}" alt="${moveData.category}"></td>
                    <td>${moveData.pp}</td>
                    <td>${moveData.power}</td>
                    <td>${moveData.accuracy}</td>
                </tr>`;

            // Add HTML to corresponding move type depending on klass. read a random pokemon file to understand, there's the name of the move and the klass (learning method).
            switch (moveInfo.klass) {
                case 'LevelLearnableMove':
                    if (!levelMovesSet.has(moveName)) {
                        levelMovesHtml += moveHtml;
                        levelMovesSet.add(moveName);
                    }
                    break;
                case 'TutorLearnableMove':
                    if (!tutorMovesSet.has(moveName)) {
                        tutorMovesHtml += moveHtml;
                        tutorMovesSet.add(moveName);
                    }
                    break;
                case 'TechLearnableMove':
                    if (!techMovesSet.has(moveName)) {
                        techMovesHtml += moveHtml;
                        techMovesSet.add(moveName);
                    }
                    break;
                case 'BreedLearnableMove':
                    if (!breedMovesSet.has(moveName)) {
                        breedMovesHtml += moveHtml;
                        breedMovesSet.add(moveName);
                    }
                    break;
                default:
                    console.warn(`Unknown move type for ${moveName}: ${moveInfo.klass}`);
                    break;
            }
        } catch (error) {
            console.error(`Error fetching move data for ${moveName}:`, error);
        }
    }

    // Combine it
    const movesHtml = `
        <h2>${await getTranslation("Level Learnable Moves")}</h2>
        <table>
        <tr>
        <th>${await getTranslation('Level')}</th>
        <th>${await getTranslation('Name')}</th>
        <th>${await getTranslation('Type')}</th>
        <th>${await getTranslation('Category')}</th>
        <th>${await getTranslation('PP')}</th>
        <th>${await getTranslation('Power')}</th>
        <th>${await getTranslation('Accuracy')}</th>
        </tr>
        ${levelMovesHtml}
        </table>
        
        <h2>${await getTranslation("Tutor Learnable Moves")}</h2>
        <table>
        <tr>
        <th>${await getTranslation('Level')}</th>
        <th>${await getTranslation('Name')}</th>
        <th>${await getTranslation('Type')}</th>
        <th>${await getTranslation('Category')}</th>
        <th>${await getTranslation('PP')}</th>
        <th>${await getTranslation('Power')}</th>
        <th>${await getTranslation('Accuracy')}</th>
        </tr>
        ${tutorMovesHtml}
        </table>
        
        <h2>${await getTranslation("Tech Learnable Moves")}</h2>
        <table>
        <tr>
        <th>${await getTranslation('Level')}</th>
        <th>${await getTranslation('Name')}</th>
        <th>${await getTranslation('Type')}</th>
        <th>${await getTranslation('Category')}</th>
        <th>${await getTranslation('PP')}</th>
        <th>${await getTranslation('Power')}</th>
        <th>${await getTranslation('Accuracy')}</th>      
        </tr>
        ${techMovesHtml}
        </table>
        
        <h2>${await getTranslation("Breed Learnable Moves")}</h2>
        <table>
            <tr>
                <th>${await getTranslation('Level')}</th>
                <th>${await getTranslation('Name')}</th>
                <th>${await getTranslation('Type')}</th>
                <th>${await getTranslation('Category')}</th>
                <th>${await getTranslation('PP')}</th>
                <th>${await getTranslation('Power')}</th>
                <th>${await getTranslation('Accuracy')}</th>
            </tr>
            ${breedMovesHtml}
        </table>`;

    return movesHtml;
}

});
