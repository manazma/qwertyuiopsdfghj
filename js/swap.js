// =========================
// SWAP STATE & CONFIG
// =========================
// --- UPDATE: Default arah swap diubah menjadi PAXI -> TOKEN ---
window.direction = "PAXI_TOKEN"; 
let poolReserves = { paxi: 0, token: 0 }; 
let minOutputAmountInt = "1"; 

// Konfigurasi API Database Token
const DB_TOKENS_API = "api_tokens.php"; 
window.DYNAMIC_TOKENS = {}; // Menyimpan data token agar tidak bentrok dengan config.js lama
window.ACTIVE_TOKEN = null;

const SLIPPAGE_DEFAULT = 30.0; 
const LCD_URL = "https://mainnet-lcd.paxinet.io";
const RPC_URL = "https://mainnet-rpc.paxinet.io";
const SWAP_MODULE_ADDRESS = "paxi1mfru9azs5nua2wxcd4sq64g5nt7nn4n80r745t"; 

window.addEventListener('load', async () => {
  await fetchTokensFromDatabase();
  renderUI(); 
  if(window.WALLET) renderBalances();
  if(window.ACTIVE_TOKEN) fetchPool();
  updateSlippageUI(0);
});

// =========================
// URL MANAGEMENT (NEW)
// =========================
function updateURL() {
    if (!window.ACTIVE_TOKEN) return;
    const url = new URL(window.location);
    
    // d = 1 (TOKEN -> PAXI), d = 2 (PAXI -> TOKEN)
    const dirKode = window.direction === "TOKEN_PAXI" ? "1" : "2";
    url.searchParams.set('d', dirKode);
    
    // t = ID Angka Token
    if (window.ACTIVE_TOKEN.id_angka) {
        url.searchParams.set('t', window.ACTIVE_TOKEN.id_angka);
    }
    
    window.history.replaceState({}, '', url);
}

// =========================
// DATABASE FETCHING
// =========================
async function fetchTokensFromDatabase() {
    try {
        const res = await fetch(DB_TOKENS_API);
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
            let counterUrut = 1; // Buat nomor urut otomatis jika API tidak punya ID angka

            data.forEach(token => {
                window.DYNAMIC_TOKENS[token.contract_address] = {
                    id_angka: token.id ? parseInt(token.id) : counterUrut++, // Simpan ID Angka
                    symbol: token.symbol,
                    name: token.name || token.symbol,
                    contract: token.contract_address,
                    logo: token.logo || "", 
                    decimals: token.decimals ? parseInt(token.decimals) : 6,
                    burn_percent: token.burn_percent ? parseFloat(token.burn_percent) : 0
                };
            });
            
            const tokensArray = Object.values(window.DYNAMIC_TOKENS);
            
            // --- BACA URL PARAMETERS ANGKA ---
            const urlParams = new URLSearchParams(window.location.search);
            const urlT = urlParams.get('t'); // Baca token ID (angka)
            const urlD = urlParams.get('d'); // Baca direction ID (angka)

            // Set arah swap dari URL jika ada
            if (urlD === "1") {
                window.direction = "TOKEN_PAXI";
            } else if (urlD === "2") {
                window.direction = "PAXI_TOKEN";
            }
            // Jika tidak ada urlD, window.direction akan tetap "PAXI_TOKEN" sesuai default di atas

            let selectedToken = null;

            // Cari token berdasarkan ID angka di URL
            if (urlT) {
                selectedToken = tokensArray.find(t => t.id_angka == urlT);
            }

            // Jika token tidak ada di URL (atau salah), gunakan ORION sebagai fallback
            if (!selectedToken) {
                selectedToken = tokensArray.find(t => t.symbol.toUpperCase() === "ORION");
            }
            
            // Tetapkan token aktif dan perbarui URL agar rapi
            window.ACTIVE_TOKEN = selectedToken || tokensArray[0];
            updateURL(); 
        }
    } catch (error) {
        console.error("Gagal mengambil token dari Database:", error);
    }
}

// =========================
// UI RENDERERS
// =========================
function getLogoHtml(token, size = 24) {
    if (token && token.logo && token.logo.trim() !== "") {
        return `<img src="${token.logo}" style="width:${size}px; height:${size}px; border-radius:50%; object-fit:cover;">`;
    }
    const letter = token ? token.symbol.charAt(0).toUpperCase() : "?";
    return `<div style="width:${size}px; height:${size}px; background:#475569; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:${size/2.5}px; color:white;">${letter}</div>`;
}

