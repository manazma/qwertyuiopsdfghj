/* ================= TRANSLATIONS ================= */
const translations = {
    en: {
        appTitle: "ORION STAKING",
        connectWallet: "Connect Wallet",
        cancel: "Cancel",
        apyLabel: "APY",
        tvlLabel: "TVL",
        lockLabel: "Lock Term",
        tabStake: "Deposit",
        tabUnstake: "Withdraw",
        inputLabelStake: "Amount to deposit",
        inputLabelUnstake: "Amount to withdraw",
        balance: "Balance:",
        stakeBtn: "Approve & Deposit",
        unstakeBtn: "Withdraw Funds",
        enterAmt: "Enter Amount",
        pendingReward: "Pending Earned",
        claimBtn: "Claim",
        holdersTitle: "TOP STAKING",
        loading: "No data",
        close: "Close"
    },
    zh: {
        appTitle: "ORION 质押",
        connectWallet: "连接钱包",
        cancel: "取消",
        apyLabel: "年化收益",
        tvlLabel: "总锁仓量",
        lockLabel: "锁仓期",
        tabStake: "存入",
        tabUnstake: "提取",
        inputLabelStake: "存入数量",
        inputLabelUnstake: "提取数量",
        balance: "余额:",
        stakeBtn: "授权并存入",
        unstakeBtn: "提取资金",
        enterAmt: "输入数量",
        pendingReward: "待领取收益",
        claimBtn: "领取",
        holdersTitle: "顶级质押者",
        loading: "暂无数据",
        close: "关闭"
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
        if (translations[currentLang][key]) {
            if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                // Ignore placeholder for inputs
            } else {
                el.innerText = translations[currentLang][key];
            }
        }
    });
    updateActionBtnText();
}

/* ================= KONFIGURASI ================= */
const RPC = "https://mainnet-rpc.paxinet.io";
const LCD = "https://mainnet-lcd.paxinet.io";
const CHAIN_ID = "paxi-mainnet";
const DECIMALS = 6;
const DENOM = "upaxi";
const CODE_ID = "22"; 

const CONTRACT_FEE_AMOUNT = "200000"; 
const NETWORK_GAS_LIMIT = "1500000";

const BANNED_POOLS = ["paxi1ljerfy3awr6mrl9t30dkrpstdk9en2498cszzdjn7atprdvx4mms8d3j86","paxi1ts9xsdnllxrvgr6x6peal9ge2ff7zx4c0kw7j2levg6tscsn04jqkltcsa","paxi1awqjtrxp43903j52ev5kwr3tpncshh6sxrgwv40yjurjjzq9r4kqqtm5x9","paxi1a46mpgc2469g4vwt2uw5daftm9u56l9jg6gaw6vk0l2lx5637yyq4ujy3z","paxi1awetja6a9lgm6ul77x6zxurzqjpr9pfseexwr5zj4c5kclh9p3nq0jffe4"]; 

/* ================= STATE & PAGINATION ================= */
let WALLET = null;
let currentContract = null;
let currentStakeToken = null;
let currentRewardToken = null;
let currentStakeSymbol = "???";
let currentRewardSymbol = "???";

let uiMode = 'stake'; 
let rawWalletBalance = "0";
let rawStakedBalance = "0";
const tokenCache = {};

let isPoolFrozen = false;
let freezeReason = "";

let activeContracts = [];
let suspendedContracts = [];
let currentPoolTab = 'active'; 
let currentPage = 1;
const itemsPerPage = 6;

window.addEventListener('DOMContentLoaded', () => {
    updateLanguageUI();
    fetchPoolsFromCode();
});

/* ================= UTILS & ALERTS ================= */
const toRaw = v => {
    if (v === "" || isNaN(v)) return "0";
    try { return BigInt(Math.floor(Number(v) * 10 ** DECIMALS)).toString(); } catch (e) { return "0"; }
};
const fromRaw = v => (Number(v) / 10 ** DECIMALS).toLocaleString("en-US", {maximumFractionDigits: 3});
const shortAddr = addr => addr ? addr.slice(0, 8) + "..." + addr.slice(-4) : "-";

function formatDuration(sec) {
    if (!sec || isNaN(sec) || sec <= 0) return "No Lock";
    if (sec >= 86400) return (sec / 86400).toFixed(1) + " Days";
    if (sec >= 3600) return (sec / 3600).toFixed(1) + " Hours";
    if (sec >= 60) return (sec / 60).toFixed(1) + " Mins";
    return sec + " Secs";
}

function showAlert(type, title, msg) {
    const modal = document.getElementById('alert-modal');
    const icon = document.getElementById('alert-icon');
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-msg').innerText = msg;
    modal.classList.add('active');

    if (type === 'loading') {
        icon.innerHTML = '<div class="spinner" style="width:40px;height:40px;border-width:4px;"></div>';
    } else if (type === 'success') {
        icon.innerHTML = '<i class="bi bi-check-circle-fill" style="color:var(--success);"></i>';
    } else {
        icon.innerHTML = '<i class="bi bi-exclamation-triangle-fill" style="color:var(--danger);"></i>';
    }
}

