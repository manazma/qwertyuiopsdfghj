// ==========================================
    // AUTO REFRESH 1X UNTUK FIX IN-APP BROWSER
    // ==========================================
    if (!sessionStorage.getItem('hasAutoRefreshed')) {
        sessionStorage.setItem('hasAutoRefreshed', 'true');
        window.location.reload(); // Memaksa browser merefresh halaman secara otomatis
    }

    /* ================= TRANSLATIONS ================= */
    const translations = {
        en: {
            burnTitle: "Burn PRC20",
            connectDesc: "Connect your wallet to access the burn protocol.",
            connectWallet: "Connect Wallet",
            connected: "Connected:",
            selectToken: "Select Token",
            contractLabel: "Contract",
            balanceLabel: "Balance",
            amountLabel: "Amount to Burn",
            btnSelectFirst: "Select Token First",
            btnBurnToken: "Burn Tokens",
            btnInvalid: "Invalid Token",
            selectTokenTitle: "Select a Token",
            confirmTitle: "Confirm Burn?",
            confirmDesc1: "You are about to burn",
            confirmDesc2: "This action is permanent and cannot be undone.",
            cancel: "Cancel",
            ignite: "Ignite",
            successTitle: "Burn Successful!",
            successDesc: "Tokens have been permanently removed from circulation.",
            viewExplorer: "View on Explorer",
            close: "Close"
        },
        zh: {
            burnTitle: "销毁 PRC20",
            connectDesc: "连接您的钱包以访问销毁协议。",
            connectWallet: "连接钱包",
            connected: "已连接:",
            selectToken: "选择代币",
            contractLabel: "合约",
            balanceLabel: "余额",
            amountLabel: "销毁数量",
            btnSelectFirst: "请先选择代币",
            btnBurnToken: "销毁代币",
            btnInvalid: "无效代币",
            selectTokenTitle: "选择代币",
            confirmTitle: "确认销毁？",
            confirmDesc1: "您即将销毁",
            confirmDesc2: "此操作是永久的且无法撤销。",
            cancel: "取消",
            ignite: "点火销毁",
            successTitle: "销毁成功！",
            successDesc: "代币已从流通中永久移除。",
            viewExplorer: "在浏览器中查看",
            close: "关闭"
        }
    };

    let currentLang = 'en';
    function toggleLang() {
        currentLang = currentLang === 'en' ? 'zh' : 'en';
        updateLanguageUI();
        const searchInput = document.getElementById('searchTokenInput');
        if(searchInput) searchInput.placeholder = currentLang === 'en' ? "Search name or paste address (paxi1...)" : "搜索名称或粘贴地址 (paxi1...)";
    }
    
    function updateLanguageUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if(translations[currentLang][key]) el.innerText = translations[currentLang][key];
        });
        const connectBtn = document.getElementById("btn-connect");
        if(connectBtn && !connectBtn.disabled) connectBtn.innerHTML = translations[currentLang].connectWallet;
        const burnBtn = document.getElementById("burnBtn");
        if(burnBtn && !burnBtn.disabled && window.ACTIVE_TOKEN) burnBtn.innerHTML = translations[currentLang].btnBurnToken + ' <i class="bi bi-fire"></i>';
    }

    // ==========================================
    // GLOBAL STATE
    // ==========================================
    window.WALLET = null;
    window.BALANCE_PAXI = 0;
    window.BALANCE_TOKEN = 0;
    
    window.DYNAMIC_TOKENS = {};
    window.ACTIVE_TOKEN = null;
    let isTokensLoaded = false; 

    const LCD = "https://mainnet-lcd.paxinet.io";
    const RPC = "https://mainnet-rpc.paxinet.io";
    const DENOM = "upaxi";

    // ==========================================
    // INITIALIZATION & URL MANAGEMENT
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        updateLanguageUI();
        fetchTokensFromDatabase(); 
        
        const searchInput = document.getElementById('searchTokenInput');
        if (searchInput) searchInput.addEventListener('input', renderTokenList);
    });

    function openModal(id) { document.getElementById(id).classList.add('show'); }
    function closeModal(id) { document.getElementById(id).classList.remove('show'); }

    // --- NEW: URL Management untuk Token ---
    function updateTokenURL(tokenData) {
        const url = new URL(window.location);
        if (tokenData && tokenData.id_angka) {
            url.searchParams.set('t', tokenData.id_angka);
            url.searchParams.delete('c');
        } else if (tokenData && tokenData.contract) {
            url.searchParams.set('c', tokenData.contract); // Fallback jika token diimpor manual
            url.searchParams.delete('t');
        } else {
            url.searchParams.delete('t');
            url.searchParams.delete('c');
        }
        window.history.replaceState({}, '', url);
    }

    // ==========================================
    // CONNECT WALLET
    // ==========================================
    window.connect = async function() {
        console.log("Connect Wallet...");
        
        if (!window.paxihub || !window.paxihub.paxi) {
            // Jika dApp dibuka di HP tapi tidak ada wallet, arahkan ke deep link
            if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
                window.location.href = `paxi://hub/explorer?url=${encodeURIComponent(window.location.href)}`;
                setTimeout(() => { window.location.href = 'https://paxinet.io/paxi_docs/paxihub#paxihub-application'; }, 1000);
                return;
            }
            alert("PaxiHub Wallet tidak terdeteksi!");
            return;
        }

        try {
            const btn = document.getElementById("btn-connect");
            btn.innerHTML = '<i class="bi bi-arrow-repeat spin-anim"></i> Connecting...';
            btn.disabled = true;

            const res = await window.paxihub.paxi.getAddress();
            window.WALLET = res.address;
            
            document.getElementById("walletAddress").textContent = window.WALLET.slice(0, 6) + "..." + window.WALLET.slice(-4);
            
            document.getElementById('connectSection').classList.add('hidden');
            document.getElementById('burnInterface').classList.remove('hidden');

            await window.updateBalances();

        } catch (err) {
            alert("Gagal connect: " + err.message);
            document.getElementById("btn-connect").innerHTML = translations[currentLang].connectWallet;
            document.getElementById("btn-connect").disabled = false;
        }
    }

    // ==========================================
    // UPDATE BALANCE
    // ==========================================
    window.updateBalances = async function() {
        if (!window.WALLET) return;

        const btnRefresh = document.getElementById("btnRefresh");
        if(btnRefresh) btnRefresh.classList.add("spin-anim");

        try {
            // 1. Saldo PAXI
            const paxiRes = await fetch(`${LCD}/cosmos/bank/v1beta1/balances/${window.WALLET}/by_denom?denom=${DENOM}`)
                .then(r => r.json());
            
            const rawPaxi = paxiRes.balance?.amount || "0";
            window.BALANCE_PAXI = Number(rawPaxi) / 1000000;

            // 2. Saldo TOKEN
            if (!window.ACTIVE_TOKEN) {
                console.log("ACTIVE_TOKEN belum siap");
                if(btnRefresh) setTimeout(() => btnRefresh.classList.remove("spin-anim"), 500);
                return;
            }

            const queryJson = JSON.stringify({ balance: { address: window.WALLET } });
            const queryData = btoa(queryJson);
            
            const tokenRes = await fetch(`${LCD}/cosmwasm/wasm/v1/contract/${window.ACTIVE_TOKEN.contract}/smart/${queryData}`)
                .then(r => r.json());
            
            const rawToken = tokenRes.data?.balance || "0";
            window.BALANCE_TOKEN = Number(rawToken) / Math.pow(10, window.ACTIVE_TOKEN.decimals);

            if (window.renderBalances) window.renderBalances();

        } catch (e) {
            console.error("Gagal update saldo:", e);
        } finally {
            if(btnRefresh) setTimeout(() => btnRefresh.classList.remove("spin-anim"), 500);
        }
    }

    window.renderBalances = function() {
        if (!window.ACTIVE_TOKEN) return;

        document.getElementById("dispBalance").innerText = window.BALANCE_TOKEN.toLocaleString('en-US', {maximumFractionDigits: 6});
        document.getElementById('tokenDetails').classList.remove('hidden');
        document.getElementById('burnAmount').disabled = false;
        
        const btnBurn = document.getElementById("burnBtn");
        btnBurn.disabled = false;
        btnBurn.innerHTML = translations[currentLang].btnBurnToken + ' <i class="bi bi-fire"></i>';
        btnBurn.classList.add('ready');
        
        setStatus("", "neutral");
    }

    // ==========================================
    // API TOKENS & LIVE SEARCH
    // ==========================================
    async function fetchTokensFromDatabase() {
        try {
            const cachedData = localStorage.getItem('paxi_dynamic_tokens');
            if (cachedData) {
                const data = JSON.parse(cachedData);
                processTokenData(data);
                isTokensLoaded = true;
            }

            const res = await fetch('api_tokens.php');
            if(res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    localStorage.setItem('paxi_dynamic_tokens', JSON.stringify(data)); 
                    processTokenData(data);
                }
            }
        } catch (error) { 
            console.error("API Error:", error); 
        } finally {
            isTokensLoaded = true; 

            // --- NEW: Cek URL untuk load token otomatis ---
            const urlParams = new URLSearchParams(window.location.search);
            const urlT = urlParams.get('t'); // ID Angka
            const urlC = urlParams.get('c'); // Contract address manual
            
            let targetToken = null;

            if (urlT) {
                // Cari berdasarkan ID Angka
                targetToken = Object.values(window.DYNAMIC_TOKENS).find(t => t.id_angka == urlT);
            } else if (urlC) {
                // Cari berdasarkan Contract
                targetToken = window.DYNAMIC_TOKENS[urlC];
            }

            if (targetToken) {
                selectToken(targetToken);
            } else if (urlC && urlC.startsWith('paxi1') && urlC.length > 30) {
                // Fetch dari chain jika tidak ada di database tapi link berupa contract
                fetchTokenFromChain(urlC).then(tokenData => {
                    if (tokenData) selectToken(tokenData);
                });
            }

            if (document.getElementById('modalTokens').classList.contains('show')) {
                renderTokenList();
            }
        }
    }

    let tokenCounter = 1;
    function processTokenData(data) {
        data.forEach(token => {
            window.DYNAMIC_TOKENS[token.contract_address] = {
                id_angka: token.id ? parseInt(token.id) : tokenCounter++, // Menyimpan ID Angka
                symbol: token.symbol,
                name: token.name || token.symbol,
                contract: token.contract_address,
                logo: token.logo || "", 
                decimals: token.decimals ? parseInt(token.decimals) : 6
            };
        });
    }

    function openTokenModal() { 
        document.getElementById('searchTokenInput').value = '';
        renderTokenList();
        openModal('modalTokens'); 
        setTimeout(() => document.getElementById('searchTokenInput').focus(), 100);
    }

    function getLogoHtml(token, size = 36) {
        if (token && token.logo && token.logo.trim() !== "") {
            return `<img src="${token.logo}" loading="lazy" style="width:${size}px; height:${size}px; border-radius:50%; object-fit:cover; border: 1px solid var(--border-input);">`;
        }
        const letter = token ? token.symbol.charAt(0).toUpperCase() : "?";
        return `<div style="width:${size}px; height:${size}px; background:#334155; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:${size/2}px; color:white; border: 1px solid var(--border-input);">${letter}</div>`;
    }

    async function renderTokenList() {
        const container = document.getElementById('apiTokenList');
        const search = document.getElementById('searchTokenInput').value.toLowerCase().trim();
        container.innerHTML = ''; 

        const isAddressInput = search.startsWith('paxi1') && search.length > 30;
        let foundInLocal = false; 
        let hasResult = false;

        for (const contractAddr in window.DYNAMIC_TOKENS) {
            const token = window.DYNAMIC_TOKENS[contractAddr];
            const matchName = token.symbol.toLowerCase().includes(search) || (token.name && token.name.toLowerCase().includes(search));
            const matchAddress = token.contract === search; 

            if (matchName || matchAddress) {
                container.appendChild(createTokenItem(token, false));
                hasResult = true;
                if (matchAddress) foundInLocal = true;
            }
        }

        if (isAddressInput && !foundInLocal) {
            const loadingDiv = document.createElement('div');
            loadingDiv.innerHTML = `<div class="text-center text-gray my-4"><i class="bi bi-arrow-repeat spin-anim"></i> Searching Blockchain...</div>`;
            container.insertBefore(loadingDiv, container.firstChild);

            try {
                const tokenData = await fetchTokenFromChain(search);
                loadingDiv.remove();

                if(tokenData) {
                    container.innerHTML = ''; 
                    container.appendChild(createTokenItem(tokenData, true));
                    hasResult = true;
                } else {
                    container.innerHTML = `<div class="text-center text-danger my-4">Token Not Found on Chain</div>`;
                    return;
                }
            } catch(e) { loadingDiv.remove(); }
        }
        
        if(!hasResult && !isAddressInput && search.length > 0) {
            container.innerHTML = `<div class="text-center text-gray my-4">No results found</div>`;
        } else if (!hasResult && search.length === 0) {
            if (!isTokensLoaded) {
                container.innerHTML = `<div class="text-center text-gray my-4"><i class="bi bi-arrow-repeat spin-anim"></i> Loading tokens...</div>`;
            } else {
                container.innerHTML = `<div class="text-center text-gray my-4">No tokens available</div>`;
            }
        }
    }

    function createTokenItem(token, isImport) {
        const item = document.createElement('div');
        item.className = 'token-list-item';
        const importLabel = isImport ? `<span style="font-size:10px; background:#f59e0b; color:#fff; padding:2px 4px; border-radius:4px; margin-left:5px;">Imported</span>` : '';

        item.innerHTML = `
            ${getLogoHtml(token, 36)}
            <div class="token-list-info">
                <h4 style="display:flex; align-items:center; margin:0 0 4px 0; color:#fff; font-size:1rem;">
                    ${token.symbol} ${importLabel}
                </h4>
                <span style="color:var(--text-muted); font-size:0.8rem;">
                    ${token.name} &bull; ${token.contract.substring(0, 8)}...${token.contract.slice(-4)}
                </span>
            </div>
        `;
        item.onclick = function() { selectToken(token); };
        return item;
    }

    async function fetchTokenFromChain(contractAddr) {
        try {
            const query = btoa(JSON.stringify({ token_info: {} }));
            const url = `${LCD}/cosmwasm/wasm/v1/contract/${contractAddr}/smart/${query}`;
            const res = await fetch(url).then(r => r.json());
            
            let info = res.data;
            if (typeof info === 'string') { try { info = JSON.parse(info); } catch(e){} }

            if(info && info.symbol) {
                return {
                    id_angka: Date.now() % 1000000, // ID Acak untuk token custom agar URL tidak error
                    symbol: info.symbol,
                    name: info.name,
                    contract: contractAddr,
                    logo: "", 
                    decimals: info.decimals ? parseInt(info.decimals) : 6
                };
            }
        } catch(e) { return null; }
        return null;
    }

    function selectToken(tokenData) {
        if(!window.DYNAMIC_TOKENS[tokenData.contract]) { window.DYNAMIC_TOKENS[tokenData.contract] = tokenData; }
        window.ACTIVE_TOKEN = window.DYNAMIC_TOKENS[tokenData.contract];

        // --- NEW: Update URL setelah memilih Token ---
        updateTokenURL(window.ACTIVE_TOKEN);

        closeModal('modalTokens');
        
        const logoWrapper = document.getElementById('selTokenLogoWrapper');
        logoWrapper.innerHTML = getLogoHtml(window.ACTIVE_TOKEN, 28);
        document.getElementById('selTokenSymbol').innerText = window.ACTIVE_TOKEN.symbol;
        document.getElementById('contractAddress').value = window.ACTIVE_TOKEN.contract;
        document.getElementById('dispContract').innerText = window.ACTIVE_TOKEN.contract.substring(0, 10) + "..." + window.ACTIVE_TOKEN.contract.substring(window.ACTIVE_TOKEN.contract.length - 6);
        
        if (window.WALLET) {
            document.getElementById('burnBtn').innerHTML = '<i class="bi bi-arrow-repeat spin-anim"></i> Loading...';
            document.getElementById('burnBtn').disabled = true;
            window.updateBalances();
        }
    }

    // ==========================================
    // EXECUTION & TRANSACTION
    // ==========================================
    function setMaxAmount() {
        document.getElementById('burnAmount').value = window.BALANCE_TOKEN;
    }

    function initiateBurn() {
        const amount = document.getElementById("burnAmount").value;
        
        if (!amount || parseFloat(amount) <= 0) return alert("Enter valid amount");
        if (parseFloat(amount) > window.BALANCE_TOKEN) return alert("Insufficient balance");

        const symbol = document.getElementById("selTokenSymbol").innerText;
        document.getElementById("modalAmount").innerText = amount + " " + symbol;
        openModal("modalConfirm");
    }

    async function proceedBurn() {
        closeModal("modalConfirm");
        const amount = document.getElementById("burnAmount").value;
        const btn = document.getElementById("burnBtn");
        
        const originalText = btn.innerHTML;
        btn.disabled = true; 
        btn.innerHTML = '<i class="bi bi-arrow-repeat spin-anim"></i> Processing...';

        try {
            const rawAmount = Math.floor(parseFloat(amount) * Math.pow(10, window.ACTIVE_TOKEN.decimals)).toString();
            const msgObj = { burn: { amount: rawAmount } };
            
            const execMsg = PaxiCosmJS.MsgExecuteContract.fromPartial({ 
                sender: window.WALLET, 
                contract: window.ACTIVE_TOKEN.contract, 
                msg: new TextEncoder().encode(JSON.stringify(msgObj)) 
            });
            const anyMsg = PaxiCosmJS.Any.fromPartial({ 
                typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract", 
                value: PaxiCosmJS.MsgExecuteContract.encode(execMsg).finish() 
            });
            
            await buildAndSendTx([anyMsg]);
            
        } catch (e) {
            setStatus("Transaction Error: " + e.message, "error");
            btn.disabled = false; 
            btn.innerHTML = originalText;
        }
    }

    async function buildAndSendTx(messages) {
        const chainRes = await fetch(`${RPC}/status`).then(r => r.json());
        const chainId = chainRes.result.node_info.network;
        const accRes = await fetch(`${LCD}/cosmos/auth/v1beta1/accounts/${window.WALLET}`);
        const accJson = await accRes.json();
        const ba = accJson.account.base_account || accJson.account;
        
        const txBody = PaxiCosmJS.TxBody.fromPartial({ messages });
        const fee = { amount: [PaxiCosmJS.coins("40000", DENOM)[0]], gasLimit: 800_000 };
        
        const accInfoReq = await window.paxihub.paxi.getAddress();
        const pubkeyAny = { typeUrl: "/cosmos.crypto.secp256k1.PubKey", value: PaxiCosmJS.PubKey.encode({ key: new Uint8Array(accInfoReq.public_key) }).finish() };
        const authInfo = PaxiCosmJS.AuthInfo.fromPartial({ signerInfos: [{ publicKey: pubkeyAny, modeInfo: { single: { mode: 1 } }, sequence: BigInt(ba.sequence) }], fee });
        const signDoc = PaxiCosmJS.SignDoc.fromPartial({ bodyBytes: PaxiCosmJS.TxBody.encode(txBody).finish(), authInfoBytes: PaxiCosmJS.AuthInfo.encode(authInfo).finish(), chainId, accountNumber: BigInt(ba.account_number) });
        
        const txObj = { bodyBytes: btoa(String.fromCharCode(...signDoc.bodyBytes)), authInfoBytes: btoa(String.fromCharCode(...signDoc.authInfoBytes)), chainId, accountNumber: signDoc.accountNumber.toString() };
        const result = await window.paxihub.paxi.signAndSendTransaction(txObj);
        
        if(!result.success) throw new Error("Transaction rejected by user");

        const txRaw = PaxiCosmJS.TxRaw.fromPartial({ bodyBytes: signDoc.bodyBytes, authInfoBytes: signDoc.authInfoBytes, signatures: [Uint8Array.from(atob(result.success), c => c.charCodeAt(0))] });
        const txBytes = PaxiCosmJS.TxRaw.encode(txRaw).finish();
        const base64Tx = btoa(String.fromCharCode(...txBytes));

        const broadcast = await fetch(`${LCD}/cosmos/tx/v1beta1/txs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tx_bytes: base64Tx, mode: "BROADCAST_MODE_SYNC" }) }).then(r => r.json());

        if(broadcast.tx_response && broadcast.tx_response.code === 0) {
            const hash = broadcast.tx_response.txhash;
            try {
                const logData = { user_wallet: window.WALLET, tx_hash: hash, contract_address: window.ACTIVE_TOKEN.contract, amount: document.getElementById("burnAmount").value, symbol: window.ACTIVE_TOKEN.symbol };
                fetch('https://orionzera.xyz/api/api_log_burn.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(logData) });
            } catch (err) {}
            
            document.getElementById("explorerLink").href = "https://explorer.paxinet.io/txs/" + hash;
            openModal("modalSuccess");
            
            const btn = document.getElementById("burnBtn");
            btn.disabled = false;
            btn.innerHTML = translations[currentLang].btnBurnToken + ' <i class="bi bi-fire"></i>';
            document.getElementById("burnAmount").value = "";
            
            setTimeout(window.updateBalances, 2000); 
        } else {
            throw new Error(broadcast.tx_response.raw_log || "Broadcast failed");
        }
    }

    function setStatus(msg, type) {
        const el = document.getElementById("output");
        el.innerText = msg;
        el.className = `status-msg ${type === 'error' ? 'text-danger' : 'text-gray'}`;
    }