window.renderUI = function() {
  const fromContainer = document.getElementById("fromContainer");
  const toContainer = document.getElementById("toContainer");
  const btn = document.getElementById("swapBtn");
  
  // Update tombol pojok kanan atas (Top Header)
  const topBtnText = document.getElementById("topWalletText");
  if (window.WALLET && topBtnText) {
      topBtnText.innerText = window.WALLET.substring(0, 6) + "..." + window.WALLET.slice(-4);
  } else if (topBtnText) {
      topBtnText.innerText = "Connect Wallet";
  }

  // Jika tidak ada token yang berhasil dimuat
  if (!window.ACTIVE_TOKEN) {
      if(btn) { btn.innerText = "No Tokens Available"; btn.disabled = true; }
      return;
  }
  
  // DYNAMIC BUTTON MAIN SWAP: Connect Wallet vs Swap Now
  if(!window.WALLET && btn) {
      btn.innerText = "Connect Wallet";
      btn.disabled = false; // Bisa diklik
      btn.onclick = window.connectWallet; // Panggil fungsi connect
  } else if (btn) {
      btn.innerText = "Swap";
      btn.disabled = false;
      btn.onclick = window.swap; // Panggil fungsi swap
  }

  const activeSymbol = window.ACTIVE_TOKEN.symbol;
  const burnRate = window.ACTIVE_TOKEN.burn_percent;
  const burnBadge = burnRate > 0 ? `<span style="font-size:10px; color:#fca5a5; margin-left:4px;">🔥${burnRate}%</span>` : "";

  // Token Selector Button (dengan gambar Logo)
  const tokenButtonHTML = `
    <button type="button" class="token-select-btn" onclick="openTokenModal()">
       <div style="display:flex; align-items:center; gap:8px;">
         ${getLogoHtml(window.ACTIVE_TOKEN, 24)}
         <span style="font-size:16px;">${activeSymbol}</span>
         ${burnBadge}
       </div>
       <i class="bi bi-chevron-down"></i>
    </button>
  `;

  const paxiBadgeHTML = `
    <div class="token-static-badge">
       <img src="https://paxinet.io/resources/img/icon_transparent.png" class="paxi-logo-img" alt="PAXI Logo">
       <span>PAXI</span>
    </div>
  `;

  if (window.direction === "TOKEN_PAXI") {
    fromContainer.innerHTML = tokenButtonHTML;
    toContainer.innerHTML = paxiBadgeHTML;
  } else {
    fromContainer.innerHTML = paxiBadgeHTML;
    toContainer.innerHTML = tokenButtonHTML;
  }
}

window.renderBalances = function() {
  const balFrom = document.getElementById("balFrom");
  const balTo = document.getElementById("balTo");
  if (!window.WALLET || !balFrom) return;

  const fmt = (num) => parseFloat(num || 0).toLocaleString('en-US', {maximumFractionDigits: 6});

  if (window.direction === "TOKEN_PAXI") {
    balFrom.textContent = "Balance: " + fmt(window.BALANCE_TOKEN);
    balTo.textContent = "Balance: " + fmt(window.BALANCE_PAXI);
  } else {
    balFrom.textContent = "Balance: " + fmt(window.BALANCE_PAXI);
    balTo.textContent = "Balance: " + fmt(window.BALANCE_TOKEN);
  }
}

function updateSlippageUI(impact) {
    const el = document.getElementById("slippageDisplay");
    if(el) {
        let color = "#38bdf8"; 
        if(impact > 5) color = "#facc15"; 
        if(impact > 20) color = "#ef4444"; 
        el.innerHTML = `Tol: <b>${SLIPPAGE_DEFAULT}%</b> | Impact: <b style="color:${color}">${impact.toFixed(2)}%</b>`;
    }
}

