/* 
  REGOLE
 chiama le funzioni dalla console o all'avvio.
*/

// Selezioniamo gli elementi principali del DOM definiti nell'HTML tramite ID
const listaTask = document.querySelector("#lista-task");
const contatore = document.querySelector("#contatore");

// Elementi di interfaccia legati ai bottoni e all'input 
const inputTask = document.querySelector("#nuovo-task");
const btnAggiungi = document.querySelector("#bottone-aggiungi");
const btnTutti = document.querySelector('#btn-tutti');
const btnAttivi = document.querySelector('#btn-attivi');
const btnCompletati = document.querySelector('#btn-completati');

// 7. data automatica nel task (Spostata sopra per poterla usare nell'Array globale)
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

// Array globale dei task: aggiornato con la proprietà 'completato' (booleano)
let tasks = [
  {
    testo: "Studiare JavaScript",
    priorita: "media",
    data: ottieniDataFormattata(),
    completato: true
  },

  {
    testo: "Scrivere la ToDoList",
    priorita: "bassa",
    data: ottieniDataFormattata(),
    completato: false
  },

  {
    testo: "Bere il caffè",
    priorita: "alta",
    data: ottieniDataFormattata(),
    completato: true
  },

  {
    testo: "Ripassare gli eventi DOM",
    priorita: "alta",
    data: ottieniDataFormattata(),
    completato: false
  }

];

// Stato per gestire il filtro corrente ('tutti' | 'attivi' | 'completati')
let filtroCorrente = "tutti";

// Funzione helper di supporto per aggiornare l'interfaccia utente a schermo
function render() {
  listaTask.innerHTML = "";

  tasks.forEach((task, index) => {
    // ---- LOGICA DI FILTRO ----
    if (filtroCorrente === "attivi" && task.completato) return;
    if (filtroCorrente === "completati" && !task.completato) return;

    const li = document.createElement("li");

    // Assegna la classe CSS in base alla priorità del task (alta, media, bassa)
    if (task.priorita === "alta") li.classList.add("priorita-alta");
    if (task.priorita === "media") li.classList.add("priorita-media");
    if (task.priorita === "bassa") li.classList.add("priorita-bassa");

    // Contenitore per la checkbox, il testo e la priorità
    const infoGroup = document.createElement("div"); 
    infoGroup.style.display = "flex";                 // aggiusta di poco la scritta ma è meglio
    infoGroup.style.alignItems = "center";

    // --- AGGIUNTA CHECKBOX PER STATO COMPLETATO ---
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completato;
    checkbox.addEventListener("change", () => {
      task.completato = checkbox.checked;
      render();
      aggiungiBottoneElimina();
    });

    const testoSpan = document.createElement("span");
    testoSpan.textContent = task.testo;

    // Applica lo stile sbarrato se completato
    if (task.completato) {
      testoSpan.style.textDecoration = "line-through";
      testoSpan.style.color = "gray";
    }

    const badgeSpan = document.createElement("span");
    badgeSpan.classList.add("badge");
    badgeSpan.textContent = task.priorita;
    
    // Assemblaggio infoGroup
    infoGroup.appendChild(checkbox);
    infoGroup.appendChild(testoSpan);
    infoGroup.appendChild(badgeSpan);

    // Contenitore destro per la data e il bottone di eliminazione
    const divData = document.createElement("div");
    divData.classList.add("divData");

    const dataSpan = document.createElement("span");
    dataSpan.classList.add("data");
    dataSpan.textContent = task.data;

    divData.appendChild(dataSpan);

    // Assemblaggio del componente della lista
    li.appendChild(infoGroup);
    li.appendChild(divData);
    listaTask.appendChild(li);
  });

  // --- AGGIORNAMENTO CONTATORE ATTIVI (TASK NON COMPLETATI) ---
  const taskAttivi = tasks.filter(task => !task.completato).length;
  contatore.textContent = taskAttivi;
}

// Task per accettare priorità
function aggiungiTask(testo, priorita = "media") {
  const prioritaMinuscola = priorita.toLowerCase();
  const dataCorrente = ottieniDataFormattata();

  tasks.push({
    testo: testo,
    priorita: prioritaMinuscola,
    data: dataCorrente,
    completato: false // I nuovi task nascono non completati
  });

  render();
  aggiungiBottoneElimina();
}

// 2. Aggiungi bottone Elimina su ogni task
function aggiungiBottoneElimina() {
  const tuttiILi = listaTask.querySelectorAll("li");
  let indiceVisibile = 0;

  tasks.forEach((task, index) => {
    if (filtroCorrente === "attivi" && task.completato) return;
    if (filtroCorrente === "completati" && !task.completato) return;

    const li = tuttiILi[indiceVisibile];
    if (li) {
      const divData = li.querySelector(".divData");

      if (!divData.querySelector("button")) {
        const bottoneElimina = document.createElement("button");
        bottoneElimina.textContent = "Elimina";
        bottoneElimina.classList.add("elimina-btn");

        bottoneElimina.onclick = () => {
          tasks.splice(index, 1);
          render();
          aggiungiBottoneElimina(); 
        };

        divData.appendChild(bottoneElimina);
      }
    }
    indiceVisibile++;
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

// 8. contaPerPriorita()
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

// creato per poter spostare da attivi e completati 
function impostaFiltro(nuovoFiltro) {
  filtroCorrente = nuovoFiltro;
  render();
  aggiungiBottoneElimina();
}

// --- AZIONE DEL TASTO AGGIUNGI DALL'INTERFACCIA GRAFICA ---
if (btnAggiungi && inputTask) {
  btnAggiungi.addEventListener("click", () => {
    const testo = inputTask.value.trim();
    if (testo !== "") {
      aggiungiTask(testo, "media"); // Di default assegna priorità media
      inputTask.value = " ";        // Svuota l'input dopo aver aggiunto
    }
  });

  // Funziona anche premendo il tasto INVIO sulla tastiera
  inputTask.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const testo = inputTask.value.trim();
      if (testo !== "") {
        aggiungiTask(testo, "media");
        inputTask.value = " ";
      }
    }
  });
}

// Collegamento dei filtri dinamici usando gli ID dei bottoni
if (btnTutti) btnTutti.addEventListener("click", () => impostaFiltro("tutti"));
if (btnAttivi) btnAttivi.addEventListener("click", () => impostaFiltro("attivi"));
if (btnCompletati) btnCompletati.addEventListener("click", () => impostaFiltro("completati"));


// Esecuzione iniziale al caricamento
render();
aggiungiBottoneElimina();