function closeAlert() { document.getElementById('alert-modal').classList.remove('active'); }

function updatePoolURL(contractAddr) {
    const url = new URL(window.location);
    if (contractAddr) { url.searchParams.set('pool', contractAddr); } 
    else { url.searchParams.delete('pool'); }
    window.history.replaceState({}, '', url);
}

function goBackToPools() {
    document.getElementById('view-stake').classList.add('hidden');
    document.getElementById('view-pools').classList.remove('hidden');
    currentContract = null; 
    document.getElementById("amount").value = "";
    updatePoolURL(null); 
}

function switchTab(mode) {
    uiMode = mode;
    document.getElementById('tab-stake').classList.remove('active');
    document.getElementById('tab-unstake').classList.remove('active');
    document.getElementById(`tab-${mode}`).classList.add('active');

    document.getElementById('amount').value = "";

    if (mode === 'stake') {
        document.getElementById('input-label').innerText = translations[currentLang].inputLabelStake;
        document.getElementById('ui-active-balance').innerText = fromRaw(rawWalletBalance);
    } else {
        document.getElementById('input-label').innerText = translations[currentLang].inputLabelUnstake;
        document.getElementById('ui-active-balance').innerText = fromRaw(rawStakedBalance);
    }
    updateActionBtnText();
}

function updateActionBtnText() {
    const btn = document.getElementById('action-text');
    const mainBtn = document.getElementById('btn-core-action');

    if (!WALLET || !currentContract) {
        btn.innerText = translations[currentLang].enterAmt;
        mainBtn.disabled = false;
        mainBtn.style.opacity = "1";
        mainBtn.style.cursor = "pointer";
        return;
    }

    if (uiMode === 'stake' && isPoolFrozen) {
        btn.innerText = freezeReason || "Suspended (Deposits Disabled)";
        mainBtn.disabled = true;
        mainBtn.style.opacity = "0.5";
        mainBtn.style.cursor = "not-allowed";
    } else {
        mainBtn.disabled = false;
        mainBtn.style.opacity = "1";
        mainBtn.style.cursor = "pointer";
        if (uiMode === 'stake') btn.innerText = translations[currentLang].stakeBtn;
        else btn.innerText = translations[currentLang].unstakeBtn;
    }
}

function fillMax() {
    if (uiMode === 'stake') document.getElementById('amount').value = (Number(rawWalletBalance) / 10 ** DECIMALS).toString();
    else document.getElementById('amount').value = (Number(rawStakedBalance) / 10 ** DECIMALS).toString();
    updateActionBtnText();
}

document.getElementById('amount').addEventListener('input', function(e) {
    const val = e.target.value;
    const btn = document.getElementById('action-text');
    if (!val || Number(val) <= 0) { btn.innerText = translations[currentLang].enterAmt; } 
    else { updateActionBtnText(); }
});


/* ================= QUERY DENGAN SISTEM RETRY (ANTI RATE-LIMIT) ================= */
// Fungsi ini yang membuat reader tidak langsung gagal "UNK" jika server nge-lag
async function query(contract, msg, retries = 3) {
    const q = btoa(JSON.stringify(msg));
    for (let i = 0; i < retries; i++) {
        try {
            const r = await fetch(`${LCD}/cosmwasm/wasm/v1/contract/${contract}/smart/${q}`);
            if (!r.ok) {
                if (r.status === 429) { // 429: Too Many Requests
                    await new Promise(res => setTimeout(res, 1000 * (i + 1))); // Tunggu 1, 2, 3 detik lalu coba lagi
                    continue;
                }
                throw new Error(`HTTP ${r.status}`);
            }
            const data = await r.json();
            if (data.message) throw new Error(data.message);
            return data.data;
        } catch (e) {
            if (i === retries - 1) throw e; // Jika sudah dicoba 3 kali tetap gagal, lempar error
            await new Promise(res => setTimeout(res, 500 * (i + 1))); // Jeda sebelum retry
        }
    }
}


