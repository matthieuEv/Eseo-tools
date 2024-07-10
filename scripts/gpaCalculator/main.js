chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.gpaSwitch !== undefined) {
        document.getElementById('moy').style.display = request.gpaSwitch ? "flex" : "none";
    }
});

// Ajouter ce code pour vérifier l'état lors de l'initialisation
chrome.storage.local.get('gpaSwitch', (data) => {
    if (data.gpaSwitch) {
        document.getElementById('moy').style.display = "flex";
    } else {
        document.getElementById('moy').style.display = "none";
    }
});

let header = document.getElementsByClassName('e_breadcrumb')[0];

let div = document.createElement('div');
div.id = 'moy';
div.style = 'display:flex;align-items:center;margin-top:20px;';

// Create the button element
let button = document.createElement('a');
button.textContent = 'Calculer ma moyenne';

// Optional: Add styling or other attributes to the button
button.style = 'margin: 0;padding: 4px 10px;background-color: #0066a7;color: #fff;text-decoration: none;font-weight: 700;font-size: 13px;cursor: pointer;';

// Add hover effect
button.onmouseover = function() {
    this.style.textDecoration = 'underline';
}
button.onmouseout = function() {
    this.style.textDecoration = 'none';
}

let result = document.createElement('span');
result.textContent = '';
result.style='display: flex;align-items: center;margin-left: 10px;font-weight: 700;'

// Append the button to the header element
div.appendChild(button);
div.appendChild(result);
header.appendChild(div);

// Add click event to the button
button.onclick = async function() {
    let moy = await computeMoy();
    if (!isNaN(moy)){
        result.textContent = 'Moyenne : ' + moy.toFixed(2) + "/20";
    }else{
        result.textContent = 'Moyenne not defined'
    }
};

async function computeMoy(){
    let sum = 0;
    let sumCoef = 0;
    document.querySelectorAll(".txt-note").forEach((element) => {
        //extract the grade
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
    
    //Compute the whole moy
    let moy = sum / sumCoef;
    return moy;
}