// =========================
// CONNECT WALLET LOGIC (DENGAN DEEP LINK)
// =========================
window.connectWallet = async function() {
    // Cek apakah ekstensi PaxiHub ada (PC / Browser dengan ekstensi)
    if (typeof window.paxihub !== 'undefined') {
        try {
            const acc = await window.paxihub.paxi.getAddress();
            window.WALLET = acc.address;
            
            // Perbarui UI setelah terkoneksi
            renderUI();
            if(typeof window.updateBalances === 'function') window.updateBalances();
            fetchPool();

        } catch (e) {
            console.error("Connection rejected", e);
        }
    } 
    // Jika di perangkat Mobile dan ekstensi tidak ditemukan -> Panggil Deep Link
    else if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        window.location.href = `paxi://hub/explorer?url=${encodeURIComponent(window.location.href)}`;
        // Jika PaxiHub tidak terpasang, arahkan ke halaman download setelah 1 detik
        setTimeout(() => {
            window.location.href = 'https://paxinet.io/paxi_docs/paxihub#paxihub-application';
        }, 1000);
    } 
    // Jika di Desktop tapi ekstensi tidak ada
    else {
        alert("PaxiHub Extension not found! Please install it to continue.");
    }
}

// =========================
// MODAL & IMPORT LOGIC
// =========================
window.openTokenModal = function() {
    document.getElementById('tokenModalOverlay').style.display = 'flex';
    document.getElementById('searchTokenInput').value = '';
    document.getElementById('searchTokenInput').focus();
    renderTokenList(); 
}

window.closeTokenModal = function() {
    document.getElementById('tokenModalOverlay').style.display = 'none';
}

async function renderTokenList() {
    const container = document.getElementById('tokenListScroll');
    const search = document.getElementById('searchTokenInput').value.toLowerCase().trim();
    container.innerHTML = ''; 

    const isAddressInput = search.startsWith('paxi1') && search.length > 30;
    let foundInLocal = false; 
    let hasResult = false;

    // Urutkan array agar ORION selalu di posisi pertama
    const allTokens = Object.values(window.DYNAMIC_TOKENS);
    allTokens.sort((a, b) => {
        if (a.symbol.toUpperCase() === "ORION") return -1;
        if (b.symbol.toUpperCase() === "ORION") return 1;
        return 0;
    });

    // 1. CARI DARI DATABASE YANG SUDAH DI-FETCH (Memory)
    for (const token of allTokens) {
        const matchName = token.symbol.toLowerCase().includes(search) || (token.name && token.name.toLowerCase().includes(search));
        const matchAddress = token.contract === search; 

        if (matchName || matchAddress) {
            const item = createTokenItem(token, false);
            container.appendChild(item);
            hasResult = true;
            if (matchAddress) foundInLocal = true;
        }
    }

    // 2. IMPORT MANUAL DARI BLOCKCHAIN (Jika format address valid tapi tidak ada di DB)
    if (isAddressInput && !foundInLocal) {
        const loadingDiv = document.createElement('div');
        loadingDiv.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8;"><div class="spinner" style="width:20px;height:20px;display:inline-block;margin-right:10px;"></div> Searching Blockchain...</div>`;
        container.insertBefore(loadingDiv, container.firstChild);

        try {
            const tokenData = await fetchTokenFromChain(search);
            loadingDiv.remove();

            if(tokenData) {
                const item = createTokenItem(tokenData, true);
                container.innerHTML = ''; 
                container.appendChild(item);
                hasResult = true;
            } else {
                container.innerHTML = `<div style="text-align:center; padding:20px; color:#ef4444;">Token Not Found on Chain</div>`;
                return;
            }
        } catch(e) { 
            loadingDiv.remove();
        }
    }
    
    if(!hasResult && !isAddressInput && search.length > 0) {
        container.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8;">No results found</div>`;
    }
}

function createTokenItem(token, isImport) {
    const item = document.createElement('div');
    item.className = 'token-item';
    const burnLabel = (token.burn_percent > 0) ? `<span style="color:#ef4444; font-size:10px; border:1px solid #ef4444; padding:1px 3px; border-radius:4px; margin-left:5px;">🔥${token.burn_percent}%</span>` : '';
    const importLabel = isImport ? `<span class="import-badge" style="font-size:10px; background:#f59e0b; color:#fff; padding:2px 4px; border-radius:4px; margin-left:5px;">Imported</span>` : '';

    item.innerHTML = `
        <div class="token-item-left">
            <div style="margin-right:12px;">${getLogoHtml(token, 36)}</div>
            <div class="token-item-info">
                <span class="token-symbol" style="display:flex; align-items:center;">${token.symbol} ${burnLabel} ${importLabel}</span>
                <span class="token-name">${token.name || token.symbol}</span>
                <span style="font-size:10px; color:#64748b;">${token.contract.substring(0, 10)}...${token.contract.slice(-4)}</span>
            </div>
        </div>
    `;
    item.onclick = function() { selectToken(token); };
    return item;
}

