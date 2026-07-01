/* ================= TRANSLATIONS ================= */
const translations = {
    en: {
        mainTitle: "ORION Create Stake",
        connectWallet: "Connect Wallet",
        networkConfig: "Network",
        manual: "Custom ID...",
        enterChainId: "Chain ID",
        tokenInfo: "Token Configuration",
        contractLabel: "Contract Label",
        labelPlaceholder: "Ex: Paxi Staking Pool V1",
        stakingToken: "Deposit Token (PRC20)",
        rewardToken: "Reward Token (PRC20)",
        addrPlaceholder: "paxi1...",
        stakingRules: "Staking Parameters",
        lockType: "Lock Requirement",
        flexible: "Flexible",
        customDuration: "Locked",
        durationPlaceholder: "Duration in seconds (ex: 86400)",
        fixedApy: "Fixed APY Rate (%)",
        apyDesc: "Can be converted to dynamic later.",
        adminAddr: "Contract Administrator",
        adminPlaceholder: "Owner Wallet Address",
        advancedNote: "Note: Dynamic APY and LP Eligibility checks are disabled by default. You can enable them via the Admin Panel in the Staking Dashboard after deployment.",
        highGasMode: "HIGH GAS MODE:",
        feeDesc: "5.5 PAXI Miner Fee",
        orionFee: "Creation Fee: 50,000 ORION",
        deployBtn: "Deploy",
        logs: "Terminal Output",
        close: "Close",
        selectToken: "Select Token",
        searchPlaceholder: "Search symbol or paste address...",
        cancel: "Cancel",
        noTokens: "No tokens found",
        dbError: "Failed to load tokens from DB",
        walletError: "PaxiHub Extension not found! Please install to continue.",
        walletConnected: "Wallet is ready for deployment.",
        dbSuccess: "✅ SUCCESS! Saved to Database.",
        dbFail: "⚠️ DB Save Failed: ",
        inputError: "Input Error",
        tokenReq: "Both Token Addresses are required.",
        durationReq: "Enter lock duration in seconds.",
        apyReq: "Enter Fixed APY Rate.",
        deploying: "Deploying Contract...",
        signTx: "Please sign the transaction in your wallet. (Make sure you have 100,000 ORION for the fee).",
        waitingBlock: "Waiting for network confirmation... (Do not close)",
        deploySuccess: "Deployed Successfully!",
        deployFail: "Deployment Failed",
        timeout: "Timeout. Check the blockchain explorer."
    },
    zh: {
        mainTitle: "ORION 创建质押",
        connectWallet: "连接钱包",
        networkConfig: "网络设置",
        manual: "自定义 ID...",
        enterChainId: "输入链 ID",
        tokenInfo: "代币配置",
        contractLabel: "合约标签",
        labelPlaceholder: "例如: Paxi 质押 V1",
        stakingToken: "存入代币 (PRC20)",
        rewardToken: "奖励代币 (PRC20)",
        addrPlaceholder: "paxi1...",
        stakingRules: "质押参数",
        lockType: "锁定要求",
        flexible: "活期",
        customDuration: "定期",
        durationPlaceholder: "时长以秒为单位 (如: 86400)",
        fixedApy: "固定 APY 利率 (%)",
        apyDesc: "部署后可转换为动态 APY。",
        adminAddr: "合约管理员",
        adminPlaceholder: "所有者钱包地址",
        advancedNote: "注意：动态 APY 和 LP 资格检查默认关闭。部署后，您可以通过质押面板中的管理员控制台启用它们。",
        highGasMode: "高 Gas 模式:",
        feeDesc: "5.5 PAXI 矿工费",
        orionFee: "创建费用: 50,000 ORION",
        deployBtn: "部署",
        logs: "终端输出",
        close: "关闭",
        selectToken: "选择代币",
        searchPlaceholder: "搜索符号或粘贴地址...",
        cancel: "取消",
        noTokens: "未找到代币",
        dbError: "从数据库加载代币失败",
        walletError: "未找到 PaxiHub 钱包扩展！请安装以继续。",
        walletConnected: "钱包已准备就绪，可以部署。",
        dbSuccess: "✅ 成功！已保存到数据库。",
        dbFail: "⚠️ 数据库保存失败: ",
        inputError: "输入错误",
        tokenReq: "两个代币地址均为必填项。",
        durationReq: "请输入锁定持续时间（秒）。",
        apyReq: "请输入固定 APY 利率。",
        deploying: "正在部署合约...",
        signTx: "请在您的钱包中签署交易。(确保您有 100,000 ORION 作为手续费)。",
        waitingBlock: "等待网络确认... (请勿关闭)",
        deploySuccess: "部署成功！",
        deployFail: "部署失败",
        timeout: "超时。请手动检查区块链浏览器。"
    }
};

