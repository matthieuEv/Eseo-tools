chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.moyECTSSwitch !== undefined) {
        document.getElementById('moyECTSButton').style.display = request.moyECTSSwitch ? "flex" : "none";
    }
});

// Ajouter ce code pour vérifier l'état lors de l'initialisation
chrome.storage.local.get('moyECTSSwitch', (data) => {
    if (data.moyECTSSwitch) {
        document.getElementById('moyECTSButton').style.display = "flex";
    } else {
        document.getElementById('moyECTSButton').style.display = "none";
    }
});

let divmoyECTS = document.getElementById("moy");

let buttonECTS = document.createElement('a');
buttonECTS.textContent = 'Calculer ma moyenne ECTS';
buttonECTS.style = 'margin: 0;padding: 4px 10px;background-color: #0066a7;color: #fff;text-decoration: none;font-weight: 700;font-size: 13px;cursor: pointer; position: absolute; right: 0;';
buttonECTS.id = 'moyECTSButton';

// Add hover effect
button.onmouseover = function() {
    this.style.textDecoration = 'underline';
}
button.onmouseout = function() {
    this.style.textDecoration = 'none';
}

buttonECTS.onclick = async function() {
    let ue_section = document.getElementsByClassName('ue_section');
    //HTMLCollection { 0: div.ue_section, 1: div.ue_section, 2: div.ue_section, 3: div.ue_section, 4: div.ue_section, 5: div.ue_section, length: 6 }
    
    for (let i = 0; i < ue_section.length; i++) {
        ue_section[i].style.position = 'relative';

        let div = document.createElement('h3');
        let computedMoyECTS = await computeMoyECTS(ue_section[i]);
        div.textContent = 'Moyenne: ' + computedMoyECTS + '/20';
        div.style = 'position: absolute;top: 0;right: 0;font-size: 1.2em;width: fit-content; font-weight: 700;';

        ue_section[i].appendChild(div);
    }
}

divmoyECTS.appendChild(buttonECTS);

async function computeMoyECTS(element){
    let sum = 0;
    let sumCoef = 0;

    let note_block = element.getElementsByClassName('ue_notes')[0].getElementsByClassName('note_block');

    for (let i = 0; i < note_block.length; i++) {
        let txt = note_block[i].querySelectorAll(".txt-note");

        txt.forEach((element) => {
            var gradeEl = element.textContent.trim();
            let grade = -1; // Set to -1 if there is no grade
            if (gradeEl.length > 0) {
                let match = gradeEl.match(/^[+-]?\d+([.,]\d+)?/); // If there is a grade retrieve it
                if (match) {
                    grade = parseFloat(match[0].replace(',','.'));
                }
            } else { //Prevent locking
                return;
            }

            //Extract coefficient 
            var coefMatch = element.textContent.match(/\(Coef (\d+(\.\d+)?)\)/);
            let coef = 0;
            if (coefMatch && coefMatch[1]) {
                coef = parseFloat(coefMatch[1]);
            }
            
            // Add to sum
            if (grade != -1){
                sum += (grade * coef);
                sumCoef += coef;
            }else{
                return;
            }

        });
    }
    
    //Compute the whole moy
    let moy = sum / sumCoef;

    if (isNaN(moy)) {
        return "-";
    } else {
        return parseFloat(moy.toFixed(2));
    }
}
