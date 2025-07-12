/*
Language translations handler, depending on the lang parameter in the url.
contains many utilities used in multiple files.
*/

class LanguageManager {
    constructor() {
        this.currentLanguage = this.initializeLanguage();
        this.translations = {};
        this.loadTranslations();
        this.setupLanguageButtons();
    }

    // initialize the "lang" parameter in the URL
    initializeLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        let lang = urlParams.get('lang');

        if (!lang) {
            lang = 'fr'; // defaults to french if no language in the URL
            this.updateUrlLanguage(lang);
        }
        return lang;
    }

    // Changes the lang parameter without reloading the page.
    updateUrlLanguage(lang) {
        const url = new URL(window.location.href);
        const urlParams = new URLSearchParams(url.search);
        urlParams.set('lang', lang);
        url.search = urlParams.toString();
        window.history.replaceState({}, '', url.toString());
    }

    setupLanguageButtons() {
        const setupButtons = () => {
            document.querySelectorAll('button[data-language]').forEach(button => {
                button.addEventListener('click', () => {
                    const language = button.dataset.language;
                    this.changeLanguage(language);
                });
            });

            const currentLang = this.getCurrentLanguage();
            const activeButton = document.querySelector(`button[data-language="${currentLang}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupButtons);
        } else {
            setupButtons();
        }
    }

    // Used by the language buttons. Changes the lang parameter and reloads the page
    changeLanguage(language) {
        this.currentLanguage = language;
        const url = new URL(window.location.href);
        url.searchParams.set('lang', language);
        window.location.href = url.href;
    }

    async loadTranslations() {
        try {
            const response = await fetch('translations/translations.json');
            const data = await response.json();
            this.translations = data.translations[this.currentLanguage] || {};
            this.translatePage();
        } catch (error) {
            console.error(`Could not load translations from file:`, error);
            console.error(`Please ensure translations/translations.json contains all the required translations.`);
        }
    }

    translatePage() {
        const doTranslation = () => {
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                const translation = this.translations[key];
                if (translation) {
                    element.textContent = translation;
                }
            });

            const titleElement = document.querySelector('title');
            if (titleElement && titleElement.hasAttribute('data-translate')) {
                const key = titleElement.getAttribute('data-translate');
                const translation = this.translations[key];
                if (translation) {
                    titleElement.textContent = translation;
                }
            }

            document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
                const key = element.getAttribute('data-translate-placeholder');
                const translation = this.translations[key];
                if (translation) {
                    element.placeholder = translation;
                }
            });

            document.querySelectorAll('[data-translate-alt]').forEach(element => {
                const key = element.getAttribute('data-translate-alt');
                const translation = this.translations[key];
                if (translation) {
                    element.alt = translation;
                }
            });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', doTranslation);
        } else {
            doTranslation();
        }
    }

    async getTranslation(word) {
        return this.translations[word] || word;
    }

    getLangIndex() {
        const languages = ['en', 'fr', 'it', 'de', 'es', 'ko', 'kana'];
        return languages.indexOf(this.currentLanguage);
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    addTranslations(newTranslations) {
        Object.assign(this.translations, newTranslations);
    }

    retranslatePage() {
        this.translatePage();
    }
}

let languageManager;

function initializeLanguageManager() {
    languageManager = new LanguageManager();

    window.languageManager = languageManager;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguageManager);
} else {
    initializeLanguageManager();
}