let currentLang = 'en';

function toggleLang() {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
    document.getElementById('lang-toggle').innerText = currentLang === 'en' ? 'EN' : '中文';
    updateLanguageUI();
}

function updateLanguageUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(translations[currentLang][key]) {
            if(el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                el.placeholder = translations[currentLang][key];
            } else {
                el.innerText = translations[currentLang][key];
            }
        }
    });
}

/* ================= STATE ================= */
let WALLET = null;
let CHAIN_ID = "paxi-mainnet";
const FIXED_CODE_ID = "22"; // Code ID untuk smart contract versi terbaru
const DB_URL = "api_tokens.php"; 

// ORION CONFIGURATION
const ORION_CONTRACT = "paxi1y0vna6d25hmgpsl63w2v2ks7j4tj7mwplr0pzfjmes5yqld59egsc7ahnz";
const FEE_RECEIVER = "paxi1ml5r9ptp5e5hh3c87fme9sf9lquxvwg9u9j8vm";
const ORION_FEE_AMOUNT = "50000000000"; // 100,000 with 6 decimals (100000 * 10^6)

/* ================= UTILS & UI ================= */
const logEl = document.getElementById("log");
function log(m) {
  const t = new Date().toLocaleTimeString();
  logEl.innerHTML = `<span style="color:#52525b">[${t}]</span> ${m}\n` + logEl.innerHTML;
}

function showPopup(type, title, msg) {
  const m = document.getElementById('modal');
  const ic = document.getElementById('popup-icon');
  m.classList.add('active');
  document.getElementById('popup-title').innerText = title;
  document.getElementById('popup-msg').innerText = msg;
  
  if(type === 'loading') {
    ic.innerHTML = '<div class="spinner"></div>';
    document.getElementById('popup-title').style.color = 'var(--primary)';
  } else if (type === 'success') {
    ic.innerHTML = '<div style="font-size:48px; margin-bottom:10px;">✨</div>';
    document.getElementById('popup-title').style.color = 'var(--success)';
  } else {
    ic.innerHTML = '<div style="font-size:48px; margin-bottom:10px;">⚠️</div>';
    document.getElementById('popup-title').style.color = 'var(--danger)';
  }
}

/* ================= TOKEN SEARCH LOGIC ================= */
let cachedTokens = [];
let currentTarget = null;

async function openTokenModal(target) {
    currentTarget = target;
    document.getElementById('token-modal').classList.add('active');
    document.getElementById('token-search-input').value = '';
    if(cachedTokens.length === 0) await fetchTokens();
    else renderTokens(cachedTokens);
}

function closeTokenModal() { document.getElementById('token-modal').classList.remove('active'); }

async function fetchTokens() {
    const container = document.getElementById('token-list-container');
    container.innerHTML = '<div class="spinner"></div>';
    try {
        const res = await fetch(DB_URL);
        const data = await res.json();
        if(Array.isArray(data)) {
            cachedTokens = data;
            renderTokens(data);
        }
    } catch(e) {
        container.innerHTML = `<p style="color:var(--danger); text-align:center;">${translations[currentLang].dbError}</p>`;
    }
}

function renderTokens(list) {
    const container = document.getElementById('token-list-container');
    container.innerHTML = '';
    if(list.length === 0) { container.innerHTML = `<p style="text-align:center; color:var(--text-muted);">${translations[currentLang].noTokens}</p>`; return; }
    
    list.forEach(token => {
        const div = document.createElement('div');
        div.className = 'token-item';
        div.onclick = () => {
            document.getElementById(currentTarget + '-token').value = token.contract_address;
            closeTokenModal();
        };
        
        const logo = token.logo || `https://placehold.co/36x36/27272a/FFF?text=${token.symbol[0]}`;
        const shortAddr = token.contract_address.slice(0, 8) + '...' + token.contract_address.slice(-6);
        
        div.innerHTML = `
            <img src="${logo}" class="token-logo" onerror="this.src='https://placehold.co/36x36/27272a/FFF?text=?'">
            <div class="token-info">
                <div class="token-symbol">${token.symbol}</div>
                <div class="token-name">${token.name || 'Unknown Token'}</div>
            </div>
            <div class="token-addr">${shortAddr}</div>
        `;
        container.appendChild(div);
    });
}

