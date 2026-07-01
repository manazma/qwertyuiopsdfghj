<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>BURN TOKEN PRC20 | Orion Zera</title>
    
    <link rel="preconnect" href="https://mainnet-lcd.paxinet.io">
    <link rel="preconnect" href="https://mainnet-rpc.paxinet.io">
    <link rel="preconnect" href="https://cdn.jsdelivr.net">

    <link rel="stylesheet" href="css/burn_style.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="css/navbar-app.css?v=<?php echo time(); ?>">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    
    <script src="https://mainnet-api.paxinet.io/resources/js/paxi-cosmjs.umd.js" defer></script>

    <style>
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin-anim { animation: spin 1s linear infinite; display: inline-block; }
    </style>
</head>
<body>

    <?php include 'navbar.php'; ?>

    <div class="lang-toggle-wrapper">
        <button id="lang-toggle" class="btn-lang" onclick="toggleLang()">
            <i class="bi bi-translate"></i> EN / 中文
        </button>
    </div>

    <div class="burn-wrapper">
        <div class="burn-container">
            
            <div class="burn-header">
                <h2>
                    <span data-i18n="burnTitle">Burn PRC20</span> 
                    <i class="bi bi-fire" style="color: #ef4444;"></i>
                </h2>
                <span class="badge-net">PAXINET MAINNET</span>
            </div>

            <div id="connectSection" class="connect-section">
                <i class="bi bi-wallet2 wallet-icon"></i>
                <p>
                    <span data-i18n="connectDesc">Connect your wallet to access the burn protocol.</span>
                </p>
                <button id="btn-connect" class="btn-connect-wallet" onclick="window.connect()">
                    <span data-i18n="connectWallet">Connect Wallet</span>
                </button>
            </div>

            <div id="burnInterface" class="burn-interface hidden">
                
                <div class="wallet-info">
                    <span class="text-gray"><span data-i18n="connected">Connected:</span></span>
                    <span id="walletAddress" class="text-primary font-mono">-</span>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <span data-i18n="selectToken">Select Token</span>
                    </label>
                    <button class="token-selector-btn" onclick="openTokenModal()">
                        <div class="selected-token-info">
                            <div id="selTokenLogoWrapper">
                                <img id="selTokenLogo" src="assets/default-token.png" alt="Token" onerror="this.src='assets/default-token.png'" style="display: none; width:28px; height:28px; border-radius:50%;">
                            </div>
                            <span id="selTokenSymbol">
                                <span data-i18n="selectToken">Select a token</span>
                            </span>
                        </div>
                        <i class="bi bi-chevron-down"></i>
                    </button>
                    <input type="hidden" id="contractAddress">
                </div>

                <div id="tokenDetails" class="token-details-card hidden">
                    <div class="flex-between mb-2">
                        <span class="text-gray"><span data-i18n="contractLabel">Contract</span></span>
                        <span id="dispContract" class="text-white font-mono" style="font-size: 0.8rem;">-</span>
                    </div>
                    <div class="flex-between">
                        <span class="text-gray"><span data-i18n="balanceLabel">Balance</span></span>
                        <div class="balance-display">
                            <span id="dispBalance" class="text-highlight">0.00</span>
                            <i class="bi bi-arrow-clockwise btn-refresh" id="btnRefresh" onclick="window.updateBalances()" title="Refresh Balance"></i>
                        </div>
                    </div>
                </div>

                <div class="form-group" style="margin-top: 20px;">
                    <label class="form-label flex-between">
                        <span><span data-i18n="amountLabel">Amount to Burn</span></span>
                    </label>
                    <div class="input-with-max">
                        <input type="number" id="burnAmount" class="form-input amount-input" placeholder="0.0" disabled>
                        <button class="btn-max" onclick="setMaxAmount()">MAX</button>
                    </div>
                </div>

                <button id="burnBtn" class="btn-action btn-burn" onclick="initiateBurn()" disabled>
                    <span data-i18n="btnSelectFirst">Select Token First</span>
                </button>
            </div>
            
            <div class="status-msg" id="output"></div>
        </div>
    </div>

    <div id="modalTokens" class="modal-overlay">
        <div class="modal-box modal-lg">
            <div class="modal-header">
                <h3><span data-i18n="selectTokenTitle">Select a Token</span></h3>
                <i class="bi bi-x modal-close" onclick="closeModal('modalTokens')"></i>
            </div>
            
            <div class="custom-address-box" style="margin-bottom: 15px;">
                <input type="text" id="searchTokenInput" class="form-input" placeholder="Search name or paste address (paxi1...)" autocomplete="off" style="width: 100%;">
            </div>

            <div class="token-list-container" id="apiTokenList">
                <div class="text-center text-gray my-4"><i class="bi bi-arrow-repeat spin-anim"></i> Loading...</div>
            </div>
        </div>
    </div>

    <div id="modalConfirm" class="modal-overlay">
        <div class="modal-box">
            <div class="warning-icon"><i class="bi bi-exclamation-triangle-fill"></i></div>
            <h3 class="modal-title"><span data-i18n="confirmTitle">Confirm Burn?</span></h3>
            <p class="modal-desc">
                <span data-i18n="confirmDesc1">You are about to burn</span> 
                <strong id="modalAmount" class="text-danger">0</strong>.<br>
                <span data-i18n="confirmDesc2">This action is permanent and cannot be undone.</span>
            </p>
            <div class="modal-actions">
                <button class="btn-modal btn-cancel" onclick="closeModal('modalConfirm')">
                    <span data-i18n="cancel">Cancel</span>
                </button>
                <button class="btn-modal btn-confirm" onclick="proceedBurn()">
                    <span data-i18n="ignite">Ignite</span> <i class="bi bi-fire"></i>
                </button>
            </div>
        </div>
    </div>

    <div id="modalSuccess" class="modal-overlay">
        <div class="modal-box text-center">
            <i class="bi bi-check-circle-fill text-success" style="font-size:3.5rem; margin-bottom:15px; display:inline-block;"></i>
            <h3 class="modal-title"><span data-i18n="successTitle">Burn Successful!</span></h3>
            <p class="modal-desc text-gray">
                <span data-i18n="successDesc">Tokens have been permanently removed from circulation.</span>
            </p>
            <a id="explorerLink" href="#" target="_blank" class="explorer-link">
                <span data-i18n="viewExplorer">View on Explorer</span> ↗
            </a>
            <button class="btn-modal btn-cancel w-100" onclick="closeModal('modalSuccess')">
                <span data-i18n="close">Close</span>
            </button>
        </div>
    </div>

<script src="js/burn.js?v=<?php echo time(); ?>"></script>
</body>
</html>