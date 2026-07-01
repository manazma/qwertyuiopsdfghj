<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <title>ORION | Documentation</title>


  <link rel="stylesheet" href="css/docs.css?v=1.2">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</head>

<body>

<header class="app-topbar">
  <div style="display: flex; align-items: center; gap: 15px;">
      <button class="mobile-sidebar-toggle" onclick="toggleSidebar()">
          <i class="bi bi-list"></i>
      </button>
      <a href="index.php" class="app-brand">
        <img src="assets/orionlogo.png" class="app-logo" alt="LOGO">
        <span>ORION</span>
      </a>
  </div>
  
  <a href="swap1.php" class="wallet-btn" style="text-decoration:none;">
    <span data-key="launch_app">Launch App</span>
    <i class="bi bi-arrow-right-short"></i>
  </a>
</header>

<div class="docs-layout">
    
    <aside class="docs-sidebar" id="sidebarDocs">
        <div class="lang-selector-wrapper">
            <select id="languageSelector" class="lang-select" onchange="changeLanguage(this.value)">
                <option value="en">🇺🇸 English</option>
                <option value="cn">🇨🇳 中文 (Chinese)</option>
            </select>
        </div>

        <nav class="docs-nav-list">
            <a href="#introduction" class="docs-nav-link active" data-key="nav_intro"><i class="bi bi-info-circle"></i> Introduction</a>
            <a href="#how-to-swap" class="docs-nav-link" data-key="nav_swap"><i class="bi bi-arrow-left-right"></i> Swap Guide</a>
            <a href="#tokenomics" class="docs-nav-link" data-key="nav_tokenomics"><i class="bi bi-pie-chart"></i> Tokenomics & Fees</a>
            <a href="#contracts" class="docs-nav-link" data-key="nav_contracts"><i class="bi bi-code-slash"></i> Smart Contracts</a>
            <a href="#staking-info" class="docs-nav-link" data-key="nav_staking"><i class="bi bi-terminal"></i> Staking & CLI</a>
            <a href="#nft-market" class="docs-nav-link" data-key="nav_nft"><i class="bi bi-images"></i> NFT Market</a>
        </nav>
    </aside>

    <main class="docs-main" id="mainContent">
        
        <section class="doc-section doc-header" id="introduction">
            <h1 data-key="intro_title">Orion Protocol Docs</h1>
            <p data-key="intro_desc">Welcome to the official Orion Protocol documentation. Learn how to use our Swap, Staking, and understand our smart contract architecture.</p>
        </section>

        <section class="doc-section" id="how-to-swap">
            <div class="doc-card">
                <h2><i class="bi bi-arrow-left-right"></i> <span data-key="swap_title">How to Swap</span></h2>
                <p data-key="swap_desc">Orion Swap is a decentralized exchange feature allowing instant, low-fee token trading on the Paxinet network.</p>
                
                <h3 data-key="steps_title">Step-by-Step Swap:</h3>
                <ul>
                    <li data-key="step_1">Click the <strong>Connect Wallet</strong> button in the top right corner.</li>
                    <li data-key="step_2">Ensure you have enough <strong>PAXI</strong> for network gas fees.</li>
                    <li data-key="step_3">Select the token you want to swap in the <em>From</em> field and the receiving token in the <em>To</em> field.</li>
                    <li data-key="step_4">Enter the amount. The estimated output will be calculated automatically based on liquidity.</li>
                    <li data-key="step_5">Review the <strong>Slippage Tolerance</strong> to prevent front-running.</li>
                    <li data-key="step_6">Click <strong>Swap</strong> and approve the transaction in your PaxiHub wallet.</li>
                </ul>
            </div>
        </section>

        <section class="doc-section" id="tokenomics">
            <div class="doc-card">
                <h2><i class="bi bi-pie-chart"></i> <span data-key="tokenomics_title">Tokenomics & Fees</span></h2>
                <p data-key="tokenomics_desc">Orion utilizes advanced mechanisms to maintain and grow long-term token value.</p>

                <h3 data-key="fee_struct_title">Fee Structure</h3>
                <ul>
                    <li data-key="fee_service"><strong>Service Fee:</strong> 0.1 PAXI per transaction (Flat).</li>
                    <li data-key="fee_gas"><strong>Network Gas:</strong> Varies depending on network load (auto-calculated by node).</li>
                </ul>
            </div>
        </section>

        <section class="doc-section" id="contracts">
            <div class="doc-card">
                <h2><i class="bi bi-code-slash"></i> <span data-key="contract_title">Smart Contracts & Factory</span></h2>
                <p data-key="contract_desc">Orion operates on secure, verified CosmWasm smart contracts on the Paxinet Mainnet.</p>
                
                <h3 data-key="contract_create_title">Deploying a Smart Contract</h3>
                <p data-key="contract_create_desc">Our Factory allows anyone to easily launch their own Staking Pools without writing any code.</p>
                <ul style="margin-top: 15px;">
                    <li data-key="contract_step_1"><strong>1. Configuration:</strong> Enter your Staking Token, Reward Token, Initial APY, and Lock Duration in the dashboard.</li>
                    <li data-key="contract_step_2"><strong>2. Deployment:</strong> The Factory interacts directly with the blockchain to instantiate a new CosmWasm contract securely.</li>
                    <li data-key="contract_step_3"><strong>3. Management:</strong> Once deployed, you become the admin of the contract and can manage reward pools directly via UI.</li>
                </ul>
            </div>
        </section>

        <section class="doc-section" id="staking-info">
            <div class="doc-card">
                <h2><i class="bi bi-terminal"></i> <span data-key="staking_title">Staking Guide & CLI Commands</span></h2>
                <p data-key="staking_desc">Interact directly with the Staking Smart Contract using the Paxinet Command Line Interface (CLI).</p>
                
                <h3 data-key="cli_tx_title">1. Transaction Commands (Users)</h3>
                <div class="code-wrapper">
                    <code id="cli_tx_cmds" class="highlight-cmd"></code>
                </div>

                <h3 data-key="cli_admin_title">2. Admin Commands (Owner Only)</h3>
                <div class="code-wrapper">
                    <code id="cli_admin_cmds" class="highlight-cmd"></code>
                </div>

                <h3 data-key="cli_query_title">3. Read Data (Query - Free)</h3>
                <div class="code-wrapper">
                    <code id="cli_query_cmds" class="highlight-cmd"></code>
                </div>
            </div>
        </section>

        <section class="doc-section" id="nft-market">
            <div class="doc-card" style="border-color: var(--accent); background: rgba(245, 158, 11, 0.05);">
                <h2 style="color: var(--accent); border-bottom-color: rgba(245, 158, 11, 0.2);">
                    <i class="bi bi-images"></i> <span data-key="nft_title">NFT Marketplace (Coming Soon) 🎨</span>
                </h2>
                <p data-key="nft_desc" style="color: #e2e8f0; margin-top: 10px;">We are currently building a next-generation NFT Marketplace on Paxinet. Soon, you will be able to mint, trade, and showcase your unique digital assets with zero friction and lowest fees.</p>
            </div>
        </section>

    </main>