document.getElementById('token-search-input').oninput = (e) => {
    const val = e.target.value.toLowerCase();
    const filtered = cachedTokens.filter(t => 
        t.symbol.toLowerCase().includes(val) || 
        t.contract_address.toLowerCase().includes(val)
    );
    renderTokens(filtered);
};

/* ================= MANUAL ENCODER (POLYFILLS) ================= */
const Polyfill_MsgInstantiate = {
    encode: function(msg) {
        function encodeVarint(n) {
            if (n === 0) return [0];
            let bytes = [];
            while (n > 0) {
                let b = n & 0x7F;
                n = Math.floor(n / 128);
                if (n > 0) b |= 0x80;
                bytes.push(b);
            }
            return bytes;
        }
        const parts = [];
        if (msg.sender) { const b = new TextEncoder().encode(msg.sender); parts.push([0x0A, ...encodeVarint(b.length), ...b]); }
        if (msg.admin) { const b = new TextEncoder().encode(msg.admin); parts.push([0x12, ...encodeVarint(b.length), ...b]); }
        if (msg.codeId) { const val = Number(msg.codeId.toString()); parts.push([0x18, ...encodeVarint(val)]); }
        if (msg.label) { const b = new TextEncoder().encode(msg.label); parts.push([0x22, ...encodeVarint(b.length), ...b]); }
        if (msg.msg) { parts.push([0x2A, ...encodeVarint(msg.msg.length), ...msg.msg]); }
        const flat = []; parts.forEach(p => flat.push(...p));
        return { finish: () => new Uint8Array(flat) };
    }
};

const Polyfill_MsgExecute = {
    encode: function(msg) {
        function encodeVarint(n) {
            if (n === 0) return [0];
            let bytes = [];
            while (n > 0) {
                let b = n & 0x7F;
                n = Math.floor(n / 128);
                if (n > 0) b |= 0x80;
                bytes.push(b);
            }
            return bytes;
        }
        const parts = [];
        if (msg.sender) { const b = new TextEncoder().encode(msg.sender); parts.push([0x0A, ...encodeVarint(b.length), ...b]); }
        if (msg.contract) { const b = new TextEncoder().encode(msg.contract); parts.push([0x12, ...encodeVarint(b.length), ...b]); }
        if (msg.msg) { parts.push([0x1A, ...encodeVarint(msg.msg.length), ...msg.msg]); }
        const flat = []; parts.forEach(p => flat.push(...p));
        return { finish: () => new Uint8Array(flat) };
    }
};

/* ================= FORM TOGGLES ================= */
function toggleLock() {
    const type = document.querySelector('input[name="lockType"]:checked').value;
    const inputDiv = document.getElementById('block-lock-input');
    type === 'custom' ? inputDiv.classList.remove('hidden') : inputDiv.classList.add('hidden');
}

function updateChainId() {
  const sel = document.getElementById("chain-select");
  const inp = document.getElementById("chain-id-input");
  if (sel.value === "custom") {
    inp.classList.remove("hidden");
    CHAIN_ID = inp.value;
  } else {
    inp.classList.add("hidden");
    CHAIN_ID = sel.value;
  }
}
document.getElementById("chain-id-input").addEventListener("input", (e) => { CHAIN_ID = e.target.value; });

/* ================= CONNECT WALLET ================= */
async function connect() {
  if (typeof window.paxihub === 'undefined' || !window.paxihub?.paxi) {
      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
          window.location.href = `paxi://hub/explorer?url=${encodeURIComponent(window.location.href)}`;
          setTimeout(() => {
              window.location.href = 'https://paxinet.io/paxi_docs/paxihub#paxihub-application';
          }, 1000);
          return;
      } else {
          return showPopup('error', 'Wallet Error', translations[currentLang].walletError);
      }
  }

  try {
    const acc = await window.paxihub.paxi.getAddress();
    WALLET = acc.address;
    document.getElementById("wallet-text").innerText = WALLET.slice(0,6)+"..."+WALLET.slice(-4);
    document.getElementById("admin-address").value = WALLET; 
    log(`[Auth] Connected: ${WALLET}`);
    showPopup('success', 'Connected', translations[currentLang].walletConnected);
    setTimeout(closeAlert, 1500);
  } catch (e) { showPopup('error', 'Failed', e.message); }
}

function closeAlert() { document.getElementById('modal').classList.remove('active'); }

