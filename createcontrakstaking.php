<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>ORION Create Staking</title>
<script src="https://mainnet-api.paxinet.io/resources/js/paxi-cosmjs.umd.js"></script>
<link rel="stylesheet" href="css/ctrk.css?v=<?php echo time(); ?>">
   <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet"
 <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>
    
    

<div id="modal" class="modal-overlay">
  <div class="popup" style="max-width:340px;">
    <div id="popup-icon"></div>
    <h3 id="popup-title" style="margin: 10px 0;">Title</h3>
    <p id="popup-msg" style="color:var(--muted); font-size:13px; margin-bottom:20px; line-height:1.5;">Message...</p>
    <button class="btn-close" onclick="document.getElementById('modal').classList.remove('active')" data-i18n="close">Close</button>
  </div>
</div>

<div id="token-modal" class="modal-overlay">
    <div class="popup" style="display:flex; flex-direction:column;">
        <h3 data-i18n="selectToken" style="margin:0 0 15px 0; text-align:left; display:flex; align-items:center; gap:8px; color:white;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:20px; height:20px; color:var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            Select Token
        </h3>
        <input type="text" id="token-search-input" placeholder="Search symbol or paste address..." data-i18n="searchPlaceholder">
        <div id="token-list-container">
            <div class="spinner"></div>
        </div>
        <button class="btn-close" onclick="closeTokenModal()" data-i18n="cancel">Cancel</button>
    </div>
</div>

<div class="container">
  
  <div class="nav-header">
    <div class="brand">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width:36px; height:36px; color:var(--primary);"><path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clip-rule="evenodd" /></svg>
      <span data-i18n="mainTitle">ORION Create Stake</span>
    </div>
    <div class="nav-actions">
        <button class="btn-small" onclick="toggleLang()" id="lang-toggle">EN</button>
        <button id="btn-connect" class="btn-connect" onclick="connect()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px; height:18px;"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>
            <span id="wallet-text" data-i18n="connectWallet">Connect Wallet</span>
        </button>
    </div>
  </div>

  <div class="card">
    <div class="card-header" style="border-bottom:none; margin-bottom:0; padding-bottom:0; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:12px;">
            <div class="card-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:20px; height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg></div>
            <h3 data-i18n="networkConfig" style="margin:0;">Network</h3>
        </div>
        <div style="display:flex; gap:10px; flex:1; max-width:320px;">
            <select id="chain-select" onchange="updateChainId()" style="padding:10px; font-size:13px; font-weight:500;">
              <option value="paxi-mainnet">paxi-mainnet</option>
              <option value="custom" data-i18n="manual">Custom ID...</option>
            </select>
            <input id="chain-id-input" class="hidden" placeholder="Chain ID" data-i18n="enterChainId" style="padding:10px; font-size:13px;">
            <input id="rpc-url" value="https://mainnet-rpc.paxinet.io" class="hidden">
        </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
        <div class="card-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:20px; height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg></div>
        <h3 data-i18n="tokenInfo">Token Configuration</h3>
    </div>
    
    <div class="form-group">
      <label class="label" data-i18n="contractLabel">Contract Label</label>
      <input id="contract-label" placeholder="Ex: Paxi Staking Pool V1" data-i18n="labelPlaceholder">
    </div>
    <div class="grid-2">
      <div class="form-group">
        <label class="label" data-i18n="stakingToken">Deposit Token (PRC20)</label>
        <div class="input-with-btn">
            <input id="staking-token" placeholder="paxi1..." data-i18n="addrPlaceholder">
            <button class="btn-icon" onclick="openTokenModal('staking')" title="Search Token">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px; height:18px;"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            </button>
        </div>
      </div>
      <div class="form-group">
        <label class="label" data-i18n="rewardToken">Reward Token (PRC20)</label>
        <div class="input-with-btn">
            <input id="reward-token" placeholder="paxi1..." data-i18n="addrPlaceholder">
             <button class="btn-icon" onclick="openTokenModal('reward')" title="Search Token">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px; height:18px;"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            </button>
        </div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
        <div class="card-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:20px; height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014-8.81c-2.28 1.053-4.873 1.764-7.616 1.967m0 0A23.924 23.924 0 0012 12m0 0c0 1.584.15 3.128.435 4.618m0-9.236c.285 1.49.435 3.034.435 4.618" /></svg></div>
        <h3 data-i18n="stakingRules">Staking Parameters</h3>
    </div>

    <div class="grid-2">
        <div class="form-group">
          <label class="label" data-i18n="lockType">Lock Requirement</label>
          <div class="radio-group">
            <label style="flex:1;">
              <input type="radio" name="lockType" value="flexible" onchange="toggleLock()" checked>
              <div class="radio-label"><span data-i18n="flexible">Flexible</span></div>
            </label>
            <label style="flex:1;">
              <input type="radio" name="lockType" value="custom" onchange="toggleLock()">
              <div class="radio-label"><span data-i18n="customDuration">Locked</span></div>
            </label>
          </div>
          <div id="block-lock-input" class="hidden" style="margin-top:10px;">
            <input type="number" id="lock-duration" placeholder="Duration in seconds (ex: 86400)" data-i18n="durationPlaceholder">
          </div>
        </div>

        <div class="form-group">
          <label class="label" data-i18n="fixedApy">Fixed APY Rate (%)</label>
          <input type="number" id="fixed-apy" value="100" placeholder="Ex: 100">
          <span class="sub-label" data-i18n="apyDesc">Can be converted to dynamic later.</span>
        </div>
    </div>

    <div class="form-group" style="margin-top:8px;">
      <label class="label" data-i18n="adminAddr">Contract Administrator</label>
      <input id="admin-address" placeholder="Owner Wallet Address" data-i18n="adminPlaceholder">
    </div>

    <div class="advanced-note">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:20px; height:20px; flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
      <span data-i18n="advancedNote">Note: Dynamic APY and LP Eligibility checks are disabled by default. You can enable them via the Admin Panel in the Staking Dashboard after deployment.</span>
    </div>

    <div class="orion-fee">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:24px; height:24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span data-i18n="orionFee">Creation Fee: 200,000 ORION</span>
    </div>

    <div class="fee-info">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:20px; height:20px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>
      <div><strong data-i18n="highGasMode">HIGH GAS MODE:</strong> <span data-i18n="feeDesc">5.5 PAXI Miner Fee</span></div>
    </div>

    <button class="btn-deploy" onclick="deployContract()">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:22px; height:22px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.438 4.438 0 002.946-2.946 4.493 4.493 0 004.306-1.758q.262.153.538.283m-8.018-1.292c.11.11.22.217.332.324" /></svg>
        <span data-i18n="deployBtn">Deploy </span>
    </button>
  </div>

  <div class="terminal-wrapper">
    <div class="terminal-header">
        <div class="terminal-dot r"></div><div class="terminal-dot y"></div><div class="terminal-dot g"></div>
        <span style="margin-left:8px;" data-i18n="logs">Terminal Output</span>
    </div>
    <pre id="log">System initialized. Awaiting user input...</pre>
  </div>

</div>
<script src="js/ctrk.js?v=<?php echo time(); ?>"></script>
</body>
</html>