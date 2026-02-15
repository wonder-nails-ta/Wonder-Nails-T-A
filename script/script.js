// ===============================
// CONFIGURAÇÕES DE FRETE
// ===============================
const FRETE_FIXO = 20;
const FRETE_GRATIS = 100;

// ===============================
// CONFIGURAÇÃO PERSONALIZADO
// ===============================
const VALOR_PERSONALIZADO_EXTRA = 5.90;

// ===============================
// CARRINHO
// ===============================
let cart = [];

// ===============================
// ABRIR / FECHAR CARRINHO
// ===============================
function toggleCart() {
  const carrinho = document.getElementById("carrinho");
  if (!carrinho) return;

  carrinho.style.display =
    carrinho.style.display === "block" ? "none" : "block";
}

// ===============================
// GERAR NÚMERO DO PEDIDO
// ===============================
function gerarNumeroPedido() {
  const agora = Date.now();
  const aleatorio = Math.floor(Math.random() * 1000);
  return `WN-${agora}-${aleatorio}`;
}

// ===============================
// VALIDAR CPF
// ===============================
function validarCPFSimples(cpf) {
  cpf = cpf.replace(/\D/g, "");
  return cpf.length === 11;
}

// ===============================
// INICIALIZAÇÃO AO CARREGAR A PÁGINA
// - atualiza estoque
// - garante que .tamanho-box esteja escondido
// - restaura/cria botão "Ver detalhes" e descrição, se necessário
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".product").forEach(produto => {
    // esconder opção de tamanho por padrão
    const tamanhoBox = produto.querySelector(".tamanho-box");
    if (tamanhoBox) {
      tamanhoBox.style.display = "none";
    }

    // se não existe botão de detalhes, cria um (mantendo comportamento toggle)
    let btnDetalhes = produto.querySelector(".btn-detalhes");
    const buyButtonFallback = produto.querySelector('button:not(.btn-detalhes)');

    if (!btnDetalhes) {
      btnDetalhes = document.createElement("button");
      btnDetalhes.className = "btn-detalhes";
      btnDetalhes.type = "button";
      btnDetalhes.innerText = "Ver detalhes";
      // insere antes da caixa de tamanho, se existir, senão antes do botão comprar
      if (tamanhoBox) {
        produto.insertBefore(btnDetalhes, tamanhoBox);
      } else if (buyButtonFallback) {
        produto.insertBefore(btnDetalhes, buyButtonFallback);
      } else {
        produto.appendChild(btnDetalhes);
      }
    }

    // se não existe descrição, cria uma descrição padrão (escondida)
    let descricao = produto.querySelector(".descricao-produto");
    if (!descricao) {
      descricao = document.createElement("div");
      descricao.className = "descricao-produto";
      descricao.style.display = "none";
      descricao.innerHTML = "<p>Contém unhas postiças, embalagem protetora, mini lixa e instruções de aplicação.</p>";
      // insere após o botão de detalhes
      btnDetalhes.insertAdjacentElement("afterend", descricao);
    } else {
      // garante que esteja escondida inicialmente
      descricao.style.display = "none";
    }

    // ligar o botão de detalhes ao toggle (evita duplicar handlers)
    btnDetalhes.onclick = function () {
      toggleDescricao(btnDetalhes);
    };

    // atualizar status estoque visual
    atualizarStatusEstoque(produto);
  });
});

// ===============================
// ATUALIZAR STATUS DO ESTOQUE
// - procura pelo botão de comprar correto (não o btn-detalhes)
// ===============================
function atualizarStatusEstoque(produto) {
  const estoque = parseInt(produto.dataset.estoque);
  const status = produto.querySelector(".status-estoque");
  let botaoCompra = produto.querySelector('button:not(.btn-detalhes)');
  if (!botaoCompra) botaoCompra = produto.querySelector("button");

  if (estoque <= 0) {
    if (status) {
      status.innerText = "❌ Esgotado";
      status.className = "status-estoque esgotado";
    }
    if (botaoCompra) {
      botaoCompra.disabled = true;
      botaoCompra.style.cursor = "not-allowed";
      botaoCompra.style.opacity = "0.6";
    }
    produto.classList.add("esgotado-produto");
  } else {
    if (status) {
      status.innerText = "✔️ Disponível";
      status.className = "status-estoque disponivel";
    }
    if (botaoCompra) {
      botaoCompra.disabled = false;
      botaoCompra.style.cursor = "";
      botaoCompra.style.opacity = "";
    }
    produto.classList.remove("esgotado-produto");
  }
}