async function fetchTokenFromChain(contractAddr) {
    try {
        const query = btoa(JSON.stringify({ token_info: {} }));
        const url = `${LCD_URL}/cosmwasm/wasm/v1/contract/${contractAddr}/smart/${query}`;
        const res = await fetch(url).then(r => r.json());
        
        let info = res.data;
        if (typeof info === 'string') { try { info = JSON.parse(info); } catch(e){} }

        if(info && info.symbol) {
            return {
                id_angka: Date.now() % 1000000, // Beri ID Angka acak 6 digit untuk token baru agar URL tidak error
                symbol: info.symbol,
                name: info.name,
                contract: contractAddr,
                logo: "", 
                decimals: info.decimals ? parseInt(info.decimals) : 6, 
                burn_percent: 0 
            };
        }
    } catch(e) { return null; }
    return null;
}

function selectToken(tokenData) {
    // Jika token baru (import), simpan ke memory agar tidak perlu fetch chain lagi
    if(!window.DYNAMIC_TOKENS[tokenData.contract]) { 
        window.DYNAMIC_TOKENS[tokenData.contract] = tokenData; 
    }
    
    window.ACTIVE_TOKEN = window.DYNAMIC_TOKENS[tokenData.contract];

    updateURL(); // <-- UPDATE URL SETELAH PILIH TOKEN

    renderUI();
    document.getElementById("amount").value = "";
    document.getElementById("estimatedOutput").value = "";
    if(window.WALLET && typeof window.updateBalances === 'function') {
        window.updateBalances(); 
    }
    fetchPool(); 
    closeTokenModal();
}

document.getElementById('searchTokenInput').addEventListener('input', renderTokenList);

// =========================
// SWAP CALCULATION
// =========================
window.toggle = function() {
  window.direction = (window.direction === "TOKEN_PAXI") ? "PAXI_TOKEN" : "TOKEN_PAXI";
  
  updateURL(); // <-- UPDATE URL SETELAH TOGGLE
  
  const amt = document.getElementById("amount");
  const est = document.getElementById("estimatedOutput");
  if(amt.value && est.value) amt.value = est.value;
  renderUI();
  calculateEstimates(); 
  if (window.WALLET) renderBalances();
}

document.getElementById("amount").addEventListener("input", calculateEstimates);

async function fetchPool() {
  if (!window.ACTIVE_TOKEN || !window.ACTIVE_TOKEN.contract) return;

  try {
    const url = `${LCD_URL}/paxi/swap/pool/${window.ACTIVE_TOKEN.contract}`;
    const res = await fetch(url).then(r => r.json());
    
    if (!res.result && !res.reserve_paxi) {
        poolReserves = { paxi: 0, token: 0 }; 
        document.getElementById("estimatedOutput").placeholder = "No Liquidity";
    } else {
        poolReserves.paxi = parseFloat(res.result?.reserve_paxi || res.reserve_paxi || 0);
        poolReserves.token = parseFloat(res.result?.reserve_prc20 || res.reserve_prc20 || 0);
        document.getElementById("estimatedOutput").placeholder = "0";
    }
    calculateEstimates(); 
  } catch (e) {
    poolReserves = { paxi: 0, token: 0 };
  }
}