/* ================= SAVE DB ================= */
async function saveContractToDB(contractAddr) {
    try {
        log(`[DB] Synchronizing contract to Database...`);
        const payload = {
            address: contractAddr,
            chain_id: CHAIN_ID,
            label: document.getElementById("contract-label").value || "No Label",
            staking_token: document.getElementById("staking-token").value,
            reward_token: document.getElementById("reward-token").value,
            deployer: WALLET
        };
        const response = await fetch('save_contract.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (result.status === 'success') {
            log(`[DB] ${translations[currentLang].dbSuccess}`);
            return true;
        } else {
            log(`[DB] ${translations[currentLang].dbFail} ` + result.message);
            return false;
        }
    } catch (e) { log("[DB] Error: " + e.message); return false; }
}

/* ================= DEPLOY ================= */
async function deployContract() {
  const T = translations[currentLang];
  if (!WALLET) return showPopup('error', 'Auth Error', T.walletError);
  
  const rpcUrl = document.getElementById("rpc-url").value;
  const label = document.getElementById("contract-label").value;
  const stToken = document.getElementById("staking-token").value;
  const rwToken = document.getElementById("reward-token").value;
  const admin = document.getElementById("admin-address").value || WALLET;

  if (!stToken || !rwToken) return showPopup('error', T.inputError, T.tokenReq);

  let finalLock = 0;
  const lockType = document.querySelector('input[name="lockType"]:checked').value;
  if (lockType === 'custom') {
      const val = document.getElementById("lock-duration").value;
      if (!val) return showPopup('error', T.inputError, T.durationReq);
      finalLock = parseInt(val);
  }

  // PERBAIKAN: Memanggil elemen "fixed-apy", BUKAN "initial-apy"
  const apyInput = document.getElementById("fixed-apy").value;
  if (!apyInput) return showPopup('error', T.inputError, T.apyReq);
  const initialApyVal = parseInt(apyInput);

  showPopup('loading', T.deploying, T.signTx);

  try {
    // 1. BUAT MSG TRANSFER ORION FEE
    const transferMsgJson = {
        transfer: {
            recipient: FEE_RECEIVER,
            amount: ORION_FEE_AMOUNT
        }
    };
    log(`[Fee] Requesting 100,000 ORION transfer to ${FEE_RECEIVER.slice(0,8)}...`);

    const msgExecuteAny = PaxiCosmJS.Any.fromPartial({
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: Polyfill_MsgExecute.encode({
            sender: WALLET,
            contract: ORION_CONTRACT,
            msg: new TextEncoder().encode(JSON.stringify(transferMsgJson))
        }).finish()
    });

    // 2. BUAT MSG INSTANTIATE STAKING
    const initMsgJson = {
      staking_token: stToken,
      reward_token: rwToken,
      initial_apy: initialApyVal, 
      lock_duration: finalLock
    };
    log(`[Build] Compiling payload: Lock=${finalLock}s, APY=${initialApyVal}%`);

    const msgInstantiateAny = PaxiCosmJS.Any.fromPartial({
      typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract",
      value: Polyfill_MsgInstantiate.encode({
          sender: WALLET, 
          admin: admin,
          codeId: FIXED_CODE_ID, 
          label: label || `Staking-${Date.now()}`,
          msg: new TextEncoder().encode(JSON.stringify(initMsgJson)),
          funds: []
      }).finish()
    });

    // === GABUNGKAN KEDUA MSG KE DALAM 1 TRANSAKSI ===
    const messagesArray = [msgExecuteAny, msgInstantiateAny];

    const lcdUrl = rpcUrl.replace("rpc", "lcd");
    const accData = await fetch(`${lcdUrl}/cosmos/auth/v1beta1/accounts/${WALLET}`).then(r=>r.json());
    const acc = accData.account?.base_account || accData.account || accData;
    const seq = Number(acc.sequence||0);
    const num = Number(acc.account_number||acc.accountNumber||0);

    let pkBytes;
    const rawPub = acc.pub_key || acc.pubKey;
    if (rawPub?.key) pkBytes = Uint8Array.from(atob(rawPub.key), c=>c.charCodeAt(0));
    else {
        const s = await window.paxihub.paxi.getAddress();
        pkBytes = typeof s.public_key === 'string' ? Uint8Array.from(atob(s.public_key), c=>c.charCodeAt(0)) : new Uint8Array(s.public_key);
    }

    // === GAS TINGGI (55 JUTA) ===
    const fee = { amount: [{denom:"upaxi", amount:"5500000"}], gasLimit: "55000000" };
    
    const txBody = PaxiCosmJS.TxBody.fromPartial({ messages: messagesArray, memo: "Deploy ORION Factory + 100k Fee" });
    const authInfo = PaxiCosmJS.AuthInfo.fromPartial({
        signerInfos: [{ publicKey: {typeUrl:"/cosmos.crypto.secp256k1.PubKey", value:PaxiCosmJS.PubKey.encode({key:pkBytes}).finish()}, modeInfo:{single:{mode:1}}, sequence:BigInt(seq) }], fee
    });
    const signDoc = PaxiCosmJS.SignDoc.fromPartial({
        bodyBytes: PaxiCosmJS.TxBody.encode(txBody).finish(),
        authInfoBytes: PaxiCosmJS.AuthInfo.encode(authInfo).finish(),
        chainId: CHAIN_ID, accountNumber: BigInt(num)
    });

    const signed = await window.paxihub.paxi.signAndSendTransaction({
        bodyBytes: btoa(String.fromCharCode(...signDoc.bodyBytes)),
        authInfoBytes: btoa(String.fromCharCode(...signDoc.authInfoBytes)),
        chainId: CHAIN_ID, accountNumber: String(num)
    });

    let bBody;
    if (signed.tx_bytes) bBody = JSON.stringify({ tx_bytes: signed.tx_bytes, mode: "BROADCAST_MODE_SYNC" });
    else {
        // PERBAIKAN: Menangkap struktur signature dari berbagai versi DOMPET
        let sig = signed.signature || signed.success || signed.signed?.signatures?.[0] || signed.signatures?.[0];
        if(!sig) throw new Error("No Signature returned by Wallet");
        
        const txRaw = PaxiCosmJS.TxRaw.encode({
            bodyBytes: signDoc.bodyBytes, authInfoBytes: signDoc.authInfoBytes,
            signatures: [Uint8Array.from(atob(sig), c => c.charCodeAt(0))]
        }).finish();
        bBody = JSON.stringify({ tx_bytes: btoa(String.fromCharCode(...txRaw)), mode: "BROADCAST_MODE_SYNC" });
    }

    const res = await fetch(`${lcdUrl}/cosmos/tx/v1beta1/txs`, { method: "POST", headers:{"Content-Type":"application/json"}, body: bBody }).then(r=>r.json());

    if (res.tx_response && res.tx_response.code === 0) {
        log(`[Net] Broadcasting Tx: ${res.tx_response.txhash.slice(0,10)}...`);
        document.getElementById('popup-msg').innerText = T.waitingBlock;
        pollTx(res.tx_response.txhash, lcdUrl);
    } else {
        throw new Error(res.tx_response?.raw_log || "Broadcast Failed");
    }

  } catch (e) {
    console.error(e);
    log("[Error] " + e.message);
    showPopup('error', T.deployFail, e.message);
  }
}

