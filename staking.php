<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1, user-scalable=0" />
<title>ORION STAKING - DeFi Protocol</title>
<script src="https://mainnet-api.paxinet.io/resources/js/paxi-cosmjs.umd.js"></script>
<link rel="stylesheet" href="css/staking.css?v=<?php echo time(); ?>">
<link rel="stylesheet" href="css/navbar-app.css?v=<?php echo time(); ?>">
<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</head>
<body>
    <?php include 'navbar.php'; ?>

<div id="alert-modal" class="modal-overlay">
  <div class="popup" style="max-width:320px;">
    <div id="alert-icon" style="font-size:48px; margin-bottom:16px;"></div>
    <h3 id="alert-title">Title</h3>
    <p id="alert-msg">Message goes here</p>
    <button class="btn-main btn-primary" onclick="closeAlert()" style="margin:0; width:100%;">Close</button>
  </div>
</div>

<div class="main-wrapper">
    
  <div class="nav-header">
    <div class="brand">
      <i class="bi bi-piggy-bank" style="font-size: 24px; color: var(--primary);"></i>
      <span data-i18n="appTitle">ORION STAKING</span>
    </div>
    <div class="nav-actions">
        <button class="btn-small" onclick="toggleLang()" id="lang-toggle">EN</button>
        <button class="btn-small btn-connect" onclick="connect()" id="btn-connect">
            <i class="bi bi-wallet2"></i> <span id="wallet-text" data-i18n="connectWallet">Connect Wallet</span>
        </button>
    </div>
  </div>

  <div id="view-pools" class="view-section">
      <div class="pools-header-text">
          <h2>Active Markets</h2>
          <p>Select a pool to start earning rewards.</p>
      </div>
      
      <div id="pools-grid" class="pools-grid">
          <div style="text-align:center; grid-column: 1 / -1; padding: 40px; color: var(--text-muted);">
              <div class="spinner" style="margin: 0 auto 10px auto;"></div>
              Loading pools from blockchain...
          </div>
      </div>
  </div>

  <div id="view-stake" class="view-section hidden">
      
      <button class="btn-back" onclick="goBackToPools()">
          <i class="bi bi-arrow-left"></i> Back to Markets
      </button>

      <div class="widget-card">
        
        <div class="pool-banner-static">
            <div class="pool-info-left">
                <div class="pool-icons">
                    <img id="pm-stake-logo" src="https://placehold.co/40x40/18181b/FFF?text=?">
                    <img id="pm-reward-logo" src="https://placehold.co/40x40/18181b/FFF?text=?">
                </div>
                <div>
                    <div class="pool-text-main"><span id="pm-stake-symbol">...</span> <i class="bi bi-arrow-right-short" style="color:var(--text-muted);"></i> <span id="pm-reward-symbol">...</span></div>
                    <div class="pool-text-sub" id="pm-contract-short">...</div>
                </div>
            </div>
        </div>

        <div class="metrics-row">
            <div class="metric-item">
                <div class="metric-label" data-i18n="apyLabel">APY</div>
                <div class="metric-value" style="color:var(--success);" id="p-apy">0%</div>
            </div>
            <div class="metric-item">
                <div class="metric-label" data-i18n="tvlLabel">TVL</div>
                <div class="metric-value" id="p-total">0</div>
            </div>
            <div class="metric-item">
                <div class="metric-label" data-i18n="lockLabel">Lock Term</div>
                <div class="metric-value" id="p-lock">0s</div>
            </div>
        </div>

        <div class="tabs">
            <button class="tab-btn active" id="tab-stake" onclick="switchTab('stake')" data-i18n="tabStake">Deposit</button>
            <button class="tab-btn" id="tab-unstake" onclick="switchTab('unstake')" data-i18n="tabUnstake">Withdraw</button>
        </div>

        <div class="input-area">
            <div class="input-header">
                <span id="input-label" data-i18n="inputLabelStake">Amount to stake</span>
                <span><span data-i18n="balance">Balance:</span> <span id="ui-active-balance" class="clickable-balance" onclick="fillMax()">0.00</span></span>
            </div>
            <div class="input-row">
                <input type="number" id="amount" placeholder="0.00">
                <div class="token-badge">
                    <img id="input-token-logo" src="https://placehold.co/20x20/18181b/FFF?text=?">
                    <span id="input-token-symbol">---</span>
                </div>
            </div>
        </div>

        <button class="btn-main btn-primary" id="btn-core-action" onclick="executeCoreAction()">
            <span id="action-text" data-i18n="stakeBtn">Enter Amount</span>
        </button>
      </div>

      <div class="reward-card">
          <div class="reward-info">
              <div class="label" data-i18n="pendingReward">Pending Earned</div>
              <div class="value" id="u-reward">0.00 <span id="rw-symbol"></span></div>
          </div>
          <button class="btn-claim" onclick="claim()" data-i18n="claimBtn">Claim</button>
      </div>

      <div class="info-card">
          <div class="info-header">
              <i class="bi bi-trophy"></i>
              <span data-i18n="holdersTitle">Top Stakers</span>
              <button class="btn-small-refresh" onclick="refresh()"><i class="bi bi-arrow-clockwise"></i></button>
          </div>
          <div class="holder-list" id="holder-list-container">
              <div style="text-align:center; color:var(--text-muted); padding:20px; font-size:13px;" data-i18n="loading">Loading data...</div>
          </div>
      </div>

      <div id="admin-panel" class="info-card admin-zone hidden">
          <div class="admin-tag">ADMIN CONFIG</div>
          
          <div class="admin-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--border-subtle);">
              <button class="btn-small-admin" onclick="adminFreeze()">❄️ Freeze</button>
              <button class="btn-small-admin" onclick="adminUnfreeze()">🔥 Unfreeze</button>
          </div>
          
          <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--border-subtle);">
              <div class="admin-label">Refill Reward Pool</div>
              <div style="display:flex; gap:8px;">
                  <input type="number" id="adm-refill" class="admin-input" placeholder="Amount">
                  <button class="btn-small-admin" onclick="adminRefill()">Send</button>
              </div>
          </div>

          <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--border-subtle);">
              <div class="admin-label">Set Lock Duration</div>
              <div style="display:flex; gap:8px;">
                  <input type="number" id="adm-lock" class="admin-input" placeholder="Seconds (Ex: 86400)">
                  <button class="btn-small-admin" onclick="adminSetLock()">Update</button>
              </div>
          </div>

          <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--border-subtle);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <span class="admin-label" style="margin:0;">APY Configuration</span>
                  <label style="color:#fff; display:flex; align-items:center; gap:4px; font-size:11px;">
                      <input type="checkbox" id="adm-is-dynamic" onchange="toggleApyMode()"> Dynamic APY
                  </label>
              </div>
              <div id="fixed-apy-group" style="display:flex; gap:8px; margin-bottom:8px;">
                  <input type="number" id="adm-fixed-apy" class="admin-input" placeholder="Fixed APY % (Ex: 100)">
              </div>
              <div id="dynamic-apy-group" style="display:grid; grid-template-columns:1fr 1fr 1.5fr; gap:6px; display:none; margin-bottom:8px;">
                  <input type="number" id="adm-max-apy" class="admin-input" placeholder="Max%">
                  <input type="number" id="adm-min-apy" class="admin-input" placeholder="Min%">
                  <input type="number" id="adm-scale" class="admin-input" placeholder="Scale">
              </div>
              <button class="btn-small-admin" style="width:100%; justify-content:center;" onclick="adminSetApy()">Save APY Config</button>
          </div>

          <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <span class="admin-label" style="margin:0;">LP Token Eligibility (Whitelist)</span>
                  <label style="color:#fff; display:flex; align-items:center; gap:4px; font-size:11px;">
                      <input type="checkbox" id="adm-is-eligibility"> Enable
                  </label>
              </div>
              <div style="display:flex; gap:6px; margin-bottom:8px;">
                  <input type="text" id="adm-lp-token" class="admin-input" placeholder="LP Token Address">
                  <input type="number" id="adm-lp-min" class="admin-input" placeholder="Min Hold" style="width:40%;">
              </div>
              <button class="btn-small-admin" style="width:100%; justify-content:center;" onclick="adminSetEligibility()">Update Rule</button>
          </div>
      </div>
  </div> </div>

<script src="js/stake.js?v=<?php echo time(); ?>"></script>

</body>
</html>