/* ================= POOL FETCHING & RENDERING ================= */
async function getTokenInfo(rawTokenAddr) {
    let tokenAddr = rawTokenAddr;
    if (typeof rawTokenAddr === 'object' && rawTokenAddr !== null) {
        if (rawTokenAddr.native) tokenAddr = rawTokenAddr.native;
        else if (rawTokenAddr.cw20) tokenAddr = rawTokenAddr.cw20;
        else if (rawTokenAddr.token) tokenAddr = rawTokenAddr.token.contract_addr || rawTokenAddr.token;
    }

    if (!tokenAddr || typeof tokenAddr !== 'string') {
        return { symbol: "???", logo: "https://placehold.co/40x40/18181b/FFF?text=?" };
    }

    if (tokenCache[tokenAddr]) return tokenCache[tokenAddr];

    if (!tokenAddr.startsWith("paxi1")) {
        let symbol = "UNK"; let textLogo = "?";
        if (tokenAddr === "upaxi") { symbol = "PAXI"; textLogo = "P"; } 
        else if (tokenAddr.startsWith("factory/")) {
            const parts = tokenAddr.split("/");
            symbol = parts[parts.length - 1].toUpperCase(); textLogo = symbol.charAt(0);
        } else if (tokenAddr.startsWith("ibc/")) {
            symbol = "IBC"; textLogo = "I";
        } else {
            symbol = tokenAddr.toUpperCase().substring(0, 5); textLogo = symbol.charAt(0);
        }
        tokenCache[tokenAddr] = { symbol: symbol, logo: `https://placehold.co/40x40/18181b/FFF?text=${textLogo}` };
        return tokenCache[tokenAddr];
    }

    try {
        const info = await query(tokenAddr, { token_info: {} });
        await new Promise(resolve => setTimeout(resolve, 200)); // JEDA AGAR LCD TIDAK OVERLOAD

        let logo = `https://placehold.co/40x40/18181b/FFF?text=${info.symbol.charAt(0).toUpperCase()}`;
        try {
            const mark = await query(tokenAddr, { marketing_info: {} });
            if (mark && mark.logo) {
                if (mark.logo.url) logo = mark.logo.url.startsWith("ipfs://") ? mark.logo.url.replace("ipfs://", "https://ipfs.io/ipfs/") : mark.logo.url;
                else if (mark.logo.embedded) {
                    if (mark.logo.embedded.svg) logo = "data:image/svg+xml;base64," + mark.logo.embedded.svg;
                    else if (mark.logo.embedded.png) logo = "data:image/png;base64," + mark.logo.embedded.png;
                }
            }
        } catch (e) {}
        
        let finalSymbol = info.symbol;
        if (!finalSymbol || finalSymbol.trim() === "") {
            finalSymbol = tokenAddr.substring(0, 5).toUpperCase();
        }

        tokenCache[tokenAddr] = { symbol: finalSymbol, logo: logo };
        return tokenCache[tokenAddr];
    } catch (e) {
        const fallbackSymbol = tokenAddr.substring(0, 5).toUpperCase();
        tokenCache[tokenAddr] = { symbol: fallbackSymbol, logo: `https://placehold.co/40x40/18181b/FFF?text=${fallbackSymbol.charAt(0)}` };
        return tokenCache[tokenAddr];
    }
}