async function pollTx(txHash, lcdUrl) {
    const T = translations[currentLang];
    let attempts = 0;
    const interval = setInterval(async () => {
        attempts++;
        try {
            const res = await fetch(`${lcdUrl}/cosmos/tx/v1beta1/txs/${txHash}`).then(r => r.json());
            if (res.tx_response) {
                clearInterval(interval);
                if (res.tx_response.code === 0) {
                    const logs = res.tx_response.logs || [];
                    let contractAddr = null;
                    const raw = JSON.stringify(logs);
                    
                    const matches = [...raw.matchAll(/_contract_address","value":"(paxi\w+)"/g)];
                    if(matches.length > 0) {
                        contractAddr = matches[matches.length - 1][1];
                    }

                    if (contractAddr) {
                        log(`[Success] Contract created: ${contractAddr}`);
                        await saveContractToDB(contractAddr);
                        showPopup('success', T.deploySuccess, `Contract Address:\n\n${contractAddr}\n\n(Saved to Database)`);
                    } else {
                        log("[Warn] Tx Success but address parsing failed.");
                        showPopup('success', T.deploySuccess, "Tx success but address parsing failed. Check explorer.");
                    }
                } else {
                    showPopup('error', T.deployFail, res.tx_response.raw_log);
                }
            }
        } catch(e) {}
        if(attempts > 20) { clearInterval(interval); showPopup('error','Timeout', T.timeout); }
    }, 3000);
}

if (typeof Long === 'undefined') { window.Long = { fromString: (v) => v }; }
updateLanguageUI();