function calculateEstimates() {
  const amountIn = parseFloat(document.getElementById("amount").value) || 0;
  const estOutEl = document.getElementById("estimatedOutput");
  const minRecEl = document.getElementById("minReceivedDisplay");
  
  updateBurnUI(amountIn);

  if (poolReserves.paxi === 0 || poolReserves.token === 0 || amountIn <= 0) {
    estOutEl.value = "";
    updateSlippageUI(0);
    return;
  }

  let estimatedOut = 0;
  let decimalsOut = 6; 
  let symbolOut = "PAXI";
  let reserveIn = 0;

  if (window.direction === "TOKEN_PAXI") {
    const burnRate = window.ACTIVE_TOKEN.burn_percent || 0;
    const amountAfterBurn = amountIn - (amountIn * (burnRate / 100)); 
    
    const numerator = amountAfterBurn * 0.997 * poolReserves.paxi;
    const denominator = poolReserves.token + (amountAfterBurn * 0.997);
    
    estimatedOut = numerator / denominator;
    decimalsOut = 6; 
    symbolOut = "PAXI";
    reserveIn = poolReserves.token;

  } else {
    const numerator = amountIn * 0.997 * poolReserves.token;
    const denominator = poolReserves.paxi + (amountIn * 0.997);
    
    estimatedOut = numerator / denominator;
    decimalsOut = window.ACTIVE_TOKEN.decimals || 6; 
    symbolOut = window.ACTIVE_TOKEN.symbol;
    reserveIn = poolReserves.paxi;
  }

  const priceImpact = (amountIn / (reserveIn + amountIn)) * 100;
  updateSlippageUI(priceImpact);

  const slipConfig = SLIPPAGE_DEFAULT; 
  const minReceived = estimatedOut * ((100 - slipConfig) / 100);

  const multiplier = Math.pow(10, decimalsOut);
  minOutputAmountInt = String(Math.floor(minReceived * multiplier));

  estOutEl.value = estimatedOut.toFixed(6);
  minRecEl.textContent = minReceived.toFixed(4) + " " + symbolOut;
}

function updateBurnUI(amount) {
  const burnRow = document.getElementById("burnInfoRow");
  const burnAmtEl = document.getElementById("burnAmountDisplay");
  const burnRate = (window.ACTIVE_TOKEN && window.ACTIVE_TOKEN.burn_percent) ? window.ACTIVE_TOKEN.burn_percent : 0;

  if (window.direction === "TOKEN_PAXI" && burnRate > 0 && amount > 0) {
    burnRow.style.display = "flex";
    const burnVal = amount * (burnRate / 100);
    document.getElementById("burnPercent").innerText = burnRate;
    burnAmtEl.textContent = burnVal.toFixed(4) + " " + window.ACTIVE_TOKEN.symbol;
  } else {
    burnRow.style.display = "none";
  }
}

window.maxBalance = function() {
  if (!window.WALLET) return;
  const input = document.getElementById("amount");
  if (window.direction === "TOKEN_PAXI") {
    input.value = window.BALANCE_TOKEN || 0;
  } else {
    let max = (window.BALANCE_PAXI || 0) - 0.1; // Sisakan 0.1 untuk Gas Fee
    input.value = max > 0 ? max.toFixed(6) : 0;
  }
  calculateEstimates(); 
}

// =========================
// EXECUTION (FEE & SWAP)
// =========================
async function getAccount() {
  const r = await fetch(LCD_URL + "/cosmos/auth/v1beta1/accounts/" + window.WALLET).then(r => r.json());
  const a = r.account?.base_account || r.account;
  if (!a) throw new Error("Account not found");
  
  let pubKeyBytes;
  if (a.pub_key && a.pub_key.key) {
      pubKeyBytes = Uint8Array.from(atob(a.pub_key.key), c => c.charCodeAt(0));
  } else {
      const walletData = await window.paxihub.paxi.getAddress(); 
      pubKeyBytes = new Uint8Array(walletData.public_key);
  }
  return { number: BigInt(a.account_number), sequence: BigInt(a.sequence), pub: pubKeyBytes };
}