async function fetchPoolsFromCode() {
    const container = document.getElementById("pools-grid");
    
    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 50px; color:var(--text-muted);">
            <div class="spinner" style="margin: 0 auto 15px auto; width:40px; height:40px;"></div>
            <div style="font-weight:bold; font-size:16px;">Scanning Blockchain Markets...</div>
            <div id="scan-progress" style="font-size:13px; margin-top:8px; color:var(--primary);">Loading data... Please wait.</div>
        </div>
    `;
    
    try {
        const res = await fetch(`${LCD}/cosmwasm/wasm/v1/code/${CODE_ID}/contracts?pagination.limit=1000`).then(r => r.json());
        const contracts = res.contracts || [];
        
        if (contracts.length === 0) {
            container.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding: 40px; color:var(--text-muted);">No active markets found.</div>`;
            return;
        }

        contracts.reverse();
        activeContracts = [];
        suspendedContracts = [];

        let scannedCount = 0;
        
        for (let contractAddr of contracts) {
            scannedCount++;
            try {
                const status = await query(contractAddr, { get_status: {} });
                
                const tvlNumRaw = Number(status.total_staked || "0");
                const apyNum = Number(status.current_apy || 0);
                const poolRewardSizeRaw = Number(status.reward_pool_size || "0");
                
                const needFor1YearRaw = tvlNumRaw * (apyNum / 100);
                const needFor6MonthsRaw = needFor1YearRaw / 2;
                const needFor10DaysRaw = (needFor1YearRaw / 365) * 10;

                const isManualFrozen = status.status === "Frozen" || BANNED_POOLS.includes(contractAddr);
                
                let badgeText = `<i class="bi bi-graph-up-arrow"></i> ${status.current_apy || 0}% APY`;
                let badgeStyle = `display: inline-flex; align-items: center; gap: 4px;`;
                let isSuspended = false;

                if (isManualFrozen) {
                    isSuspended = true; 
                    badgeText = `<i class="bi bi-snow"></i> FROZEN`; 
                    badgeStyle = `background:var(--danger); color:#fff; border-color:var(--danger); display:inline-flex; align-items:center; gap:4px;`;
                } else if (poolRewardSizeRaw === 0 && tvlNumRaw > 0) {
                    isSuspended = true; 
                    badgeText = `<i class="bi bi-slash-circle"></i> EMPTY`; 
                    badgeStyle = `background:var(--danger); color:#fff; border-color:var(--danger); display:inline-flex; align-items:center; gap:4px;`;
                } else if (poolRewardSizeRaw > 0 && poolRewardSizeRaw < needFor10DaysRaw) {
                    isSuspended = true; 
                    badgeText = `<i class="bi bi-shield-exclamation"></i> ${status.current_apy}% APY`; 
                    badgeStyle = `background:rgba(239, 68, 68, 0.15); color:var(--danger); border-color:var(--danger); display:inline-flex; align-items:center; gap:4px;`;
                } else if (poolRewardSizeRaw < needFor6MonthsRaw) {
                    isSuspended = true; 
                    badgeText = `<i class="bi bi-exclamation-triangle"></i> ${status.current_apy}% APY`; 
                    badgeStyle = `background:#27272a; color:#a1a1aa; border-color:#3f3f46; display:inline-flex; align-items:center; gap:4px;`;
                }

                const itemData = {
                    addr: contractAddr,
                    status: status,
                    badgeText: badgeText,
                    badgeStyle: badgeStyle
                };

                if (isSuspended) suspendedContracts.push(itemData);
                else activeContracts.push(itemData);

                const progEl = document.getElementById("scan-progress");
                if (progEl) progEl.innerText = `Scanning ${scannedCount}/${contracts.length} pools... Found ${activeContracts.length} Active.`;

            } catch (e) { console.warn("Skip:", contractAddr); }
            
            // JEDA 150ms di setiap pool agar API tidak meledak rate-limitnya
            await new Promise(resolve => setTimeout(resolve, 150)); 
        }

        renderPoolsTabUI();

        const urlParams = new URLSearchParams(window.location.search);
        const urlPoolContract = urlParams.get('pool');

        if (urlPoolContract) {
            const allPools = [...activeContracts, ...suspendedContracts];
            const targetPool = allPools.find(p => p.addr === urlPoolContract);

            if (targetPool) {
                try {
                    const sInfo = await getTokenInfo(targetPool.status.staking_token);
                    const rInfo = await getTokenInfo(targetPool.status.reward_token);
                    selectPool(targetPool.addr, targetPool.status.staking_token, targetPool.status.reward_token, sInfo, rInfo);
                } catch (err) {}
            } else { updatePoolURL(null); }
        }

    } catch (e) {
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding: 40px; color:var(--danger);">Error loading pools from network.</div>`;
    }
}

function renderPoolsTabUI() {
    let oldTabs = document.getElementById("market-tabs-container");
    if (!oldTabs) {
        const grid = document.getElementById("pools-grid");
        oldTabs = document.createElement("div");
        oldTabs.id = "market-tabs-container";
        grid.parentNode.insertBefore(oldTabs, grid);
    }

    const activeBg = currentPoolTab === 'active' ? 'var(--primary)' : 'transparent';
    const activeColor = currentPoolTab === 'active' ? '#fff' : 'var(--text-muted)';
    const suspBg = currentPoolTab === 'suspended' ? 'var(--danger)' : 'transparent';
    const suspColor = currentPoolTab === 'suspended' ? '#fff' : 'var(--text-muted)';

    oldTabs.innerHTML = `
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <button onclick="switchMarketTab('active')" style="flex: 1; display:flex; justify-content:center; align-items:center; gap:8px; padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: ${activeBg}; color: ${activeColor}; cursor: pointer; font-weight: bold; transition: 0.2s;">
                <i class="bi bi-activity" style="font-size:16px;"></i> Active Markets (${activeContracts.length})
            </button>
            <button onclick="switchMarketTab('suspended')" style="flex: 1; display:flex; justify-content:center; align-items:center; gap:8px; padding: 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: ${suspBg}; color: ${suspColor}; cursor: pointer; font-weight: bold; transition: 0.2s;">
                <i class="bi bi-pause-circle" style="font-size:16px;"></i> Suspended (${suspendedContracts.length})
            </button>
        </div>
    `;
    
    renderPage(1); 
}

function switchMarketTab(tab) {
    currentPoolTab = tab;
    renderPoolsTabUI(); 
}

