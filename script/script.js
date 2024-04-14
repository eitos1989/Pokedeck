let rendercnt = 20;
let curRenderCnt = 1;

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

async function loadPokemonSpecis(id){
    let url = "https://pokeapi.co/api/v2/pokemon-species/" + id;
    let response = await fetch(url);
    if(response.ok){
        return await response.json();
    }else{
        console.log("error");
    }
}

// START Load data von PokemonAPI

function getAbilitiesStr(pokeJson){
    let abilitiesArr = pokeJson['abilities'];
    let pokeAbilityArr = [];
    for (let i = 0; i < abilitiesArr.length; i++) {
        const type = abilitiesArr[i];
        pokeAbilityArr[i] = type['ability']['name'];
    }

    return pokeAbilityArr.join(', ');
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

function getPokeId(pokeJson){
    return pokeJson['id'];
}

function getPokeImage(pokeJson) {
    return pokeJson['sprites']['other']['dream_world']['front_default'];
}

function getBackgroundClass(typeZero){
    return "background-color-" + typeZero;
}

function getPokeHeight(pokeJson){
    return pokeJson['height'];
}

function getPokeWeight(pokeJson) {
    return pokeJson['weight'];
}

function getStatsJSON(pokeJson) {
    let statsArr = pokeJson['stats'];
    let pokeStatsJSONStr = "{";
    for (let i = 0; i < statsArr.length; i++) {
        const statValue = statsArr[i]['base_stat'];
        const statName = statsArr[i]['stat']['name'];
        pokeStatsJSONStr += `"${statName}" : ${statValue}`;
        if(i != (statsArr.length-1)) {
            pokeStatsJSONStr += ", "
        }
    }
    pokeStatsJSONStr += "}"
    console.log(pokeStatsJSONStr)
    return JSON.parse(pokeStatsJSONStr);
}

function getMovesArr(pokeJson) {
    let moveArr = pokeJson['moves'];
    let pokeMoveArr = [];
    for (let i = 0; i < moveArr.length; i++) {
        const move = moveArr[i];
        pokeMoveArr[i] = move['move']['name'];
    }

    return pokeMoveArr;
}

// END Load data von PokemonAPI

function getSpecisBaseHappiness(specisJson){
    return specisJson['base_happiness'];
}

function getSpecisCaptureRate(specisJson){
    return specisJson['capture_rate'];
}

function getSpecisColor(specisJson) {
    return specisJson['color']['name'];
}

function getSpecisDescription(specisJson) {
    return specisJson['flavor_text_entries'][0]['flavor_text'];
}

function getSpecisGenus(specisJson) {
    return specisJson['genera'][7]['genus'];
}

function getSpecisHabitat(specisJson) {
    return specisJson['habitat']['name'];
}

// START Load data von SpecisAPI

// END Load data von SpecisAPI

// START Render Function
function renderPokeTypes(pokeTypeArr){
    let pokeArrStr = '<div class="pokeTypes mr-16px">';
    for (let i = 0; i < pokeTypeArr.length; i++) {
        const element = pokeTypeArr[i];
        pokeArrStr += `
        <div>
            <span class="badge text-bg-light">${element}</span>
        </div>`;
    }
    pokeArrStr += '</div>';
    return pokeArrStr;
}

async function renderPokeContainer(pokeID){
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

function renderPokeMoves(pokeTypeArr){
    let pokeArrStr = '';
    for (let i = 0; i < pokeTypeArr.length; i++) {
        const element = pokeTypeArr[i];
        pokeArrStr += `
        <div>
            <span class="badge text-bg-light">${element}</span>
        </div>`;
    }

    return pokeArrStr;
}

async function renderModalAboutTab(id, pokeJson) {
    let curPokemonSpecis = await loadPokemonSpecis(id);
    document.getElementById('pokeDescription').innerHTML = getSpecisDescription(curPokemonSpecis);
    document.getElementById('pokeWeight').innerHTML = getPokeWeight(pokeJson);
    document.getElementById('pokeHeight').innerHTML = getPokeHeight(pokeJson);
    document.getElementById('pokeBaseHappiness').innerHTML = getSpecisBaseHappiness(curPokemonSpecis);
    document.getElementById('pokeCaputureRate').innerHTML = getSpecisCaptureRate(curPokemonSpecis);
    document.getElementById('pokeColor').innerHTML = getSpecisColor(curPokemonSpecis);
    document.getElementById('pokeGenus').innerHTML = getSpecisGenus(curPokemonSpecis);
    document.getElementById('pokeHabitat').innerHTML = getSpecisHabitat(curPokemonSpecis);
    document.getElementById('pokeAbilities').innerHTML = getAbilitiesStr(pokeJson);
}

async function renderStatsTab(pokeStatsJSON) {
    const statsNames = Object.keys(pokeStatsJSON);
    const ctx = document.getElementById('statsChart');
    let statsValues = [];
    
    for (let i = 0; i < statsNames.length; i++) {
        statsValues[i]  = pokeStatsJSON[statsNames[i]];
    }
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: statsNames,
        datasets: [{
          label: 'PokeStats',
          data: statsValues,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

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
    const pokeTypes = getPoketypes(curPokemon); 
    document.getElementById('pokeModalName').innerHTML = getPokemonName(curPokemon);
    document.getElementById('pokeModalId').innerHTML = "#" + getPokeId(curPokemon);
    document.getElementById('pokeModalImage').src = getPokeImage(curPokemon);
    document.getElementById('movesGrid').innerHTML = renderPokeMoves(getMovesArr(curPokemon))
    document.getElementById('pokeModalContent').classList.add(getBackgroundClass(pokeTypes[0]))
    renderModalAboutTab(id, curPokemon);
    renderStatsTab(getStatsJSON(curPokemon));
}

// ENDE Render Function

