let rendercnt = 20;
let curRenderCnt = 1;

async function init() {
    await includeHTML();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute('w3-include-html');
        let resp = await fetch(file);
        if(resp.ok) {
            element.innerHTML = await resp.text();
        }else {
            element.innerHTML = 'Page not found';
        }
    }
}

async function loadPokemon(id) {
    let url = "https://pokeapi.co/api/v2/pokemon/" + id;
    let response = await fetch(url);
    if(response.ok){
        let responseAsJson = response.json;
    }
    
}