async function renderPage(page) {
    currentPage = page;
    const container = document.getElementById("pools-grid");
    
    // Tampilkan kerangka list tanpa menghapus UI langsung
    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 40px; color:var(--text-muted);">
            <div class="spinner" style="margin: 0 auto 10px auto;"></div>Rendering Markets...
        </div>`;

    const targetArray = currentPoolTab === 'active' ? activeContracts : suspendedContracts;
    
    const startIdx = (page - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const pageItems = targetArray.slice(startIdx, endIdx);

    if (pageItems.length === 0) {
        container.innerHTML = `<div style="grid-column: 1 / -1; text-align:center; padding: 40px; color:var(--text-muted);">No markets found in this category.</div>`;
        return;
    }

    container.innerHTML = ''; 

    for (let item of pageItems) {
        const contractAddr = item.addr;
        const status = item.status;
        
        try {
            // MENGAMBIL TOKEN INFO SECARA BERURUTAN DENGAN DELAY
            const sInfo = await getTokenInfo(status.staking_token);
            const rInfo = await getTokenInfo(status.reward_token);
            const tvl = fromRaw(status.total_staked || 0);

            const card = document.createElement('div');
            card.className = 'pool-card-item';
            card.onclick = () => selectPool(contractAddr, status.staking_token, status.reward_token, sInfo, rInfo);

            let badgeHtml = `<div class="pci-apy-badge" style="${item.badgeStyle}">${item.badgeText}</div>`;
            if (currentPoolTab === 'suspended' && item.badgeText.includes("APY")) {
                badgeHtml = `<div class="pci-apy-badge" style="${item.badgeStyle}" title="Suspended Risk Pool"><i class="bi bi-exclamation-triangle"></i> SUSPENDED</div>`;
            }

            card.innerHTML = `
                <div class="pci-top">
                    <div class="pci-icons">
                        <img src="${sInfo.logo}" onerror="this.src='https://placehold.co/40x40/18181b/FFF?text=?'">
                        <img src="${rInfo.logo}" onerror="this.src='https://placehold.co/40x40/18181b/FFF?text=?'">
                    </div>
                    ${badgeHtml}
                </div>
                <div style="margin-bottom: 16px;">
                    <div class="pci-title">Stake ${sInfo.symbol}</div>
                    <div class="pci-sub">Earn ${rInfo.symbol} • ${shortAddr(contractAddr)}</div>
                </div>
                <div class="pci-stats">
                    <div class="pci-stat-col">
                        <span class="pci-stat-lbl">Total Value Locked</span>
                        <span class="pci-stat-val">${tvl} ${sInfo.symbol}</span>
                    </div>
                    <div class="pci-stat-col" style="text-align: right;">
                        <span class="pci-stat-lbl">Lock Term</span>
                        <span class="pci-stat-val">${formatDuration(status.lock_duration)}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);

            // JEDA 300ms SEBELUM MERENDER KARTU SELANJUTNYA AGAR API AMAN
            await new Promise(resolve => setTimeout(resolve, 300));
            
        } catch (e) {}
    }

    renderPaginationControls(targetArray.length);
}

function renderPaginationControls(totalItems) {
    let oldControls = document.getElementById("pagination-controls");
    if (oldControls) oldControls.remove();

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return; 

    const controls = document.createElement("div");
    controls.id = "pagination-controls";
    controls.style = "display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 30px; grid-column: 1 / -1;";

    const btnPrev = document.createElement("button");
    btnPrev.className = "btn-main";
    btnPrev.style = "width: auto; padding: 8px 16px; background: var(--bg-card); border: 1px solid var(--border-subtle); color: #fff; cursor: pointer;";
    btnPrev.innerHTML = `<i class="bi bi-chevron-left"></i> Prev`;
    btnPrev.disabled = currentPage === 1;
    if (currentPage === 1) btnPrev.style.opacity = "0.5";
    btnPrev.onclick = () => renderPage(currentPage - 1);

    const pageInfo = document.createElement("span");
    pageInfo.style = "color: var(--text-muted); font-size: 14px; font-weight: 600;";
    pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;

    const btnNext = document.createElement("button");
    btnNext.className = "btn-main";
    btnNext.style = "width: auto; padding: 8px 16px; background: var(--bg-card); border: 1px solid var(--border-subtle); color: #fff; cursor: pointer;";
    btnNext.innerHTML = `Next <i class="bi bi-chevron-right"></i>`;
    btnNext.disabled = currentPage === totalPages;
    if (currentPage === totalPages) btnNext.style.opacity = "0.5";
    btnNext.onclick = () => renderPage(currentPage + 1);

    controls.appendChild(btnPrev);
    controls.appendChild(pageInfo);
    controls.appendChild(btnNext);
    
    document.getElementById("pools-grid").appendChild(controls);
}

/* ================= OPEN POOL & REFRESH ================= */
function selectPool(contract, sToken, rToken, sInfo, rInfo) {
    currentContract = contract;
    currentStakeToken = sToken;
    currentRewardToken = rToken;
    currentStakeSymbol = sInfo.symbol;
    currentRewardSymbol = rInfo.symbol;

    updatePoolURL(contract);

    document.getElementById("view-pools").classList.add("hidden");
    document.getElementById("view-stake").classList.remove("hidden");

    document.getElementById("pm-contract-short").innerText = shortAddr(contract);
    document.getElementById("pm-stake-symbol").innerText = sInfo.symbol;
    document.getElementById("pm-stake-logo").src = sInfo.logo;
    document.getElementById("pm-reward-symbol").innerText = rInfo.symbol;
    document.getElementById("pm-reward-logo").src = rInfo.logo;

    document.getElementById("input-token-symbol").innerText = sInfo.symbol;
    document.getElementById("input-token-logo").src = sInfo.logo;
    document.getElementById("rw-symbol").innerText = rInfo.symbol;

    refresh(); 
}

