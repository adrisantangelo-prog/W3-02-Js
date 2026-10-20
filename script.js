/*
  REGOLE
  - Continua quello che hai iniziato stamani in classe.
  - Niente eventi (li vediamo domani): chiama le funzioni dalla console o all'avvio.
  - Solo const/let, mai var. Solo querySelector/querySelectorAll per il DOM.
*/

/* SCRIVI QUI LE TUE FUNZIONI:
   1. Modifica aggiungiTask per accettare priorita
   2. Aggiungi bottone Elimina su ogni task
   6. evidenzia(indice) / togliEvidenza(indice)
   7. data automatica nel task
   8. contaPerPriorita()
*/

// Selezioniamo gli elementi principali del DOM definiti nell'HTML
const listaTask = document.querySelector("#lista-task");
const contatore = document.querySelector("#contatore");

//data automatica nel task
function ottieniDataFormattata() {
  const ora = new Date();
  
  const giorno = String(ora.getDate()).padStart(2, '0');
  const mese = String(ora.getMonth() + 1).padStart(2, '0');
  const anno = ora.getFullYear();  
  
  const ore = String(ora.getHours()).padStart(2, '0');
  const minuti = String(ora.getMinutes()).padStart(2, '0');
  const secondi = String(ora.getSeconds()).padStart(2, '0');
  
  return `${giorno}/${mese}/${anno}, ${ore}:${minuti}:${secondi}`;
}

// Array globale dei task: ora le date si aggiornano da sole al caricamento della pagina!
let tasks = [
  { testo: "Pagare le bollette", priorita: "alta", data: ottieniDataFormattata() },
  { testo: "Studiare JavaScript", priorita: "media", data: ottieniDataFormattata() },
  { testo: "Comprare il pane", priorita: "bassa", data: ottieniDataFormattata() },
  { testo: "Chiamare il dentista", priorita: "alta", data: ottieniDataFormattata() },
  { testo: "Riposarsi", priorita: "bassa", data: ottieniDataFormattata() }
];

// Funzione helper di supporto per aggiornare l'interfaccia utente a schermo
function render() {
  listaTask.innerHTML = " ";
  
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    
    // Assegna la classe CSS in base alla priorità del task (alta, media, bassa)
    if (task.priorita === "alta") li.classList.add("priorita-alta");
    if (task.priorita === "media") li.classList.add("priorita-media");
    if (task.priorita === "bassa") li.classList.add("priorita-bassa");
    
    // Contenitore per il testo e la priorità
    const infoGroup = document.createElement("div");
    infoGroup.style.display = "flex";
    infoGroup.style.alignItems = "center";
    
    const testoSpan = document.createElement("span");
    testoSpan.textContent = task.testo;
    
    const badgeSpan = document.createElement("span");
    badgeSpan.classList.add("badge");
    badgeSpan.textContent = task.priorita;
    
    infoGroup.appendChild(testoSpan);
    infoGroup.appendChild(badgeSpan);
    
    // Contenitore destro per la data e il bottone di eliminazione
    const divData = document.createElement("div");
    divData.classList.add("divData");
    
    const dataSpan = document.createElement("span");
    dataSpan.classList.add("data");
    dataSpan.textContent = task.data;
    
    divData.appendChild(dataSpan);
    
    // Assemblaggio del componente della lista i child sono seriali e parti dal primo a scende
    li.appendChild(infoGroup);  
    li.appendChild(divData);
    listaTask.appendChild(li);
  });
  
  // Aggiorna l'elemento del contatore numerico
  contatore.textContent = tasks.length;
}


// 1. Modifica aggiungiTask per accettare priorità
function aggiungiTask(testo, priorita) {
  const prioritaMinuscola = priorita.toLowerCase();
  
  const dataCorrente = ottieniDataFormattata();
  
  tasks.push({
    testo: testo,
    priorita: prioritaMinuscola,
    data: dataCorrente
  });
  
  render();
  aggiungiBottoneElimina();
}

// 2. Aggiungi bottone Elimina su ogni task
function aggiungiBottoneElimina() {
  const tuttiILi = listaTask.querySelectorAll("li");
  
  tuttiILi.forEach((li, index) => {
    const divData = li.querySelector(".divData");
    
    if (!divData.querySelector("button")) {
      const bottoneElimina = document.createElement("button");
      bottoneElimina.textContent = "Elimina";
      
      bottoneElimina.onclick = () => {
        tasks.splice(index, 1);
        render();
        aggiungiBottoneElimina();
      };
      
      divData.appendChild(bottoneElimina); 
    }
  });
}

// 6. evidenzia(indice) / togliEvidenzia(indice)
function evidenzia(indice) {
  const tuttiILi = listaTask.querySelectorAll("li");
  if (tuttiILi[indice]) {
    tuttiILi[indice].classList.add("evidenziato");
  }
}

function togliEvidenzia(indice) {
  const tuttiILi = listaTask.querySelectorAll("li");
  if (tuttiILi[indice]) {
    tuttiILi[indice].classList.remove("evidenziato");
  }
}

// 8. contaPerPriorita ri dice quante sono le task totali (puoi semplificarlo)
function contaPerPriorita() {
  let conteggio = { alta: 0, media: 0, bassa: 0 };
  
  tasks.forEach(task => {
    if (conteggio[task.priorita] !== undefined) {
      conteggio[task.priorita]++;
    }
  });
  
  console.log("Conteggio Task per Priorità:");
  console.table(conteggio);
  return conteggio;
}

// Esecuzione iniziale al caricamento
render();
aggiungiBottoneElimina();