window.swap = async function() {
  const btn = document.getElementById("swapBtn");
  const originalText = btn.innerText;

  try {
    if (!window.WALLET) { 
        window.connectWallet(); // Buka koneksi jika terlewat (Safety Guard)
        return; 
    }
    if (poolReserves.paxi <= 0) { alert("Liquidity Pool not found."); return; }

    const amtInput = document.getElementById("amount").value;
    if (!amtInput || parseFloat(amtInput) <= 0) { alert("Please enter amount"); return; }

    btn.disabled = true;
    btn.innerText = "Processing Transaction...";

    let inputDecimals = (window.direction === "TOKEN_PAXI") ? (window.ACTIVE_TOKEN.decimals || 6) : 6;
    const multiplier = Math.pow(10, inputDecimals);
    const totalInputVal = Math.floor(parseFloat(amtInput) * multiplier);
    const msgs = [];

    // System Fee / Service Fee (jika dikonfigurasi di config.js)
    if (typeof SERVICE_FEE !== 'undefined' && SERVICE_FEE.address) {
        msgs.push(PaxiCosmJS.Any.fromPartial({
          typeUrl: "/cosmos.bank.v1beta1.MsgSend",
          value: PaxiCosmJS.MsgSend.encode({
            fromAddress: window.WALLET,
            toAddress: SERVICE_FEE.address,
            amount: PaxiCosmJS.coins(String(parseFloat(SERVICE_FEE.amount)), SERVICE_FEE.denom) 
          }).finish()
        }));
    }

    if (window.direction === "TOKEN_PAXI") {
      const burnRate = window.ACTIVE_TOKEN.burn_percent || 0;
      let swapAmountInt = totalInputVal;
      
      // Hitung & Eksekusi Potongan Burn Tax
      if (burnRate > 0) {
        const burnAmountInt = Math.floor(totalInputVal * (burnRate / 100));
        swapAmountInt = totalInputVal - burnAmountInt;
        msgs.push(PaxiCosmJS.Any.fromPartial({
          typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
          value: PaxiCosmJS.MsgExecuteContract.encode({
            sender: window.WALLET,
            contract: window.ACTIVE_TOKEN.contract,
            msg: new TextEncoder().encode(JSON.stringify({ burn: { amount: String(burnAmountInt) } })),
            funds: []
          }).finish()
        }));
      }

      // Allowance ke modul Swap
      msgs.push(PaxiCosmJS.Any.fromPartial({
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: PaxiCosmJS.MsgExecuteContract.encode({
          sender: window.WALLET,
          contract: window.ACTIVE_TOKEN.contract,
          msg: new TextEncoder().encode(JSON.stringify({ increase_allowance: { spender: SWAP_MODULE_ADDRESS, amount: String(swapAmountInt) } })),
          funds: []
        }).finish()
      }));

      // Swap Execution Token -> PAXI
      msgs.push(PaxiCosmJS.Any.fromPartial({
        typeUrl: "/x.swap.types.MsgSwap",
        value: PaxiCosmJS.MsgSwap.encode({
            creator: window.WALLET,
            prc20: window.ACTIVE_TOKEN.contract,
            offerDenom: window.ACTIVE_TOKEN.contract,
            offerAmount: String(swapAmountInt),
            minReceive: minOutputAmountInt
        }).finish()
      }));

    } else {
      // Swap Execution PAXI -> Token
      msgs.push(PaxiCosmJS.Any.fromPartial({
        typeUrl: "/x.swap.types.MsgSwap",
        value: PaxiCosmJS.MsgSwap.encode({
            creator: window.WALLET,
            prc20: window.ACTIVE_TOKEN.contract,
            offerDenom: "upaxi",
            offerAmount: String(totalInputVal),
            minReceive: minOutputAmountInt
        }).finish()
      }));
    }

    await signAndSend(msgs);

  } catch (err) { 
      alert("Error: " + err.message); 
      btn.disabled = false;
      btn.innerText = originalText;
  }
}

