/*
Rendu HTML des données Pokémon
*/

export class PokemonRenderer {
    constructor(languageManager) {
        this.languageManager = languageManager;
    }

    async renderPokemon(processedData, pokemonName) {
        const { form, stats, abilities, moves, evolutions, types } = processedData;
        
        const sections = await Promise.all([
            this.renderMainInfo(pokemonName, types),
            this.renderStats(stats),
            this.renderDetails(form),
            this.renderEvolution(evolutions),
            this.renderExperience(form),
            this.renderBreeding(form),
            this.renderAbilities(abilities),
            this.renderMoves(moves)
        ]);

        return sections.join('');
    }

    async renderMainInfo(pokemonName, types) {
        const typesImages = this.renderTypeImages(types);
        
        return `
        <div class="grid-container-layer1">
            <div class="grid-item grid-item-large">
                <h2>${this.capitalizeFirstLetter(pokemonName)}</h2>
                <img src="data/pokefront/${pokemonName}.png" alt="${pokemonName}">
                ${typesImages}
            </div>
        `;
    }

    async renderStats(stats) {
        const statsData = stats.map(stat => {
            const color = this.calculateColor(stat.value);
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

        return `
            <div class="grid-item grid-item-large">
                <h2>${await this.languageManager.getTranslation('Stats')}</h2>
                <table>
                    ${statsData}
                </table>
            </div>
        </div>`;
    }

    async renderDetails(form) {
        return `
        <div class="grid-container-layer2">
            <div class="grid-item">
                <h2>${await this.languageManager.getTranslation("Height & Weight")}</h2>
                <p><span>${await this.languageManager.getTranslation('Height')}:</span> ${form.height} m</p>
                <p><span>${await this.languageManager.getTranslation('Weight')}:</span> ${form.weight} kg</p>
            </div>
        `;
    }

    async renderEvolution(evolutions) {
        const evolutionsData = evolutions.length > 0 ? evolutions.map(evo => `
            <a href="PokemonSearch.html?pokemon=${evo.dbSymbol}&lang=${this.languageManager.getCurrentLanguage()}" 
               class="evolution-item" style="text-decoration: none; color: inherit; display: block; pointer-events: auto !important; position: relative; z-index: 999;">
                <img src="data/pokefront/${evo.dbSymbol}.png" alt="${this.capitalizeFirstLetter(evo.dbSymbol)}">
                <p>${this.capitalizeFirstLetter(evo.dbSymbol)} (level ${evo.level})</p>
            </a>
        `).join('') : 'None';

        return `
            <div class="grid-item">
                <h2>${await this.languageManager.getTranslation('Evolution')}</h2>
                ${evolutionsData}
            </div>
        `;
    }

    async renderExperience(form) {
        return `
            <div class="grid-item">
                <h2>${await this.languageManager.getTranslation('Experience')}</h2>
                <p><span>${await this.languageManager.getTranslation("Base Experience")}:</span> ${form.baseExperience}</p>
                <p><span>${await this.languageManager.getTranslation("Experience Type")}:</span> ${form.experienceType}</p>
            </div>
        `;
    }

    async renderBreeding(form) {
        return `
            <div class="grid-item">
                <h2>${await this.languageManager.getTranslation("Breeding Info")}</h2>
                <p><span>${await this.languageManager.getTranslation("Egg Groups")}:</span> ${form.breedGroups.join(', ')}</p>
                <p><span>${await this.languageManager.getTranslation("Hatch Steps")}:</span> ${form.hatchSteps}</p>
                <p><span>${await this.languageManager.getTranslation("Baby form")}:</span> ${this.capitalizeFirstLetter(form.babyDbSymbol)}</p>
            </div>
        </div>`;
    }

    async renderAbilities(abilities) {
        const abilitiesData = abilities.map(ability => 
            `<span>${ability.name}</span>: ${ability.description}`
        ).join('<br><br>');

        return `
        <div class="grid-container-layer3">
            <div class="grid-item">
                <h2>${await this.languageManager.getTranslation('Abilities')}</h2>
                <p>${abilitiesData}</p>
            </div>
        </div>`;
    }

    async renderMoves(moves) {
        const sections = await Promise.all([
            this.renderMoveSection('Level Learnable Moves', moves.level),
            this.renderMoveSection('Tutor Learnable Moves', moves.tutor),
            this.renderMoveSection('Tech Learnable Moves', moves.tech),
            this.renderMoveSection('Breed Learnable Moves', moves.breed)
        ]);

        return `
        <div class="grid-container-layer4">
            <div class="grid-item-large">
                <h2>Moves</h2>
                ${sections.join('')}
            </div>
        </div>`;
    }

    async renderMoveSection(titleKey, movesData) {
        const movesHtml = movesData.map(move => `
            <tr>
                <td>${move.level}</td>
                <td><strong>${move.name}</strong></td>
                <td><img src="${move.typeImage}" alt="${move.type}"></td>
                <td><img src="${move.categoryImage}" alt="${move.category}"></td>
                <td>${move.pp}</td>
                <td>${move.power}</td>
                <td>${move.accuracy}</td>
            </tr>
        `).join('');

        return `
            <h2>${await this.languageManager.getTranslation(titleKey)}</h2>
            <table>
                <tr>
                    <th>${await this.languageManager.getTranslation('Level')}</th>
                    <th>${await this.languageManager.getTranslation('Name')}</th>
                    <th>${await this.languageManager.getTranslation('Type')}</th>
                    <th>${await this.languageManager.getTranslation('Category')}</th>
                    <th>${await this.languageManager.getTranslation('PP')}</th>
                    <th>${await this.languageManager.getTranslation('Power')}</th>
                    <th>${await this.languageManager.getTranslation('Accuracy')}</th>
                </tr>
                ${movesHtml}
            </table>
        `;
    }

    renderTypeImages(types) {
        const { type1French, type2French } = types;
        return `
            <br>
            <img src="resources/icons/types/${type1French}.png" alt="${type1French}" class="img-pokemon-types-layer1">
            ${type2French ? `<img src="resources/icons/types/${type2French}.png" alt="${type2French}" class="img-pokemon-types-layer1">` : ''}
        `;
    }

    calculateColor(value) {
        let r, g, b;

        if (value <= 50) {
            r = 255;
            g = Math.floor((value / 50) * 50);
            b = Math.floor((value / 50) * 50);
        } else if (value <= 90) {
            r = 255;
            g = 255;
            b = Math.floor(((value - 50) / 50) * 50);
        } else if (value <= 190) {
            r = Math.floor(((value - 100) / 100) * 50);
            g = 255;
            b = Math.floor(((value - 100) / 100) * 50);
        } else {
            r = Math.floor(((value - 200) / 55) * 50);
            g = Math.floor(((value - 200) / 55) * 50);
            b = 255;
        }

        return `rgb(${r}, ${g}, ${b})`;
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}