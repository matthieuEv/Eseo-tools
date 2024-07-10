document.addEventListener('DOMContentLoaded', () => {
    const switches = [
        'gpaSwitch'
    ];

    // Charger l'état initial de chaque switch
    chrome.storage.local.get(switches, (data) => {
        switches.forEach(switchId => {
            const switchElement = document.getElementById(switchId);
            switchElement.checked = data[switchId] || false;

            // Ajouter un écouteur d'événements pour chaque switch
            switchElement.addEventListener('change', () => {
                // Mettre à jour le stockage local
                chrome.storage.local.set({[switchId]: switchElement.checked});

                // Envoyer un message au script de contenu
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {[switchId]: switchElement.checked});
                });
            });
        });
    });
});