// ===============================
// ADICIONAR AO CARRINHO
// ===============================
function addToCart(productName, basePrice, productId) {
  const produto = document.querySelector(`.product[data-id="${productId}"]`);
  if (!produto) {
    alert("Produto não encontrado.");
    return;
  }

  let estoque = parseInt(produto.dataset.estoque);
  if (estoque <= 0) {
    alert("❌ Produto esgotado!");
    return;
  }

  const tamanhoBox = produto.querySelector(".tamanho-box");
  const buyButton = produto.querySelector('button:not(.btn-detalhes)') || produto.querySelector("button");

  // Se houver tamanho e estiver escondido, mostrar e pedir confirmação
  if (tamanhoBox && (tamanhoBox.style.display === "" || tamanhoBox.style.display === "none")) {
    tamanhoBox.style.display = "block";
    if (buyButton) buyButton.innerText = "Confirmar";
    tamanhoBox.scrollIntoView({ behavior: "smooth", block: "center" });
    return; // ainda não adiciona ao carrinho
  }

  // Verifica se precisa selecionar tamanho apenas se houver caixa de tamanho
  let tamanhoSelecionado = "";
  if (tamanhoBox) {
    const selecionado = produto.querySelector(`input[name="tamanho-${productId}"]:checked`);
    if (!selecionado) {
      alert("⚠️ Por favor, escolha um tamanho antes de confirmar.");
      return;
    }
    tamanhoSelecionado = selecionado.value;
  }

  let precoFinal = basePrice;
  if (tamanhoSelecionado === "Personalizado") {
    precoFinal += VALOR_PERSONALIZADO_EXTRA;
  }

  // DIMINUI ESTOQUE e atualiza visual
  estoque--;
  produto.dataset.estoque = estoque;
  atualizarStatusEstoque(produto);

  // adiciona ao carrinho (com tamanho só se houver)
  cart.push({
    name: tamanhoSelecionado
      ? `${productName} | Tamanho: ${tamanhoSelecionado === "Personalizado" ? "Personalizado (medidas no WhatsApp)" : tamanhoSelecionado}`
      : productName,
    price: precoFinal
  });

  // resetar visual: esconder tamanho, desmarcar radios, voltar texto do botão
  if (tamanhoBox) {
    const radios = tamanhoBox.querySelectorAll('input[type="radio"]');
    radios.forEach(r => r.checked = false);
    tamanhoBox.style.display = "none";
  }
  if (buyButton) buyButton.innerText = "Comprar";

  document.getElementById("cart-count").innerText = cart.length;
  const cartFloatCount = document.getElementById("cart-float-count");
  if (cartFloatCount) cartFloatCount.innerText = cart.length;

  renderCartItems();
}

// ===============================
// RENDERIZAR CARRINHO
// ===============================
function renderCartItems() {

  verificarBrinde(); // 🔥 CHAMADA OBRIGATÓRIA

  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const li = document.createElement("li");
    li.textContent = `${item.name} - R$ ${item.price.toFixed(2)} `;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remover";
    removeBtn.style.marginLeft = "10px";

    removeBtn.onclick = function () {
      cart.splice(index, 1);
      document.getElementById("cart-count").innerText = cart.length;
      const cartFloatCount = document.getElementById("cart-float-count");
      if (cartFloatCount) cartFloatCount.innerText = cart.length;
      renderCartItems();
    };

    li.appendChild(removeBtn);
    cartItems.appendChild(li);
  });

  const cartTotalEl = document.getElementById("cart-total");
  if (cartTotalEl) cartTotalEl.innerText = `R$ ${total.toFixed(2)}`;

  const freteMsg = document.getElementById("frete-msg");
  if (freteMsg) {
    if (total >= FRETE_GRATIS) {
      freteMsg.innerText = "Você ganhou FRETE GRÁTIS!";
    } else {
      freteMsg.innerText =
        `Faltam R$ ${(FRETE_GRATIS - total).toFixed(2)} para ganhar FRETE GRÁTIS!`;
    }
  }
}

// ===============================
// FILTRO DE PRODUTOS
// ===============================
function filtrar(tipo) {
  const produtos = document.querySelectorAll(".product");
  const topos = document.querySelectorAll(".toposobre");
  const linhas = document.querySelectorAll(".linha-colecao");

  produtos.forEach(prod => {
    if (tipo === "todos" || prod.dataset.tipo === tipo) {
      prod.style.display = "block";
    } else {
      prod.style.display = "none";
    }
  });

  // 🔥 esconder ou mostrar TODOS os títulos
  topos.forEach(topo => {
    topo.style.display = (tipo === "todos") ? "block" : "none";
  });

  linhas.forEach(linha => {
    linha.style.display = (tipo === "todos") ? "block" : "none";
  });
}

