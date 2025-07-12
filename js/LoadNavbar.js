document.addEventListener('DOMContentLoaded', () => {
    fetch('Navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('navbar-placeholder').innerHTML = html;
            if (window.languageManager) {
                window.languageManager.setupLanguageButtons();
                window.languageManager.retranslatePage();
            }
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
            document.getElementById('navbar-placeholder').innerHTML = '<p>Error loading navbar</p>';
        });
});