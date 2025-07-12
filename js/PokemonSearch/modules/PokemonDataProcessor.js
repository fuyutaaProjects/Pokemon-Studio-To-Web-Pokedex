/*
Traitement et transformation des données Pokémon
*/

export class PokemonDataProcessor {
    constructor(languageManager) {
        this.languageManager = languageManager;
    }

    async processData(data) {
        const form = data.forms[0];
        
        return {
            form,
            stats: await this.processStats(form),
            abilities: this.processAbilities(form),
            moves: await this.processMoves(form),
            evolutions: this.processEvolutions(form),
            types: this.processTypes(form)
        };
    }

    async processStats(form) {
        const statLabels = await Promise.all([
            this.languageManager.getTranslation('HP'),
            this.languageManager.getTranslation('Attack'),
            this.languageManager.getTranslation('Defense'),
            this.languageManager.getTranslation('Speed'),
            this.languageManager.getTranslation('Special Attack'),
            this.languageManager.getTranslation('Special Defense')
        ]);

        return [
            { name: statLabels[0], value: form.baseHp },
            { name: statLabels[1], value: form.baseAtk },
            { name: statLabels[2], value: form.baseDfe },
            { name: statLabels[3], value: form.baseSpd },
            { name: statLabels[4], value: form.baseAts },
            { name: statLabels[5], value: form.baseDfs }
        ];
    }

    processAbilities(form) {
        const displayedAbilities = new Set();
        return form.abilities.map(abilitySymbol => {
            if (!displayedAbilities.has(abilitySymbol)) {
                displayedAbilities.add(abilitySymbol);
                return this.getAbilityData(abilitySymbol, form.abilities_data);
            }
            return null;
        }).filter(Boolean);
    }

    getAbilityData(abilitySymbol, abilitiesData) {
        const ability = abilitiesData.find(a => a.symbol === abilitySymbol);
        if (!ability) return { name: abilitySymbol, description: "Data not found" };
        
        const langIndex = this.languageManager.getLangIndex();
        const languages = ['en', 'fr', 'it', 'de', 'es', 'ko'];
        const lang = languages[langIndex] || 'en';
        
        return {
            name: ability.names[lang] || ability.names.en || abilitySymbol,
            description: ability.descriptions[lang] || ability.descriptions.en || "Description not found"
        };
    }

    async processMoves(form) {
        const movesByType = {
            level: new Set(),
            tutor: new Set(),
            tech: new Set(),
            breed: new Set()
        };

        const processedMoves = {
            level: [],
            tutor: [],
            tech: [],
            breed: []
        };

        for (const moveInfo of form.moveSet) {
            const moveData = this.getMoveData(moveInfo.move, form.moves_data);
            if (!moveData) continue;

            const categoryImage = await this.getCategoryImage(moveData.category);
            const typeFrench = this.removeAccents(this.translateTypeToFrench(moveData.type));
            const typeImage = `resources/icons/types/${typeFrench}.png`;

            const processedMove = {
                level: moveInfo.level || '',
                name: moveData.name,
                typeImage,
                categoryImage,
                pp: moveData.pp,
                power: moveData.power,
                accuracy: moveData.accuracy,
                type: typeFrench,
                category: moveData.category
            };

            const moveType = this.getMoveType(moveInfo.klass);
            if (moveType && !movesByType[moveType].has(moveInfo.move)) {
                movesByType[moveType].add(moveInfo.move);
                processedMoves[moveType].push(processedMove);
            }
        }

        return processedMoves;
    }

    getMoveType(klass) {
        const typeMap = {
            'LevelLearnableMove': 'level',
            'TutorLearnableMove': 'tutor',
            'TechLearnableMove': 'tech',
            'BreedLearnableMove': 'breed'
        };
        return typeMap[klass];
    }

    getMoveData(moveSymbol, movesData) {
        const move = movesData.find(m => m.symbol === moveSymbol);
        if (!move) return null;
        
        const langIndex = this.languageManager.getLangIndex();
        const languages = ['en', 'fr', 'it', 'de', 'es', 'ko'];
        const lang = languages[langIndex] || 'en';
        
        return {
            name: move.names[lang] || move.names.en || moveSymbol,
            category: move.category,
            type: move.type,
            pp: move.pp,
            power: move.power,
            accuracy: move.accuracy
        };
    }

    async getCategoryImage(category) {
        const imageMap = {
            'physical': 'physique.png',
            'status': 'statut.png',
            'special': 'special.png'
        };
        return `resources/icons/types/${imageMap[category] || 'placeholder.png'}`;
    }

    processEvolutions(form) {
        return form.evolutions.map(evo => ({
            dbSymbol: evo.dbSymbol,
            level: evo.conditions[0]?.value || 'Unknown'
        }));
    }

    processTypes(form) {
        const type1French = this.removeAccents(this.translateTypeToFrench(form.type1));
        const type2French = form.type2 !== "__undef__" ? 
            this.removeAccents(this.translateTypeToFrench(form.type2)) : null;
        
        return { type1French, type2French };
    }

    translateTypeToFrench(type) {
        const translations = {
            normal: 'normal', fire: 'feu', water: 'eau', electric: 'électrique',
            grass: 'plante', ice: 'glace', fighting: 'combat', poison: 'poison',
            ground: 'sol', flying: 'vol', psychic: 'psy', bug: 'insecte',
            rock: 'roche', ghost: 'spectre', dragon: 'dragon', dark: 'ténèbres',
            steel: 'acier', fairy: 'fée'
        };
        return translations[type.toLowerCase()] || type;
    }

    removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}