/* ================= CONNECT ================= */
async function connect() {
    if (!window.paxihub?.paxi) {
        if (/Android|iPhone/i.test(navigator.userAgent)) return window.location.href = `paxi://hub/explorer?url=${encodeURIComponent(window.location.href)}`;
        return showAlert('error', 'Wallet Error', 'Install PaxiHub Extension');
    }
    try {
        const acc = await window.paxihub.paxi.getAddress();
        WALLET = acc.address;
        document.getElementById("wallet-text").innerText = WALLET.slice(0, 6) + "..." + WALLET.slice(-4);
        if (currentContract) await refresh();
        updateActionBtnText();
    } catch (e) {
        showAlert('error', 'Connection Failed', e.message);
    }
}

async function refresh() {
    if (!currentContract) return;
    try {
        const statusData = await query(currentContract, { get_status: {} }).catch(() => null);
        const configData = await query(currentContract, { config: {} }).catch(() => null);

        if (configData && configData.admin === WALLET) {
            document.getElementById("admin-panel").classList.remove("hidden");
            document.getElementById('adm-is-dynamic').checked = configData.is_dynamic_apy;
            toggleApyMode();
            if (configData.is_dynamic_apy) {
                document.getElementById('adm-max-apy').value = configData.apy_max;
                document.getElementById('adm-min-apy').value = configData.apy_min;
                document.getElementById('adm-scale').value = Number(configData.apy_scale_valuation) / 10 ** DECIMALS;
            } else {
                document.getElementById('adm-fixed-apy').value = configData.apy_max;
            }
            document.getElementById('adm-is-eligibility').checked = configData.eligibility_check;
            if (configData.required_lp_token) document.getElementById('adm-lp-token').value = configData.required_lp_token;
            document.getElementById('adm-lp-min').value = Number(configData.min_lp_amount) / 10 ** DECIMALS;
        } else {
            document.getElementById("admin-panel").classList.add("hidden");
        }

        if (statusData) {
            document.getElementById("p-apy").innerText = (statusData.current_apy || 0) + "%";
            document.getElementById("p-total").innerText = fromRaw(statusData.total_staked || 0);
            document.getElementById("p-lock").innerText = formatDuration(statusData.lock_duration);
            
            const tvlNumRaw = Number(statusData.total_staked || "0");
            const apyNum = Number(statusData.current_apy || 0);
            const poolRewardSizeRaw = Number(statusData.reward_pool_size || "0");
            
            const needFor1YearRaw = tvlNumRaw * (apyNum / 100);
            const needFor6MonthsRaw = needFor1YearRaw / 2;
            const needFor10DaysRaw = (needFor1YearRaw / 365) * 10;

            isPoolFrozen = false;
            freezeReason = "";

            if (statusData.status === "Frozen" || BANNED_POOLS.includes(currentContract)) {
                isPoolFrozen = true; freezeReason = "Suspended by Admin (Deposits Disabled)";
            } else if (poolRewardSizeRaw === 0 && tvlNumRaw > 0) {
                isPoolFrozen = true; freezeReason = "Suspended: Pool Empty (Deposits Disabled)";
            } else if (poolRewardSizeRaw > 0 && poolRewardSizeRaw < needFor10DaysRaw) {
                isPoolFrozen = true; freezeReason = "Suspended: Reward < 10 Days (Deposits Disabled)";
            } else if (poolRewardSizeRaw < needFor6MonthsRaw) {
                isPoolFrozen = true; freezeReason = "Suspended: Reward < 6 Months (Deposits Disabled)";
            }
        }

        if (!WALLET) return;

        const bal = await query(currentStakeToken, { balance: { address: WALLET } }).catch(() => ({ balance: "0" }));
        rawWalletBalance = bal.balance;

        try {
            const u = await query(currentContract, { staker: { address: WALLET } });
            rawStakedBalance = u.amount;
            document.getElementById("u-reward").innerHTML = `${fromRaw(u.pending_reward)} <span style="font-size:14px; color:var(--text-muted);">${currentRewardSymbol}</span>`;
        } catch {
            rawStakedBalance = "0";
            document.getElementById("u-reward").innerHTML = `0.00 <span style="font-size:14px; color:var(--text-muted);">${currentRewardSymbol}</span>`;
        }

        switchTab(uiMode);
        fetchHolders();

    } catch (e) { console.error(e); }
}

