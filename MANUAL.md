# Pokédex Web Setup Guide

This guide details the setup process for the web Pokédex, focusing on how the necessary game assets are prepared and integrated.

## Data Sourcing and Preparation

The `setup.py` script is designed to automate the extraction and processing of data from your RPG Maker XP PSDK project. It will copy specific files and folders, then perform transformations to optimize them for web display.

### Copied Assets:

The following files and directories will be sourced from your PSDK project:

* **Studio Folder:**
    * **Location:** `{the_username_of_your_github_account}.github.io/Studio`
    * **Purpose:** This directory contains the base structure and potentially some shared assets for the web Pokédex.

* **National Pokédex Data:**
    * **File:** `national.json`
    * **Location:** `FANGAME_ROOT_FOLDER\Data\Studio\dex`
    * **Note:** This web Pokédex is designed to handle only a single Pokédex source. Therefore, it specifically uses `national.json` and does not support `regional.json` files.

* **Translation CSV Files:**
    * **Files:** `100004.csv`, `100005.csv`, `100006.csv`
    * **Location:** `FANGAME_ROOT_FOLDER\Data\Text\Dialogs`
    * **Purpose:** These CSV files contain the localized names and descriptions for abilities and moves.

* **Pokémon Front Sprites:**
    * **Location:** `FANGAME_ROOT_FOLDER\graphics\pokedex`
    * **Purpose:** These are the visual assets (images) for each Pokémon.

### Data Processing Steps:

After copying, the `setup.py` script performs the following crucial processing steps to optimize performance for the web:

1.  **Sprite Upscaling:**
    * All copied Pokémon front sprites will be upscaled by a factor of 4 times their original size. This ensures better visual quality on modern high-resolution displays.

2.  **Pokémon Data Consolidation:**
    * For each Pokémon (referred to as "fakemon" in your `national.json` file), the script will locate its individual JSON data file (e.g., `pokemon/pikachu.json`).
    * It will then **generate a new, consolidated JSON file for each Pokémon**. This new file will contain *all necessary data* related to that Pokémon, including its base stats, evolution chain, and crucially, the complete details (names, descriptions, types, power, PP, accuracy, etc.) for **all its moves and abilities**.
        * **Context:** The original PSDK data structure uses separate JSON files for each individual move and ability, alongside multiple CSV files for attack names and their translations.
    * This consolidation strategy is designed to drastically reduce the number of HTTP requests needed to display a Pokémon's full data on GitHub Pages, optimizing loading times for the end-user.