async function signAndSend(messages) {
  try {
    const nodeInfo = await fetch(RPC_URL + "/status").then(r => r.json());
    const chainId = nodeInfo.result.node_info.network;
    const acc = await getAccount(); 
    
    const body = PaxiCosmJS.TxBody.fromPartial({ messages });
    const fee = { amount: PaxiCosmJS.coins("75000", "upaxi"), gasLimit: 1500000 };
    
    const auth = PaxiCosmJS.AuthInfo.fromPartial({
      signerInfos: [{ publicKey: { typeUrl: "/cosmos.crypto.secp256k1.PubKey", value: PaxiCosmJS.PubKey.encode({ key: acc.pub }).finish() }, modeInfo: { single: { mode: 1 } }, sequence: acc.sequence }],
      fee
    });

    const signDoc = PaxiCosmJS.SignDoc.fromPartial({ bodyBytes: PaxiCosmJS.TxBody.encode(body).finish(), authInfoBytes: PaxiCosmJS.AuthInfo.encode(auth).finish(), chainId: chainId, accountNumber: acc.number });
    const txObj = { bodyBytes: btoa(String.fromCharCode(...signDoc.bodyBytes)), authInfoBytes: btoa(String.fromCharCode(...signDoc.authInfoBytes)), chainId: chainId, accountNumber: String(acc.number) };

    const signed = await window.paxihub.paxi.signAndSendTransaction(txObj);
    if (signed.code !== 0 && signed.code !== undefined) throw new Error("User Rejected Transaction");

    const sig = Uint8Array.from(atob(signed.success || signed.signature), c => c.charCodeAt(0));
    const raw = PaxiCosmJS.TxRaw.fromPartial({ bodyBytes: signDoc.bodyBytes, authInfoBytes: signDoc.authInfoBytes, signatures: [sig] });
    const txBytes = btoa(String.fromCharCode(...PaxiCosmJS.TxRaw.encode(raw).finish()));

    const res = await fetch(LCD_URL + "/cosmos/tx/v1beta1/txs", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ tx_bytes: txBytes, mode: "BROADCAST_MODE_SYNC" }) 
    }).then(r => r.json());

    if (res.tx_response && res.tx_response.code === 0) {
        const txHash = res.tx_response.txhash;
        document.getElementById("swapBtn").innerText = "Verifying with Network...";
        await pollTx(txHash);
    } else {
        throw new Error(res.tx_response?.raw_log || res.raw_log || "Failed to broadcast to chain");
    }

  } catch (err) { 
      alert("FAILED: " + err.message); 
      resetBtn();
  }
}

async function pollTx(txHash) {
    let attempts = 0;
    const maxAttempts = 20;

    const interval = setInterval(async () => {
        try {
            attempts++;
            const check = await fetch(LCD_URL + "/cosmos/tx/v1beta1/txs/" + txHash).then(r => r.json());

            if (check.tx_response) {
                clearInterval(interval);
                if (check.tx_response.code === 0) {
                    showSuccessModal(txHash);
                    logSwapToServer(txHash); 
                } else {
                    alert("Transaction Failed on Chain: " + check.tx_response.raw_log);
                    resetBtn();
                }
            }
        } catch (e) {}

        if (attempts >= maxAttempts) {
            clearInterval(interval);
            alert("Timeout. Please check Explorer to see if your transaction succeeded.");
            resetBtn();
        }
    }, 2000); 
}

function showSuccessModal(hash) {
    document.getElementById("txHash").textContent = hash;
    document.getElementById("txLink").href = "https://explorer.paxinet.io/txs/" + hash;
    const modal = document.getElementById("txSuccess");
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add('show'), 10);
    resetBtn();
    
    // Refresh balance & reset form
    setTimeout(() => {
        if(window.WALLET && typeof window.updateBalances === 'function') window.updateBalances();
        fetchPool();
        document.getElementById("amount").value = "";
        document.getElementById("estimatedOutput").value = "";
    }, 2000);
}

function resetBtn() {
    const btn = document.getElementById("swapBtn");
    btn.disabled = false;
    btn.innerText = "Swap";
}

window.closeModal = function() {
    const modal = document.getElementById('txSuccess');
    if(modal) {
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
}

// =========================
// LOGGING TO SERVER API
// =========================
function logSwapToServer(txHash) {
    try {
        const amountIn = document.getElementById("amount").value;
        const amountOut = document.getElementById("estimatedOutput").value;
        
        let tokenIn, tokenOut;
        
        if (window.direction === "TOKEN_PAXI") {
            tokenIn = window.ACTIVE_TOKEN ? window.ACTIVE_TOKEN.symbol : "TOKEN";
            tokenOut = "PAXI";
        } else {
            tokenIn = "PAXI";
            tokenOut = window.ACTIVE_TOKEN ? window.ACTIVE_TOKEN.symbol : "TOKEN";
        }

        const payload = {
            user_wallet: window.WALLET || "unknown",
            tx_hash: txHash,
            amount_in: amountIn,
            token_from: tokenIn,
            amount_out: amountOut,
            token_to: tokenOut
        };

        fetch('https://orionzera.xyz/api/api_log_swap.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).then(res => res.json()).then(data => {
            console.log("Log Swap Berhasil Tersimpan di DB");
        }).catch(err => console.error("Log Swap Gagal tersimpan:", err));

    } catch (e) {
        console.error("Error logging swap:", e);
    }
}