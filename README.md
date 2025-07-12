# Pokemon Studio Pokedex Database To Website Pokedex
This is a tool to build a web-based pokédex of your pokémon fangame (that's based on psdk), in just 5 minutes!
You just need to copy and paste some files/folders, rename some of them, and you'll get a web version of Pokémon Studio, ready to be used by your players.

⚠️There is a bit of delay, because it's on a free GitHub website and doesn't have munch processing power ⚠️

## Check out the Pokédex from [Pokémon Impotia](https://pokemon-impotia.github.io) that uses this repository!
![preview 1](./pokedex_preview_1.png)
![preview 2](./pokedex_preview_2.png)

## Requirements
- All IMGs must be .PNGs (it's supposed to, in a psdk project)
- All your sprites in the pokefront folder must be in full lowercase, containing only the name of the pokemon. For example, "Bidoof.png" must be "bidoof.png".
- These names must be the exact same as the ones in the national.json file.

## How to setup:
1. Fork my project into a repository named like that : `{the_username_of_your_github_account}.github.io`. It will generated a personal [GitHub Page](https://pages.github.com/).

2. Run the setup_pokedex.py. 

3. When prompted, input your RMXP PSDK project path.

4. Optional : test if the website works properly using XAMPP Control Panel and the Apache Module. Does not require MySQL, it's all .js and .csv

5. Push your changes to GitHub. After the GitHub pipeline ends, your website should be up and running!

#### Please, credit me for the Pokédex. I put a credit in the footer, you can move it but don't forget to credit me :)
