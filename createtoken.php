<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orion Token Launcher & Manager</title>
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
     <link rel="stylesheet" href="css/createtoken.css?v=<?php echo time(); ?>"
    
</head>
<body>

<div class="launcher-card">
    <div class="header">
        <div class="header-left">
            <a href="create.php" class="btn-back" title="Back">
                <i class="bi bi-arrow-left"></i>
            </a>
            <h2 class="header-title" id="mainTitle"><i class="bi bi-heptagon-fill"></i> Deploy Token</h2>
        </div>
        <button id="btnConnect" class="btn-connect" onclick="connectWallet()">
            <i class="bi bi-wallet2"></i> Connect
        </button>
    </div>

    <div class="tabs-container">
        <button class="tab-btn active" id="tabLaunch" onclick="switchTab('launch')">Launch Token</button>
        <button class="tab-btn" id="tabManage" onclick="switchTab('manage')">Manage Token</button>
    </div>

    <div id="formSection" class="form-section">
        
        <div id="contentLaunch" class="tab-content active">
            <div style="background: rgba(16, 185, 129, 0.05); padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.85rem; color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.2);">
                <i class="bi bi-shield-check"></i> <b>Safe Protocol Enabled:</b> Tokens are automatically created with a fixed supply (No Mint) and immutable contract (No Admin). <br>
                <span style="color: #cbd5e1; display:block; margin-top:6px;"><i>*Fee: 6 PAXI required to launch a token.</i></span>
            </div>

            <div class="form-grid">
                <div class="form-group" style="margin: 0;">
                    <label>Token Name</label>
                    <input type="text" id="tkName" placeholder="e.g. Cosmic Coin" required>
                </div>
                <div class="form-group" style="margin: 0;">
                    <label>Symbol</label>
                    <input type="text" id="tkSymbol" placeholder="e.g. CSMC" required>
                </div>
            </div>

            <div class="form-grid">
                <div class="form-group" style="margin: 0;">
                    <label>Initial Supply</label>
                    <input type="number" id="tkSupply" placeholder="1000000" required>
                </div>
                <div class="form-group" style="margin: 0;">
                    <label>Decimals</label>
                    <input type="number" id="tkDecimals" value="6" required>
                </div>
            </div>

            <hr style="border-color: rgba(255,255,255,0.05); margin: 24px 0;">

            <div class="form-group">
                <label>Project Name <span style="font-weight:normal; color:#475569;">(Optional)</span></label>
                <input type="text" id="tkProject" placeholder="e.g. The Cosmic Project">
            </div>

            <div class="form-group">
                <label>Description <span style="font-weight:normal; color:#475569;">(Optional)</span></label>
                <textarea id="tkDesc" rows="2" placeholder="Tell us about your token..."></textarea>
            </div>

            <div class="logo-row">
                <div class="token-preview" id="previewContainerLaunch">
                    <i class="bi bi-image" id="previewIconLaunch"></i>
                    <img id="previewImgLaunch" src="" alt="Logo" onerror="imgError('Launch')">
                </div>
                <div class="logo-input-wrapper">
                    <label>Logo URL (https:// or ipfs://)</label>
                    <input type="text" id="tkLogo" placeholder="Paste image link here..." oninput="previewImage('Launch')">
                </div>
            </div>

            <button id="btnSubmit" class="btn-submit" onclick="instantiateToken()" disabled>
                Launch Token (10 PAXI) <i class="bi bi-rocket-takeoff"></i>
            </button>
        </div>

        <div id="contentManage" class="tab-content">
            <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 0.85rem; color: #94a3b8;">
                <i class="bi bi-info-circle" style="color: #60a5fa;"></i> Update the marketing details (logo, description, etc) of your token. You must be the marketing manager to proceed.
            </div>

            <div class="form-group">
                <label>Contract Address <span style="color:var(--danger);">*</span></label>
                <input type="text" id="updContract" placeholder="paxi1..." required>
            </div>

            <hr style="border-color: rgba(255,255,255,0.05); margin: 24px 0;">

            <div class="form-group">
                <label>New Project Name <span style="font-weight:normal; color:#475569;">(Leave blank to keep current)</span></label>
                <input type="text" id="updProject" placeholder="e.g. The Cosmic Project v2">
            </div>

            <div class="form-group">
                <label>New Description <span style="font-weight:normal; color:#475569;">(Leave blank to keep current)</span></label>
                <textarea id="updDesc" rows="2" placeholder="Update your token description..."></textarea>
            </div>

            <div class="logo-row">
                <div class="token-preview" id="previewContainerManage">
                    <i class="bi bi-image" id="previewIconManage"></i>
                    <img id="previewImgManage" src="" alt="Logo" onerror="imgError('Manage')">
                </div>
                <div class="logo-input-wrapper">
                    <label>New Logo URL <span style="font-weight:normal; color:#475569;">(Leave blank to keep current)</span></label>
                    <input type="text" id="updLogo" placeholder="Paste new image link..." oninput="previewImage('Manage')">
                </div>
            </div>

            <button id="btnUpdate" class="btn-submit" onclick="updateToken()" disabled>
                Submit Changes <i class="bi bi-check2-circle"></i>
            </button>
        </div>

    </div>

    <div id="statusBox" class="status-box">
        <div class="status-title" id="statusTitle"></div>
        <div id="statusDesc" style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;"></div>
        <div id="contractBox" class="contract-box" style="display: none;"></div>
    </div>
</div>
<script src="https://mainnet-api.paxinet.io/resources/js/paxi-cosmjs.umd.js"></script>
<script src="js/createtoken.js?v=<?php echo time(); ?>"></script>

</body>
</html>