let rendercnt = 40;
let curRenderCnt = 1;

let typDE = ['Wasser', 'Feuer', 'Pflanze', 'Stahl', 'Geist', 'Elektro', 'Unlicht', 'Drache', 'Boden', 'Kampf', 'Psycho', 'Käfer', 'Fels', 'Eis', 'Flug', 'Gift', 'Normal', 'Fee'];
let typEN = ['bug', 'dragon', 'fairy', ]
async function init() {
    await includeHTML();
    renderPokeOverview();
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
        return await response.json();
    }else{
        console.log("error");
    }
}

function getPokemonName(pokeJson) {
    return pokeJson['name'];
}

function getPoketypes(pokeJson) {
    let typeArr = pokeJson['types'];
    let pokeTypeArr = [];
    for (let i = 0; i < typeArr.length; i++) {
        const type = typeArr[i];
        pokeTypeArr[i] = type['type']['name'];
    }

    return pokeTypeArr;
}

function renderPokeTypes(pokeTypeArr){
    console.log(pokeTypeArr);
    let pokeArrStr = '<div class="pokeTypes mr-16px">';
    for (let i = 0; i < pokeTypeArr.length; i++) {
        const element = pokeTypeArr[i];
        pokeArrStr += `
        <div>
            <span class="badge text-bg-light">${element}</span>
        </div>`;
    }
    pokeArrStr += '</div>';
    console.log(pokeArrStr);
    return pokeArrStr;
}

function getPokeId(pokeJson){
    return pokeJson['id'];
}

function getPokeImage(pokeJson) {
    return pokeJson['sprites']['other']['dream_world']['front_default'];
}

function getBackgroundClass(typeZero){
    return "background-color-" + typeZero
}

async function renderPokeContainer(pokeID){
    //console.log(pokeID)
    let pokeJson= await loadPokemon(pokeID);
    const pokeTypes = getPoketypes(pokeJson); 
    return `
    <div class="card ${getBackgroundClass(pokeTypes[0])} pokeContainer" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick=loadPokemonModal(${pokeID})>
        <div class="card-body">
        <div class="card-title d-flex justify-content-between">
            <h5 class="card-title">${getPokemonName(pokeJson)}</h5>
            <h5>#${getPokeId(pokeJson)}</h5>
        </div>
        <div class="pokeOverview">
            ${renderPokeTypes(pokeTypes)}
            <div>
            <img class="pokeImg" src="${getPokeImage(pokeJson)}" class="card-img-top" alt="...">
            </div>
        </div>
        </div>
    </div>
    `;
}

async function loadPokemonOverview() {
    let pokeOverviewContent = "";
    let end = curRenderCnt + rendercnt
    for (let i = curRenderCnt; i < end; i++) {
        pokeOverviewContent += await renderPokeContainer(i); 
        curRenderCnt++;  
    }

    return pokeOverviewContent;
}

async function renderPokeOverview() {
    document.getElementById('pokeStartContainer').innerHTML += await loadPokemonOverview();
}

async function loadPokemonModal(id) {
    let curPokemon = await loadPokemon(id);
    document.getElementById('pokeModalName').innerHTML = getPokemonName(curPokemon);
    document.getElementById('pokeModalId').innerHTML = "#" + getPokeId(curPokemon);

}