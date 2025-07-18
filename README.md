## Create a Web Pokédex from Your PSDK Pokémon Game's Data in 5 Minutes!
---
This tool lets you create a **complete and web-browsable Pokédex** directly from your Pokémon game's data, **provided your game is developed with [PSDK](https://gitlab.com/pokemonsdk/pokemonsdk)**  on RPG Maker XP.

Normally, to view the entire Pokédex in a PSDK RMXP project, you'd either have to:

* **Open the project in Pokémon Studio**, which is only accessible to developers.
* **Complete the entire Pokédex in-game**, then ensure you're not in an event or battle to be able to access it. And then, the browsing for a specific pokémon is long and complicated.

However, many fan games include **Fakemons** (non-official Pokémon whose abilities, types, etc., players might not know). With this tool, you'll give your players direct access to all this information. No more frustration from not understanding what you're fighting against! Your game will be more accessible and enjoyable for everyone.

## Check out the Pokédex from [Pokémon Impotia](https://pokemon-impotia.github.io) that uses this repository!
![preview 1](./pokedex_preview_1.png)
![preview 2](./pokedex_preview_2.png)

## Requirements
- All IMGs must be .PNGs (it's supposed to, in a psdk project)
- All your sprites in the pokefront folder must be in full lowercase, containing only the name of the pokemon. For example, "Bidoof.png" must be "bidoof.png".
- These names must be the exact same as the ones in the national.json file.

## How to setup:
1. Fork my project into a repository named like that : `{the_username_of_your_github_account}.github.io`. It will generated a personal [GitHub Page](https://pages.github.com/).

2. Edit the paths in setup.py at the top of the file, and then run the setup.py. 

3. When prompted, input your RMXP PSDK project path.

4. Optional : test if the website works properly using XAMPP Control Panel and the Apache Module. Does not require MySQL, it's all .js and .csv

5. Push your changes to GitHub. After the GitHub pipeline ends, your website should be up and running!

## How does it work ?
The tool streamlines the process by retrieving key files and folders from your RMXP Project, including national.json, individual pokemon JSONs, abilities JSONs, moves JSONs, CSV translation files, and pokefront sprites. 
It then intelligently processes this data: for each Pokémon listed in your national.json Pokédex, it generates a consolidated JSON file. This consolidation is crucial because, within PSDK, a Pokémon's data is spread across many external files. Our tool compacts all relevant information—such as abilities (with their translated names and descriptions) and moves (with their translated names and battle details)—into a single, easily accessible pokemon_consolidated JSON file. This drastically reduces the number of queries needed, making your web Pokédex much faster and more efficient.

#### Please, credit me for the Pokédex. I put a credit in the footer, you can move it but don't forget to credit me :)
