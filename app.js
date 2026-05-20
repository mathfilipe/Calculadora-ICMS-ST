let produtos = [];

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

// ➕ ADICIONAR PRODUTO
function adicionarProduto() {

  const nome = document.getElementById('nomeProduto').value || "Produto";
  const ncm = document.getElementById('ncm').value || "";

  const produto = parseFloat(document.getElementById('produto').value) || 0;
  const ipi = parseFloat(document.getElementById('ipi').value) || 0;
  const frete = parseFloat(document.getElementById('frete').value) || 0;
  const despesas = parseFloat(document.getElementById('despesas').value) || 0;

  const mva = (parseFloat(document.getElementById('mva').value) || 0) / 100;
  const reducao = (parseFloat(document.getElementById('reducao').value) || 0) / 100;
  const icmsProprioAliquota = (parseFloat(document.getElementById('icmsProprio').value) || 0) / 100;

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
    icmsProprioAliquota
  });

  limparCampos();
  atualizarResumo();
}

// 🧹 LIMPAR CAMPOS
function limparCampos() {
  document.getElementById('nomeProduto').value = '';
  document.getElementById('ncm').value = '';
  document.getElementById('produto').value = '';
  document.getElementById('ipi').value = '';
  document.getElementById('frete').value = '';
  document.getElementById('despesas').value = '';
}

// 📊 CALCULAR TUDO
function calcularICMSST() {

  let baseTotal = 0;
  let icmsProprioTotal = 0;
  let icmsSTTotal = 0;
  let totalProdutos = 0;

  produtos.forEach(p => {

    const valorBase = p.produto + p.ipi + p.frete + p.despesas;

    const baseST = valorBase * (1 + p.mva);

    const baseAjustada = baseST * (1 - p.reducao);

    const icmsProprio = p.produto * p.icmsProprioAliquota;

    const icmsTotal = baseAjustada * 0.18; // padrão (pode evoluir por UF)

    const icmsST = icmsTotal - icmsProprio;

    baseTotal += baseAjustada;
    icmsProprioTotal += icmsProprio;
    icmsSTTotal += icmsST;
    totalProdutos += p.produto;
  });

  document.getElementById('baseST').innerText = formatarMoeda(baseTotal);
  document.getElementById('icmsProprioTotal').innerText = formatarMoeda(icmsProprioTotal);
  document.getElementById('icmsST').innerText = formatarMoeda(icmsSTTotal);

  document.getElementById('resumo').innerHTML = `
    <h2>Resumo do Carrinho</h2>
    <p>Produtos: <strong>${produtos.length}</strong></p>
    <p>Total mercadorias: <strong>${formatarMoeda(totalProdutos)}</strong></p>
    <p>Base ST: <strong>${formatarMoeda(baseTotal)}</strong></p>
    <p>ICMS-ST: <strong>${formatarMoeda(icmsSTTotal)}</strong></p>
  `;
}

// 🧹 LIMPAR CARRINHO
function limparCarrinho() {
  produtos = [];
  document.getElementById('resumo').innerHTML = "<h2>Resumo do Carrinho</h2><p>Vazio</p>";
  document.getElementById('baseST').innerText = "R$ 0,00";
  document.getElementById('icmsProprioTotal').innerText = "R$ 0,00";
  document.getElementById('icmsST').innerText = "R$ 0,00";
}