// ===============================
// TOGGLE DESCRIÇÃO DO PRODUTO
// ===============================
function toggleDescricao(botao) {
  const descricao = botao.nextElementSibling;
  if (!descricao) {
    alert("Descrição não disponível.");
    return;
  }

  if (descricao.style.display === "block") {
    descricao.style.display = "none";
    botao.innerText = "Ver detalhes";
  } else {
    descricao.style.display = "block";
    botao.innerText = "Ocultar detalhes";
    descricao.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// ===============================
// CPF OBRIGATÓRIO FORA DE PAULO AFONSO
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  const campoCidade = document.getElementById("cidade");
  const campoCPF = document.getElementById("cpf");

  if (!campoCidade || !campoCPF) return;

  campoCPF.style.display = "none";
  campoCPF.required = false;

  campoCidade.addEventListener("input", function () {
    const cidade = campoCidade.value.toLowerCase().trim();

    if (cidade !== "" && !cidade.includes("paulo afonso")) {
      campoCPF.style.display = "block";
      campoCPF.required = true;
    } else {
      campoCPF.style.display = "none";
      campoCPF.required = false;
      campoCPF.value = "";
    }
  });
});

// ===============================
// FINALIZAR PEDIDO (WHATSAPP)
// ===============================
function checkout() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const nome = document.getElementById("nome").value.trim();
  const cep = document.getElementById("cep").value.trim();
  const rua = document.getElementById("rua").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  let cpf = document.getElementById("cpf").value.trim();

  if (!nome || !cep || !rua || !numero || !bairro || !cidade) {
    alert("Por favor, preencha todos os dados de entrega.");
    return;
  }

  if (!cidade.toLowerCase().includes("paulo afonso")) {
    cpf = cpf.replace(/\D/g, "");

    if (!cpf) {
      alert("CPF é obrigatório para entregas fora de Paulo Afonso.");
      return;
    }

    if (!validarCPFSimples(cpf)) {
      alert("CPF inválido. Digite apenas 11 números.");
      return;
    }
  }

  const numeroPedido = gerarNumeroPedido();
  let total = 0;

  let mensagem =
    `SITE WONDER NAILS T.A
NOVO PEDIDO RECEBIDO
━━━━━━━━━━━━━━━━━━

PEDIDO Nº: ${numeroPedido}

NOME: ${nome}

ENDEREÇO:
${rua}, Nº ${numero}
${bairro} – ${cidade}
CEP: ${cep}`;

  if (cpf) {
    mensagem += `\nCPF: ${cpf}`;
  }

  mensagem += `

PRODUTOS:
`;

  cart.forEach(item => {
    mensagem += `- ${item.name} — R$ ${item.price.toFixed(2)}\n`;
    total += item.price;
  });

  let frete = total >= FRETE_GRATIS ? 0 : FRETE_FIXO;

  mensagem += `
━━━━━━━━━━━━━━━━━━
FRETE: ${frete === 0 ? "GRÁTIS" : "R$ " + frete.toFixed(2)}
TOTAL: R$ ${(total + frete).toFixed(2)}`;

  const telefone = "5575992696445";
  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");

  // LIMPAR CARRINHO
  cart = [];
  renderCartItems();

  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.innerText = "0";
  const cartFloatCount = document.getElementById("cart-float-count");
  if (cartFloatCount) cartFloatCount.innerText = "0";
  const cartTotalEl = document.getElementById("cart-total");
  if (cartTotalEl) cartTotalEl.innerText = "R$ 0,00";

  const freteMsg = document.getElementById("frete-msg");
  if (freteMsg) freteMsg.innerText = "";

  ["nome", "cep", "rua", "numero", "bairro", "cidade", "cpf"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

  const cpfEl = document.getElementById("cpf");
  if (cpfEl) {
    cpfEl.style.display = "none";
    cpfEl.required = false;
  }

  const carrinhoEl = document.getElementById("carrinho");
  if (carrinhoEl) carrinhoEl.style.display = "none";

  alert("✅ Pedido finalizado com sucesso!");
}

// ===============================
// FECHAR TAMANHO AO CLICAR FORA DO PRODUTO
// ===============================
document.addEventListener("click", function (event) {
  document.querySelectorAll(".product").forEach(produto => {
    const tamanhoBox = produto.querySelector(".tamanho-box");
    if (!tamanhoBox) return;

    const buyButton =
      produto.querySelector('button:not(.btn-detalhes)') ||
      produto.querySelector("button");

    if (!produto.contains(event.target)) {
      if (tamanhoBox.style.display === "block") {
        tamanhoBox.style.display = "none";
        const radios = tamanhoBox.querySelectorAll('input[type="radio"]');
        radios.forEach(r => (r.checked = false));
        if (buyButton) buyButton.innerText = "Comprar";
      }
    }
  });
});

/*botão tamanho pronta entrega*/ 

function toggleTabela() {
  const tabela = document.getElementById("tabela-flutuante");
  tabela.style.display = tabela.style.display === "block" ? "none" : "block";
}