async function fetchHolders() {
    try {
        const data = await query(currentContract, { list_stakers: { limit: 100 } });
        const container = document.getElementById("holder-list-container");
        container.innerHTML = "";
        
        let stakersArray = data.stakers || (Array.isArray(data) ? data : []);
        if (!stakersArray || stakersArray.length === 0) {
            container.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:20px;">No data</div>`;
            return;
        }

        const normalizedStakers = stakersArray.map(item => {
            const addr = item.address || "Unknown";
            let amtRaw = "0";
            if (item.info && item.info.amount) amtRaw = item.info.amount;
            else if (item.amount) amtRaw = item.amount;
            else if (item.balance) amtRaw = item.balance;
            return { address: addr, amount: amtRaw };
        });

        const sorted = normalizedStakers.sort((a, b) => Number(b.amount) - Number(a.amount));
        const top10 = sorted.slice(0, 10);

        top10.forEach((item, index) => {
            const isMe = item.address === WALLET ? 'color:var(--primary); font-weight:700;' : 'color:var(--text-muted);';
            container.innerHTML += `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-subtle); font-size: 13px;">
                <span style="${isMe}">${index + 1}. ${shortAddr(item.address)}</span>
                <span style="color:#fff; font-weight:600;">${fromRaw(item.amount)} <span style="font-size:11px; color:var(--text-muted);">${currentStakeSymbol}</span></span>
            </div>`;
        });
    } catch (e) {
        const container = document.getElementById("holder-list-container");
        container.innerHTML = `<div style="text-align:center; color:var(--danger); padding:20px;">Failed to load data</div>`;
    }
}

/* ================= EXECUTION ================= */
async function pollTx(txHash) {
    let attempts = 0;
    const interval = setInterval(async () => {
        attempts++;
        try {
            const res = await fetch(`${LCD}/cosmos/tx/v1beta1/txs/${txHash}`).then(r => r.json());
            if (res.tx_response) {
                clearInterval(interval);
                if (res.tx_response.code === 0) {
                    showAlert('success', 'Confirmed', 'Transaction successful.');
                    document.getElementById("amount").value = "";
                    updateActionBtnText();
                    setTimeout(refresh, 2000);
                } else {
                    showAlert('error', 'Reverted', res.tx_response.raw_log);
                }
            }
        } catch (e) {}
        if (attempts >= 15) {
            clearInterval(interval);
            showAlert('error', 'Timeout', 'Check explorer.');
        }
    }, 3000);
}

