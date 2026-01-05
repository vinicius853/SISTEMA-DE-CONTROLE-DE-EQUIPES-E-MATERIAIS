// ELEMENTOS DO DOM
const form = document.getElementById("registroForm");
const tabela = document.getElementById("tabelaRegistros");
const totalGeralSpan = document.getElementById("totalGeral");
const filtroData = document.getElementById("filtroData");
const filtroEquipe = document.getElementById("filtroEquipe");

// CARREGAR REGISTROS DO LOCALSTORAGE
let registros = JSON.parse(localStorage.getItem("registros")) || [];

// SALVAR NO LOCALSTORAGE
function salvarLocalStorage() {
  localStorage.setItem("registros", JSON.stringify(registros));
}
const equipesResumo = {
  "Equipe 1": document.getElementById("eq1"),
  "Equipe 2": document.getElementById("eq2"),
  "Equipe 3": document.getElementById("eq3"),
  "Equipe 4": document.getElementById("eq4"),
  "Equipe 5": document.getElementById("eq5")
};

// ATUALIZAR TABELA E TOTAL
function atualizarTabela() {
	// RESET DOS CARDS
Object.values(equipesResumo).forEach(el => el.textContent = 0);

  tabela.innerHTML = "";
  let total = 0;

 registros
  .filter(registro => {
    const dataOk = filtroData.value ? registro.data === filtroData.value : true;
    const equipeOk = filtroEquipe.value ? registro.equipe === filtroEquipe.value : true;
    return dataOk && equipeOk;
  })
  .forEach((registro, index) => {

	  if (equipesResumo[registro.equipe]) {
  equipesResumo[registro.equipe].textContent =
    Number(equipesResumo[registro.equipe].textContent) + registro.luminarias;
}

    total += registro.luminarias;

    const tr = document.createElement("tr");

    tr.innerHTML = `
  <td>${registro.data}</td>
  <td>${registro.equipe}</td>
  <td>${registro.luminarias}</td>
  <td>
    Fio: ${registro.fio}m<br>
    Torção: ${registro.torcao}<br>
    Pressão: ${registro.pressao}<br>
    Fotocélula: ${registro.fotocelula}<br>
    Fita: ${registro.fita}
  </td>
  <td>
    <button class="btn-excluir" data-index="${index}">
      Excluir
    </button>
  </td>
`;


    tabela.appendChild(tr);
  });

  totalGeralSpan.textContent = total;
}

// EXCLUIR REGISTRO
tabela.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-excluir")) {
    const index = event.target.getAttribute("data-index");
    registros.splice(index, 1);
    salvarLocalStorage();
    atualizarTabela();
  }
});

// SUBMIT DO FORMULÁRIO
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = document.getElementById("data").value;
  const equipe = document.getElementById("equipe").value;

  // VALIDAÇÃO: 1 REGISTRO POR EQUIPE POR DIA
  const jaExiste = registros.some(
    (r) => r.data === data && r.equipe === equipe
  );

  if (jaExiste) {
    alert("Já existe um registro para essa equipe nesta data.");
    return;
  }

  const registro = {
    data,
    equipe,
    luminarias: Number(document.getElementById("luminarias").value),
    fio: Number(document.getElementById("fio").value || 0),
    torcao: Number(document.getElementById("torcao").value || 0),
    pressao: Number(document.getElementById("pressao").value || 0),
    fotocelula: Number(document.getElementById("fotocelula").value || 0),
    fita: Number(document.getElementById("fita").value || 0),
    obs: document.getElementById("obs").value
  };

  registros.push(registro);
  salvarLocalStorage();
  atualizarTabela();
  form.reset();
});

// INICIALIZAR
atualizarTabela();
filtroData.addEventListener("change", atualizarTabela);
filtroEquipe.addEventListener("change", atualizarTabela);

