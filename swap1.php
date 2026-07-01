<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>ORION SWAP</title>
  
  <link rel="stylesheet" href="css/app.css?v=<?php echo time(); ?>">
  <link rel="stylesheet" href="css/navbar-app.css?v=<?php echo time(); ?>">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
  <script src="https://mainnet-api.paxinet.io/resources/js/paxi-cosmjs.umd.js"></script>
</head>

<body>

<?php include 'navbar.php'; ?>

<section class="swap-box">
  
  <div class="swap-header">
    <h2>Swap</h2>
    <button class="btn-connect-wallet" id="topWalletBtn" onclick="window.connectWallet()">
        <i class="bi bi-wallet2"></i>
        <span id="topWalletText">Connect Wallet</span>
    </button>
  </div>

  <form class="form" onsubmit="return false">
    
    <div class="field-group">
      <div class="field-header">
        <label>You pay</label>
        <span class="balance-text" id="balFrom" onclick="maxBalance()">Balance: 0.00</span>
      </div>
      <div class="field-row">
        <input type="number" id="amount" placeholder="0">
        <div id="fromContainer"></div>
      </div>
    </div>

    <div class="flip-container">
        <button type="button" class="flip-btn" onclick="toggle()">
          <i class="bi bi-arrow-down-up"></i>
        </button>
    </div>

    <div class="field-group">
      <div class="field-header">
        <label>You receive</label>
        <span class="balance-text" id="balTo">Balance: 0.00</span>
      </div>
      <div class="field-row">
        <input type="number" id="estimatedOutput" disabled placeholder="0">
        <div id="toContainer"></div>
      </div>
    </div>

    <div class="swap-info">
        <div class="info-row">
            <span>Max Slippage</span>
            <span id="slippageDisplay" style="color:#fff; font-weight:600;">Auto</span>
        </div>
        
        <div class="info-row" id="burnInfoRow" style="display:none; color:var(--danger);">
             <span>🔥 Burn Tax (<span id="burnPercent">0</span>%)</span>
             <span id="burnAmountDisplay">0.00</span>
        </div>
        
        <div class="info-row">
            <span>Minimum Received</span>
            <span id="minReceivedDisplay" style="color:#fff; font-weight:600;">0.00</span>
        </div>
    </div>

    <button type="button" class="cta" id="swapBtn" onclick="window.swap()" disabled>
      Loading...
    </button>

  </form>
</section>

<div id="tokenModalOverlay" class="modal-overlay" onclick="if(event.target===this) closeTokenModal()">
    <div class="modal-content">
        <div class="modal-top">
            <div class="modal-title-row">
                <h3>Select a token</h3>
                <button class="close-modal-btn" onclick="closeTokenModal()"><i class="bi bi-x"></i></button>
            </div>
            <input type="text" id="searchTokenInput" class="search-input" placeholder="Search name or paste address" autocomplete="off">
        </div>
        <div id="tokenListScroll" class="token-list-container">
            <div style="text-align:center; padding:40px; color:var(--text-sub);">
                <div class="spinner" style="margin: 0 auto 10px auto;"></div> Loading database...
            </div>
        </div>
    </div>
</div>

<pre id="log" style="display:none"></pre>
<div id="txSuccess" class="modal-overlay" onclick="if(event.target===this) closeModal()">
  <div class="modal-content" style="text-align:center; padding: 40px 20px;">
    <div style="font-size: 60px; color: #10b981; margin-bottom: 20px;"><i class="bi bi-check-circle-fill"></i></div>
    <h3 style="margin:0 0 10px 0; font-size:22px;">Transaction Submitted</h3>
    <div style="background:var(--bg-input); padding:12px; border-radius:12px; margin-bottom:24px; font-family:monospace; font-size:12px; color:var(--text-sub); word-break:break-all;" id="txHash">0x...</div>
    <div style="display:flex; gap:12px; justify-content:center;">
      <a id="txLink" href="#" target="_blank" style="background:var(--bg-input); color:var(--primary); padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:600;">View Explorer ↗</a>
      <button onclick="closeModal()" style="background:transparent; border:1px solid var(--border-color); color:#fff; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:600;">Close</button>
    </div>
  </div>
</div>

<script src="js/config.js?v=<?php echo time(); ?>"></script>
<script src="js/wallet.js"></script>
<script src="js/swap.js?v=<?php echo time(); ?>"></script>

</body>
</html>