/* Fecha ao clicar fora */
document.addEventListener("click", function (event) {
  const tabela = document.getElementById("tabela-flutuante");
  const botao = document.querySelector(".btn-flutuante-tamanho");

  if (
    tabela.style.display === "block" &&
    !tabela.contains(event.target) &&
    !botao.contains(event.target)
  ) {
    tabela.style.display = "none";
  }
});


/*menu sanduiche*/

const hamburger = document.getElementById("hamburger");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

function toggleMenu() {
  sideMenu.classList.toggle("active");
  overlay.classList.toggle("active");
}

hamburger.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);



/*subir seta*/
const btnTop = document.getElementById("btnTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    btnTop.style.display = "block";
  } else {
    btnTop.style.display = "none";
  }
});

btnTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});



/* BARRA DE PESQUISA */

const searchInput = document.getElementById("searchInput");
const products = document.querySelectorAll(".product");
const suggestionsBox = document.getElementById("suggestions");

// guarda o display original (grid, flex, etc)
products.forEach(product => {
  product.dataset.display = getComputedStyle(product).display;
});

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getProductTexts() {
  return Array.from(products).map(product => {
    const title = product.querySelector("h2")?.textContent || "";
    const keywords = product.querySelector(".keywords")?.textContent || "";

    return {
      element: product,
      text: normalizeText(title + " " + keywords),
      title: title
    };
  });
}

const productData = getProductTexts();

function showSuggestions(value) {
  suggestionsBox.innerHTML = "";
  if (value.length < 2) {
    suggestionsBox.style.display = "none";
    return;
  }

  const matches = productData
    .filter(p => p.text.includes(value))
    .slice(0, 5);

  if (matches.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  matches.forEach(match => {
    const li = document.createElement("li");
    li.textContent = match.title || "Produto";
    li.onclick = () => {
      searchInput.value = li.textContent;
      filterProducts(normalizeText(li.textContent));
      suggestionsBox.style.display = "none";
    };
    suggestionsBox.appendChild(li);
  });

  suggestionsBox.style.display = "block";
}

function filterProducts(value) {
  products.forEach(product => {
    const title = product.querySelector("h2")?.textContent || "";
    const keywords = product.querySelector(".keywords")?.textContent || "";

    const fullText = normalizeText(title + " " + keywords);

    product.style.display = fullText.includes(value)
      ? product.dataset.display
      : "none";
  });

  atualizarCategorias();
}

function atualizarCategorias() {

  const topos = document.querySelectorAll(".toposobre");

  topos.forEach(topo => {

    let elemento = topo.nextElementSibling;
    let temProdutoVisivel = false;

    while (elemento && !elemento.classList.contains("toposobre")) {

      if (elemento.classList.contains("product") &&
        elemento.style.display !== "none") {
        temProdutoVisivel = true;
      }

      elemento = elemento.nextElementSibling;
    }

    const linha = topo.nextElementSibling;

    if (temProdutoVisivel) {
      topo.style.display = "block";
      if (linha && linha.classList.contains("linha-colecao")) {
        linha.style.display = "block";
      }
    } else {
      topo.style.display = "none";
      if (linha && linha.classList.contains("linha-colecao")) {
        linha.style.display = "none";
      }
    }

  });
}

searchInput.addEventListener("input", () => {
  const value = normalizeText(searchInput.value.trim());

  if (value === "") {
    products.forEach(product => {
      product.style.display = product.dataset.display;
    });
    suggestionsBox.style.display = "none";

    document.querySelectorAll(".toposobre").forEach(t => {
      t.style.display = "block";
    });

    document.querySelectorAll(".linha-colecao").forEach(l => {
      l.style.display = "block";
    });
    return;
  }



  filterProducts(value);
  showSuggestions(value);
});

// evita bug do Enter
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") e.preventDefault();
});

// fecha sugestões ao clicar fora
document.addEventListener("click", e => {
  if (!e.target.closest(".search-container")) {
    suggestionsBox.style.display = "none";
  }
});



/*BRINDE DE 170 */

function verificarBrinde() {
  const VALOR_MINIMO = 170;
  const NOME_BRINDE = "🎁 Brinde Especial Wonder Nails nas compras de +R$170 (Mini porta joias)";

  // calcula total SEM o brinde
  let total = 0;
  cart.forEach(item => {
    if (item.name !== NOME_BRINDE) {
      total += item.price;
    }
  });

  const temBrinde = cart.some(item => item.name === NOME_BRINDE);

  if (total >= VALOR_MINIMO && !temBrinde) {
    cart.push({
      name: NOME_BRINDE,
      price: 0
    });
  }

  if (total < VALOR_MINIMO && temBrinde) {
    cart = cart.filter(item => item.name !== NOME_BRINDE);
  }
}