</div>


<script>
    function toggleSidebar() {
        document.getElementById('sidebarDocs').classList.toggle('active');
    }

    document.getElementById('mainContent').addEventListener('click', () => {
        if (window.innerWidth <= 900) {
            document.getElementById('sidebarDocs').classList.remove('active');
        }
    });

    const sections = document.querySelectorAll('.doc-section');
    const navLinks = document.querySelectorAll('.docs-nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (scrollY >= (section.offsetTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // TRANSLATIONS & CLI COMMANDS (EN & CN)
    // ==========================================
    const translations = {
        en: {
            launch_app: "Launch App",
            nav_intro: "Introduction",
            nav_swap: "Swap Guide",
            nav_tokenomics: "Tokenomics & Fees",
            nav_contracts: "Smart Contracts",
            nav_staking: "Staking & CLI",
            nav_nft: "NFT Market (Soon)",

            intro_title: "Orion Protocol Docs",
            intro_desc: "Welcome to the official Orion Protocol documentation. Learn how to use our Swap, Staking, and understand our smart contract architecture.",

            swap_title: "How to Swap",
            swap_desc: "Orion Swap is a decentralized exchange feature allowing instant, low-fee token trading on the Paxinet network.",
            steps_title: "Step-by-Step Swap:",
            step_1: "Click the <strong>Connect Wallet</strong> button in the top right corner.",
            step_2: "Ensure you have enough <strong>PAXI</strong> for network gas fees.",
            step_3: "Select the token you want to swap in the <em>From</em> field and the receiving token in the <em>To</em> field.",
            step_4: "Enter the amount. The estimated output will be calculated automatically based on liquidity.",
            step_5: "Review the <strong>Slippage Tolerance</strong> to prevent front-running.",
            step_6: "Click <strong>Swap</strong> and approve the transaction in your PaxiHub wallet.",

            tokenomics_title: "Tokenomics & Fees",
            tokenomics_desc: "Orion utilizes advanced mechanisms to maintain and grow long-term token value.",
            fee_struct_title: "Fee Structure",
            fee_service: "<strong>Service Fee:</strong> 0.1 PAXI per transaction (Flat).",
            fee_gas: "<strong>Network Gas:</strong> Varies depending on network load (auto-calculated by node).",

            contract_title: "Smart Contracts & Factory",
            contract_desc: "Orion operates on secure, verified CosmWasm smart contracts on the Paxinet Mainnet.",
            contract_create_title: "Deploying a Smart Contract",
            contract_create_desc: "Our Factory allows anyone to easily launch their own Staking Pools without writing any code.",
            contract_step_1: "<strong>1. Configuration:</strong> Enter your Staking Token, Reward Token, Initial APY, and Lock Duration in the dashboard.",
            contract_step_2: "<strong>2. Deployment:</strong> The Factory interacts directly with the blockchain to instantiate a new CosmWasm contract securely.",
            contract_step_3: "<strong>3. Management:</strong> Once deployed, you become the admin of the contract and can manage reward pools directly via UI.",

            staking_title: "Staking Guide & CLI Commands",
            staking_desc: "Interact directly with the Staking Smart Contract using the Paxinet Command Line Interface (CLI). Replace <span class='highlight-param'>&lt;contract_address&gt;</span> and <span class='highlight-param'>&lt;wallet&gt;</span> with your own details.",
            
            cli_tx_title: "1. Transaction Commands (Execute)",
            cli_admin_title: "2. Admin Commands (Owner Only)",
            cli_query_title: "3. Read Data (Query - Free)",
            
            nft_title: "NFT Marketplace (Coming Soon) 🎨",
            nft_desc: "We are currently building a next-generation NFT Marketplace on Paxinet. Soon, you will be able to mint, trade, and showcase your unique digital assets with zero friction and lowest fees.",
            
            menu_home: "Home",
            menu_swap: "Swap",
            menu_staking: "Staking",
            menu_docs: "Docs",

            // CLI Commands - English Comments
            cmd_tx: `<span class="highlight-comment">// Stake Tokens into the pool</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"stake": {"amount": "1000000"}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y

<span class="highlight-comment">// Unstake Tokens from the pool</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"unstake": {"amount": "1000000"}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y

<span class="highlight-comment">// Claim / Harvest Rewards</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"claim": {}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y`,

            cmd_admin: `<span class="highlight-comment">// Freeze Contract (Pause Staking)</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"freeze": {}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y

<span class="highlight-comment">// Unfreeze Contract (Resume Staking)</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"unfreeze": {}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y

<span class="highlight-comment">// Configure APY Settings</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"set_apy": {"dynamic": false, "max_apy": 50, "min_apy": 10, "scale_valuation": "1000000000"}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y

<span class="highlight-comment">// Set Lock Duration (in seconds)</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"set_lock": {"duration": 2592000}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y

<span class="highlight-comment">// Set Eligibility (Require LP Token to stake)</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"set_eligibility": {"enabled": true, "lp_token": "paxi1...", "min_amount": "5000000"}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y`,

            cmd_query: `<span class="highlight-comment">// Check Specific Staker Info</span>
paxid query wasm contract-state smart <span class="highlight-param">&lt;contract_address&gt;</span> '{"staker": {"address": "paxi1..."}}'

<span class="highlight-comment">// Check Contract Configuration</span>
paxid query wasm contract-state smart <span class="highlight-param">&lt;contract_address&gt;</span> '{"config": {}}'

<span class="highlight-comment">// Check Current Pool Status</span>
paxid query wasm contract-state smart <span class="highlight-param">&lt;contract_address&gt;</span> '{"get_status": {}}'

<span class="highlight-comment">// List All Stakers</span>
paxid query wasm contract-state smart <span class="highlight-param">&lt;contract_address&gt;</span> '{"list_stakers": {"limit": 10}}'

<span class="highlight-comment">// Get Contract Info & Version</span>
paxid query wasm contract-state smart <span class="highlight-param">&lt;contract_address&gt;</span> '{"contract_info": {}}'`
        },
        cn: {
            launch_app: "启动应用",
            nav_intro: "介绍",
            nav_swap: "交易指南",
            nav_tokenomics: "代币经济学与费用",
            nav_contracts: "智能合约",
            nav_staking: "质押与 CLI",
            nav_nft: "NFT 市场 (即将推出)",

            intro_title: "Orion 协议文档",
            intro_desc: "欢迎阅读 Orion 协议官方文档。了解如何使用我们的交易、质押功能，并理解我们的智能合约架构。",

            swap_title: "如何交易 (Swap)",
            swap_desc: "Orion Swap 是一个去中心化交易所功能，允许在 Paxinet 网络上进行即时、低费用的代币交易。",
            steps_title: "交易步骤:",
            step_1: "点击右上角的 <strong>Connect Wallet</strong> 按钮连接您的钱包。",
            step_2: "确保您有足够的 <strong>PAXI</strong> 支付网络 Gas 费用。",
            step_3: "在 <em>From</em> 栏选择您要支付的代币，在 <em>To</em> 栏选择您想接收的代币。",
            step_4: "输入数量。系统将根据流动性自动计算预估的输出金额。",
            step_5: "检查 <strong>Slippage Tolerance (滑点容忍度)</strong> 以防止抢跑交易。",
            step_6: "点击 <strong>Swap</strong> 并在您的 PaxiHub 钱包中确认交易。",

            tokenomics_title: "代币经济学与费用",
            tokenomics_desc: "Orion 使用先进机制来维持和增长代币的长期价值。",
            fee_struct_title: "费用结构",
            fee_service: "<strong>服务费:</strong> 每笔交易 0.1 PAXI (固定费用)。",
            fee_gas: "<strong>网络 Gas:</strong> 根据网络负载变化 (节点自动计算)。",

            contract_title: "智能合约与工厂",
            contract_desc: "Orion 运行在 Paxinet 主网安全且经过验证的 CosmWasm 智能合约上。",
            contract_create_title: "部署智能合约",
            contract_create_desc: "我们的工厂允许任何人无需编写代码即可轻松启动自己的质押池。",
            contract_step_1: "<strong>1. 配置参数:</strong> 在仪表板中输入您的质押代币、奖励代币、初始 APY 和锁定期。",
            contract_step_2: "<strong>2. 一键部署:</strong> 工厂直接与区块链安全交互，实例化一个新的 CosmWasm 合约。",
            contract_step_3: "<strong>3. 管理合约:</strong> 部署后，您将成为该合约的管理员，可以通过 UI 直接管理奖励池。",

            staking_title: "质押指南与 CLI 命令",
            staking_desc: "使用 Paxinet 命令行界面 (CLI) 直接与质押智能合约交互。请将 <span class='highlight-param'>&lt;contract_address&gt;</span> 和 <span class='highlight-param'>&lt;wallet&gt;</span> 替换为您自己的信息。",
            
            cli_tx_title: "1. 交易命令 (执行)",
            cli_admin_title: "2. 管理员命令 (仅限所有者)",
            cli_query_title: "3. 读取数据 (查询 - 免费)",

            nft_title: "NFT 市场 (即将推出) 🎨",
            nft_desc: "我们目前正在 Paxinet 上构建下一代 NFT 市场。很快，您将能够以零摩擦和最低的费用铸造、交易和展示您独特的数字资产。",
            
            menu_home: "主页",
            menu_swap: "交易",
            menu_staking: "质押",
            menu_docs: "文档",

            // CLI Commands - Chinese Comments
            cmd_tx: `<span class="highlight-comment">// 质押代币到池中</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"stake": {"amount": "1000000"}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y

<span class="highlight-comment">// 从池中解除质押代币</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"unstake": {"amount": "1000000"}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y

<span class="highlight-comment">// 领取 / 收获奖励</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"claim": {}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y`,

            cmd_admin: `<span class="highlight-comment">// 冻结合约 (暂停质押)</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"freeze": {}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y

<span class="highlight-comment">// 解冻合约 (恢复质押)</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"unfreeze": {}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y

<span class="highlight-comment">// 配置 APY 设置</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"set_apy": {"dynamic": false, "max_apy": 50, "min_apy": 10, "scale_valuation": "1000000000"}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y

<span class="highlight-comment">// 设置锁定期 (以秒为单位)</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"set_lock": {"duration": 2592000}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y

<span class="highlight-comment">// 设置资格 (需要持有 LP 代币才能质押)</span>
paxid tx wasm execute <span class="highlight-param">&lt;contract_address&gt;</span> '{"set_eligibility": {"enabled": true, "lp_token": "paxi1...", "min_amount": "5000000"}}' --from <span class="highlight-param">&lt;wallet&gt;</span> --gas auto --gas-adjustment 1.3 --fees 200000upaxi -y`,

            cmd_query: `<span class="highlight-comment">// 检查特定质押者信息</span>
paxid query wasm contract-state smart <span class="highlight-param">&lt;contract_address&gt;</span> '{"staker": {"address": "paxi1..."}}'

<span class="highlight-comment">// 检查合约配置</span>
paxid query wasm contract-state smart <span class="highlight-param">&lt;contract_address&gt;</span> '{"config": {}}'

<span class="highlight-comment">// 检查当前池状态</span>
paxid query wasm contract-state smart <span class="highlight-param">&lt;contract_address&gt;</span> '{"get_status": {}}'

<span class="highlight-comment">// 列出所有质押者</span>
paxid query wasm contract-state smart <span class="highlight-param">&lt;contract_address&gt;</span> '{"list_stakers": {"limit": 10}}'

<span class="highlight-comment">// 获取合约信息和版本</span>
paxid query wasm contract-state smart <span class="highlight-param">&lt;contract_address&gt;</span> '{"contract_info": {}}'`
        }
    };

    function changeLanguage(lang) {
        localStorage.setItem('orion_docs_lang', lang);
        const dict = translations[lang] || translations['en'];
        
        document.querySelectorAll('[data-key]').forEach(el => {
            const key = el.getAttribute('data-key');
            if (dict[key]) { el.innerHTML = dict[key]; }
        });

        // Update CLI Code blocks based on language
        document.getElementById('cli_tx_cmds').innerHTML = dict['cmd_tx'];
        document.getElementById('cli_admin_cmds').innerHTML = dict['cmd_admin'];
        document.getElementById('cli_query_cmds').innerHTML = dict['cmd_query'];
        
        // Update Sidebar icons + text
        document.querySelector('[data-key="nav_intro"]').innerHTML = `<i class="bi bi-info-circle"></i> ${dict['nav_intro']}`;
        document.querySelector('[data-key="nav_swap"]').innerHTML = `<i class="bi bi-arrow-left-right"></i> ${dict['nav_swap']}`;
        document.querySelector('[data-key="nav_tokenomics"]').innerHTML = `<i class="bi bi-pie-chart"></i> ${dict['nav_tokenomics']}`;
        document.querySelector('[data-key="nav_contracts"]').innerHTML = `<i class="bi bi-code-slash"></i> ${dict['nav_contracts']}`;
        document.querySelector('[data-key="nav_staking"]').innerHTML = `<i class="bi bi-terminal"></i> ${dict['nav_staking']}`;
        document.querySelector('[data-key="nav_nft"]').innerHTML = `<i class="bi bi-images"></i> ${dict['nav_nft']}`;
    }

    const savedLang = localStorage.getItem('orion_docs_lang') || 'en';
    document.getElementById('languageSelector').value = savedLang;
    changeLanguage(savedLang);

    document.querySelectorAll('.docs-nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            if (window.innerWidth <= 900) {
                document.getElementById('sidebarDocs').classList.remove('active');
            }
        });
    });
</script>

</body>
</html>