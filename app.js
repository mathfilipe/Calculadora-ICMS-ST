let produtos = [];

function formatarMoeda(valor) {

  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

}

// ADICIONAR PRODUTO
function adicionarProduto() {

  const nome = document.getElementById('nomeProduto').value || "Produto";

  const ncm = document.getElementById('ncm').value || "";

  const produto =
    parseFloat(document.getElementById('produto').value) || 0;

  const ipi =
    parseFloat(document.getElementById('ipi').value) || 0;

  const frete =
    parseFloat(document.getElementById('frete').value) || 0;

  const despesas =
    parseFloat(document.getElementById('despesas').value) || 0;

  const mva =
    (parseFloat(document.getElementById('mva').value) || 0) / 100;

  const reducao =
    (parseFloat(document.getElementById('reducao').value) || 0) / 100;

  const icmsProprioAliquota =
    (parseFloat(document.getElementById('icmsProprio').value) || 0) / 100;

  const icmsDestino =
    (parseFloat(document.getElementById('icmsDestino').value) || 18) / 100;

  if (produto <= 0) {

    alert("Informe o valor do produto");

    return;

  }

  produtos.push({
    nome,
    ncm,
    produto,
    ipi,
    frete,
    despesas,
    mva,
    reducao,
    icmsProprioAliquota,
    icmsDestino
  });

  atualizarTabela();

  atualizarResumo();

  limparCampos();

}

// LIMPAR CAMPOS
function limparCampos() {

  document.getElementById('nomeProduto').value = '';

  document.getElementById('ncm').value = '';

  document.getElementById('produto').value = '';

  document.getElementById('ipi').value = '';

  document.getElementById('frete').value = '';

  document.getElementById('despesas').value = '';

}

// ATUALIZAR TABELA
function atualizarTabela() {

  const tabela =
    document.getElementById('tabelaProdutos');

  tabela.innerHTML = '';

  if (produtos.length === 0) {

    tabela.innerHTML = `
      <tr>
        <td colspan="5">
          Nenhum produto adicionado.
        </td>
      </tr>
    `;

    return;

  }

  produtos.forEach((p) => {

    const valorBase =
      p.produto + p.ipi + p.frete + p.despesas;

    const baseST =
      valorBase * (1 + p.mva);

    const baseAjustada =
      baseST * (1 - p.reducao);

    const icmsProprio =
      valorBase * p.icmsProprioAliquota;

    const icmsTotal =
      baseAjustada * p.icmsDestino;

    let icmsST =
      icmsTotal - icmsProprio;

    if (icmsST < 0) {

      icmsST = 0;

    }

    tabela.innerHTML += `
      <tr>
        <td>${p.nome}</td>
        <td>${p.ncm}</td>
        <td>${formatarMoeda(p.produto)}</td>
        <td>${(p.mva * 100).toFixed(2)}%</td>
        <td>${formatarMoeda(icmsST)}</td>
      </tr>
    `;

  });

}

// CALCULAR TOTAL
function calcularICMSST() {

  let baseTotal = 0;

  let icmsProprioTotal = 0;

  let icmsSTTotal = 0;

  let totalProdutos = 0;

  produtos.forEach((p) => {

    const valorBase =
      p.produto + p.ipi + p.frete + p.despesas;

    const baseST =
      valorBase * (1 + p.mva);

    const baseAjustada =
      baseST * (1 - p.reducao);

    const icmsProprio =
      valorBase * p.icmsProprioAliquota;

    const icmsTotal =
      baseAjustada * p.icmsDestino;

    let icmsST =
      icmsTotal - icmsProprio;

    if (icmsST < 0) {

      icmsST = 0;

    }

    baseTotal += baseAjustada;

    icmsProprioTotal += icmsProprio;

    icmsSTTotal += icmsST;

    totalProdutos += valorBase;

  });

  document.getElementById('baseST').innerText =
    formatarMoeda(baseTotal);

  document.getElementById('icmsProprioTotal').innerText =
    formatarMoeda(icmsProprioTotal);

  document.getElementById('icmsST').innerText =
    formatarMoeda(icmsSTTotal);

  atualizarResumo(baseTotal, icmsSTTotal, totalProdutos);

}

// RESUMO
function atualizarResumo(baseTotal = 0, icmsSTTotal = 0, totalProdutos = 0) {

  document.getElementById('qtdProdutos').innerText =
    produtos.length;

  document.getElementById('valorTotalOperacao').innerText =
    formatarMoeda(totalProdutos);

  document.getElementById('resumoICMSST').innerText =
    formatarMoeda(icmsSTTotal);

}

// LIMPAR CARRINHO
function limparCarrinho() {

  produtos = [];

  atualizarTabela();

  document.getElementById('baseST').innerText =
    "R$ 0,00";

  document.getElementById('icmsProprioTotal').innerText =
    "R$ 0,00";

  document.getElementById('icmsST').innerText =
    "R$ 0,00";

  document.getElementById('qtdProdutos').innerText =
    "0";

  document.getElementById('valorTotalOperacao').innerText =
    "R$ 0,00";

  document.getElementById('resumoICMSST').innerText =
    "R$ 0,00";

}