async function executeBatch(msgs) {
    if (!WALLET) return showAlert('error', 'Error', 'Please connect wallet.');
    if (!currentContract) return showAlert('error', 'Error', 'Please select a market.');

    showAlert('loading', 'Waiting for signature...', 'Please approve in your wallet.');

    try {
        const msgsProto = msgs.map(m => {
            return PaxiCosmJS.Any.fromPartial({
                typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                value: PaxiCosmJS.MsgExecuteContract.encode(PaxiCosmJS.MsgExecuteContract.fromPartial({
                    sender: WALLET,
                    contract: m.contract,
                    msg: new TextEncoder().encode(JSON.stringify(m.msg)),
                    funds: m.funds || []
                })).finish()
            })
        });

        const accData = await fetch(`${LCD}/cosmos/auth/v1beta1/accounts/${WALLET}`).then(r => r.json());
        const acc = accData.account?.base_account || accData.account || accData;

        let pkBytes;
        const pubKeyRaw = acc.pub_key || acc.pubKey;
        if (pubKeyRaw?.key) pkBytes = Uint8Array.from(atob(pubKeyRaw.key), c => c.charCodeAt(0));
        else {
            const s = await window.paxihub.paxi.getAddress();
            pkBytes = typeof s.public_key === 'string' ? Uint8Array.from(atob(s.public_key), c => c.charCodeAt(0)) : new Uint8Array(s.public_key);
        }

        const fee = { amount: [{ denom: DENOM, amount: "75000" }], gasLimit: NETWORK_GAS_LIMIT };
        const txBody = PaxiCosmJS.TxBody.fromPartial({ messages: msgsProto, memo: "Paxi Earn Web" });
        const authInfo = PaxiCosmJS.AuthInfo.fromPartial({
            signerInfos: [{ publicKey: { typeUrl: "/cosmos.crypto.secp256k1.PubKey", value: PaxiCosmJS.PubKey.encode({ key: pkBytes }).finish() }, modeInfo: { single: { mode: 1 } }, sequence: BigInt(acc.sequence || 0) }],
            fee
        });

        const signDoc = PaxiCosmJS.SignDoc.fromPartial({
            bodyBytes: PaxiCosmJS.TxBody.encode(txBody).finish(),
            authInfoBytes: PaxiCosmJS.AuthInfo.encode(authInfo).finish(),
            chainId: CHAIN_ID,
            accountNumber: BigInt(acc.account_number || acc.accountNumber || 0)
        });

        const signed = await window.paxihub.paxi.signAndSendTransaction({
            bodyBytes: btoa(String.fromCharCode(...signDoc.bodyBytes)),
            authInfoBytes: btoa(String.fromCharCode(...signDoc.authInfoBytes)),
            chainId: CHAIN_ID,
            accountNumber: String(acc.account_number || acc.accountNumber || 0)
        });

        let bBody = JSON.stringify({
            tx_bytes: signed.tx_bytes || btoa(String.fromCharCode(...PaxiCosmJS.TxRaw.encode({
                bodyBytes: signDoc.bodyBytes,
                authInfoBytes: signDoc.authInfoBytes,
                signatures: [Uint8Array.from(atob(signed.signature || signed.success || signed.signed?.signatures?.[0]), c => c.charCodeAt(0))]
            }).finish())),
            mode: "BROADCAST_MODE_SYNC"
        });

        const res = await fetch(`${LCD}/cosmos/tx/v1beta1/txs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: bBody }).then(r => r.json());

        if (res.tx_response?.code === 0) {
            document.getElementById('alert-msg').innerText = "Waiting for network confirmation...";
            pollTx(res.tx_response.txhash);
        } else throw new Error(res.tx_response?.raw_log || "Broadcast Failed");

    } catch (e) {
        showAlert('error', 'Error', e.message);
    }
}

const CONTRACT_EXECUTION_FEE = [{ denom: DENOM, amount: CONTRACT_FEE_AMOUNT }];

function executeCoreAction() {
    const amt = document.getElementById("amount").value;
    if (!amt || Number(amt) <= 0) return;

    if (uiMode === 'stake') {
        if (isPoolFrozen) {
            return showAlert('error', 'Deposit Disabled', freezeReason || 'Pool is currently suspended. Cannot deposit at this time.');
        }
        executeBatch([
            { contract: currentStakeToken, msg: { increase_allowance: { spender: currentContract, amount: toRaw(amt) } }, funds: [] },
            { contract: currentContract, msg: { stake: { amount: toRaw(amt) } }, funds: CONTRACT_EXECUTION_FEE }
        ]);
    } else {
        executeBatch([{ contract: currentContract, msg: { unstake: { amount: toRaw(amt) } }, funds: CONTRACT_EXECUTION_FEE }]);
    }
}

function claim() { executeBatch([{ contract: currentContract, msg: { claim: {} }, funds: CONTRACT_EXECUTION_FEE }]); }
function adminExec(msg) { executeBatch([{ contract: currentContract, msg: msg, funds: [] }]); }
function adminFreeze() { adminExec({ freeze: {} }); }
function adminUnfreeze() { adminExec({ unfreeze: {} }); }

function toggleApyMode() {
    const isDyn = document.getElementById('adm-is-dynamic').checked;
    if (isDyn) {
        document.getElementById('fixed-apy-group').style.display = 'none';
        document.getElementById('dynamic-apy-group').style.display = 'grid';
    } else {
        document.getElementById('fixed-apy-group').style.display = 'flex';
        document.getElementById('dynamic-apy-group').style.display = 'none';
    }
}

function adminSetLock() {
    const dur = document.getElementById("adm-lock").value;
    if (!dur) return showAlert('error', 'Error', 'Empty duration');
    adminExec({ set_lock: { duration: parseInt(dur) } });
}

function adminSetApy() {
    const isDyn = document.getElementById('adm-is-dynamic').checked;
    if (isDyn) {
        const max = document.getElementById("adm-max-apy").value;
        const min = document.getElementById("adm-min-apy").value;
        const scale = document.getElementById("adm-scale").value;
        if (!max || !min || !scale) return showAlert('error', 'Error', 'Fill all dynamic fields');
        adminExec({ set_apy: { dynamic: true, max_apy: parseInt(max), min_apy: parseInt(min), scale_valuation: toRaw(scale) } });
    } else {
        const fixed = document.getElementById("adm-fixed-apy").value;
        if (!fixed) return showAlert('error', 'Error', 'Enter Fixed APY');
        adminExec({ set_apy: { dynamic: false, max_apy: parseInt(fixed), min_apy: 0, scale_valuation: "0" } });
    }
}

function adminSetEligibility() {
    const enabled = document.getElementById('adm-is-eligibility').checked;
    const lpToken = document.getElementById('adm-lp-token').value.trim();
    const minAmt = document.getElementById('adm-lp-min').value;
    if (enabled && (!lpToken || !minAmt)) return showAlert('error', 'Error', 'LP Token and Min Amount are required.');
    adminExec({ set_eligibility: { enabled: enabled, lp_token: enabled ? lpToken : null, min_amount: enabled ? toRaw(minAmt) : "0" } });
}

function adminRefill() {
    const amt = document.getElementById("adm-refill").value;
    if (!amt) return;
    executeBatch([{ contract: currentRewardToken, msg: { transfer: { recipient: currentContract, amount: toRaw(amt) } }, funds: [] }]);
}