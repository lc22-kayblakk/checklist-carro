document.addEventListener("DOMContentLoaded", () => {
  const baseUrl = "https://parallelum.com.br/fipe/api/v1/carros";
  const btnMarca = document.getElementById("btn-marca");
  const btnModelo = document.getElementById("btn-modelo");
  const btnAno = document.getElementById("btn-ano");
  const dropdownMarca = document.getElementById("dropdown-marca");
  const dropdownModelo = document.getElementById("dropdown-modelo");
  const dropdownAno = document.getElementById("dropdown-ano");
  const btnProsseguir = document.getElementById("btn-prosseguir");

  let marcaSelecionada = null;
  let modeloSelecionado = null;
  let anoSelecionado = null;

  // Helper para criar opções e adicionar eventos
  function criarOpcao(texto, codigo, dropdown, button) {
    const div = document.createElement("div");
    div.textContent = texto;
    div.setAttribute("role", "option");
    div.dataset.codigo = codigo;
    div.tabIndex = 0;
    div.addEventListener("click", () => {
      button.textContent = texto + " ▶";
      dropdown.hidden = true;
      button.setAttribute("aria-expanded", "false");
      if (dropdown === dropdownMarca) {
        marcaSelecionada = codigo;
        modeloSelecionado = null;
        anoSelecionado = null;
        btnModelo.textContent = "SELECIONE ▶";
        btnModelo.disabled = false;
        btnAno.textContent = "SELECIONE ▶";
        btnAno.disabled = true;
        carregarModelos(codigo);
      } else if (dropdown === dropdownModelo) {
        modeloSelecionado = codigo;
        anoSelecionado = null;
        btnAno.textContent = "SELECIONE ▶";
        btnAno.disabled = false;
        carregarAnos(marcaSelecionada, modeloSelecionado);
      } else if (dropdown === dropdownAno) {
        anoSelecionado = codigo;
        btnProsseguir.disabled = false;
      }
    });
    div.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        div.click();
      }
    });
    dropdown.appendChild(div);
  }

  async function carregarMarcas() {
    const res = await fetch(`${baseUrl}/marcas`);
    const marcas = await res.json();
    dropdownMarca.innerHTML = "";
    marcas.forEach(marca => criarOpcao(marca.nome, marca.codigo, dropdownMarca, btnMarca));
  }

  async function carregarModelos(marcaId) {
    const res = await fetch(`${baseUrl}/marcas/${marcaId}/modelos`);
    const data = await res.json();
    dropdownModelo.innerHTML = "";
    data.modelos.forEach(modelo => criarOpcao(modelo.nome, modelo.codigo, dropdownModelo, btnModelo));
  }

  async function carregarAnos(marcaId, modeloId) {
    const res = await fetch(`${baseUrl}/marcas/${marcaId}/modelos/${modeloId}/anos`);
    const anos = await res.json();
    dropdownAno.innerHTML = "";
    anos.forEach(ano => criarOpcao(ano.nome, ano.codigo, dropdownAno, btnAno));
  }

  // Função para alternar dropdowns
  function toggleDropdown(dropdown, button) {
    const isOpen = !dropdown.hidden;
    // Fechar todos
    [dropdownMarca, dropdownModelo, dropdownAno].forEach(d => {
      d.hidden = true;
      d.previousElementSibling.setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      dropdown.hidden = false;
      button.setAttribute("aria-expanded", "true");
      dropdown.focus();
    }
  }

  btnMarca.addEventListener("click", () => toggleDropdown(dropdownMarca, btnMarca));
  btnModelo.addEventListener("click", () => {
    if (!btnModelo.disabled) toggleDropdown(dropdownModelo, btnModelo);
  });
  btnAno.addEventListener("click", () => {
    if (!btnAno.disabled) toggleDropdown(dropdownAno, btnAno);
  });

  // Fechar dropdowns ao clicar fora
  document.addEventListener("click", (e) => {
    if (![btnMarca, dropdownMarca, btnModelo, dropdownModelo, btnAno, dropdownAno].some(el => el.contains(e.target))) {
      [dropdownMarca, dropdownModelo, dropdownAno].forEach(d => {
        d.hidden = true;
        d.previousElementSibling.setAttribute("aria-expanded", "false");
      });
    }
  });

  // Botão prosseguir
  btnProsseguir.addEventListener("click", () => {
    if (marcaSelecionada && modeloSelecionado && anoSelecionado) {
      // redirecionar para checklist.html com query params para manter seleção
      window.location.href = `checklist.html?marca=${marcaSelecionada}&modelo=${modeloSelecionado}&ano=${anoSelecionado}`;
    }
  });

  carregarMarcas();
});
