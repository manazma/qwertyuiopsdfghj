<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="description" content="Orion Zera is the ultimate Decentralized Protocol on the Paxi Network. Swap, Stake, Burn, and Deploy Smart Contracts.">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ORION ZERA | Advanced DeFi Protocol</title>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    
    <link rel="stylesheet" href="css/style.css?v=<?php echo time(); ?>"
</head>
<body>

<div id="loading">
    <div class="nebula"></div>
    <div class="loading-core">
        <img src="assets/orionzera1.png" alt="Orion Zera Loading" class="loader-logo">
        <div class="loading-text">
            <span class="en">Initializing Protocol</span>
            <span class="zh" style="display: none;">正在初始化协议</span>
            <span class="dots"><i></i><i></i><i></i></span>
        </div>
    </div>
</div>

<div id="app" class="hidden">

    <header class="navbar">
        <div class="nav-container">
            <div class="brand">
                <img src="assets/orionlogo.png" alt="ORION Logo" class="brand-logo">
                <span>ORION ZERA</span>
            </div>
            
            <nav class="nav-links">
                <a href="#features" class="nav-item">
                    <span class="en">Features</span><span class="zh" style="display: none;">核心功能</span>
                </a>
                <a href="#staking" class="nav-item">
                    <span class="en">Staking</span><span class="zh" style="display: none;">质押</span>
                </a>
                <a href="#security" class="nav-item">
                    <span class="en">Security</span><span class="zh" style="display: none;">安全</span>
                </a>
            </nav>

            <div class="nav-actions">
                <button id="lang-toggle" class="lang-btn">
                    <i class="bi bi-globe"></i> EN / 中文
                </button>
                <a href="swap1.php" class="btn-launch">
                    <span class="en">Launch DApp</span><span class="zh" style="display: none;">启动应用</span>
                </a>
            </div>
        </div>
    </header>

    <section id="home" class="hero">
        <div class="hero-container">
            <div class="hero-content">
                <div class="hero-badge">
                    <i class="bi bi-rocket-fill"></i>
                    <span class="en">Built on Paxinet Chain</span>
                    <span class="zh" style="display: none;">基于 Paxinet 链构建</span>
                </div>
                <h1>
                    <span class="en">The Future of <br><span class="text-gradient">Deflationary DeFi</span></span>
                    <span class="zh" style="display: none;">通缩型 DeFi 的 <br><span class="text-gradient">未来枢纽</span></span>
                </h1>
                <p>
                    <span class="en">Swap tokens instantly, utilize the advanced PRC20 token burning system, and deploy robust staking contracts equipped with a powerful admin panel.</span>
                    <span class="zh" style="display: none;">即时兑换代币，利用先进的 PRC20 代币销毁系统，并部署配备强大管理面板的稳健质押合约。</span>
                </p>
                <div class="hero-buttons">
                    <button class="btn primary" onclick="window.location.href='swap1.php'">
                        <span class="en">Start Trading</span><span class="zh" style="display: none;">开始交易</span>
                        <i class="bi bi-arrow-right"></i>
                    </button>
                    <button class="btn secondary" onclick="window.location.href='docs.php'">
                        <span class="en">Read Docs</span><span class="zh" style="display: none;">阅读文档</span>
                    </button>
                </div>
            </div>
            <div class="hero-visual">
                <div class="glow-backdrop"></div>
                <img src="assets/orionlogo.png" alt="Orion Visual" class="floating-logo">
            </div>
        </div>
    </section>

    <section id="features" class="section">
        <div class="section-heading">
            <h2>
                <span class="en">Ecosystem Features</span>
                <span class="zh" style="display: none;">生态系统特征</span>
            </h2>
            <p>
                <span class="en">A complete suite of decentralized tools for sustainable growth.</span>
                <span class="zh" style="display: none;">一套完整的去中心化工具，致力于可持续增长。</span>
            </p>
        </div>

        <div class="grid-layout grid-4">
            <div class="glass-card">
                <div class="card-icon cyan"><i class="bi bi-arrow-left-right"></i></div>
                <h3><span class="en">Instant Swap</span><span class="zh" style="display: none;">即时兑换</span></h3>
                <p>
                    <span class="en">Secure, efficient, and low-fee token swaps across the ecosystem utilizing verified liquidity pools.</span>
                    <span class="zh" style="display: none;">利用经过验证的流动性池，在整个生态系统中进行安全、高效且低费用的代币兑换。</span>
                </p>
            </div>
            <div class="glass-card">
                <div class="card-icon purple"><i class="bi bi-layers-fill"></i></div>
                <h3><span class="en">Advanced Staking</span><span class="zh" style="display: none;">高级质押</span></h3>
                <p>
                    <span class="en">Stake assets in dynamic or fixed APY pools. Time-locked security ensures protocol liquidity stability.</span>
                    <span class="zh" style="display: none;">在动态或固定 APY 池中质押资产。时间锁定安全机制确保协议流动性的稳定性。</span>
                </p>
            </div>
            <div class="glass-card">
                <div class="card-icon red"><i class="bi bi-fire"></i></div>
                <h3><span class="en">PRC20 Burn System</span><span class="zh" style="display: none;">PRC20 销毁系统</span></h3>
                <p>
                    <span class="en">Provides a dedicated PRC20 token burning system to permanently reduce circulating supply and increase token scarcity.</span>
                    <span class="zh" style="display: none;">提供专属的 PRC20 代币销毁系统，以永久减少流通供应并增加代币稀缺性。</span>
                </p>
            </div>
            <div class="glass-card">
                <div class="card-icon green"><i class="bi bi-cpu-fill"></i></div>
                <h3><span class="en">Contract Deployer</span><span class="zh" style="display: none;">合约部署器</span></h3>
                <p>
                    <span class="en">Create your own Staking Smart Contracts natively, fully integrated with a master Admin Panel.</span>
                    <span class="zh" style="display: none;">原生创建您自己的质押智能合约，并与主管理面板完全集成。</span>
                </p>
            </div>
        </div>
    </section>

    <section id="staking" class="section bg-dark">
        <div class="section-heading">
            <h2>
                <span class="en">Next-Gen Staking Infrastructure</span>
                <span class="zh" style="display: none;">下一代质押基础设施</span>
            </h2>
            <p>
                <span class="en">Built on Rust architecture for maximum flexibility and control.</span>
                <span class="zh" style="display: none;">基于 Rust 架构构建，实现最大的灵活性和控制。</span>
            </p>
        </div>

        <div class="grid-layout grid-2 align-items-center">
            <div class="staking-info-list">
                <div class="info-item">
                    <i class="bi bi-graph-up-arrow icon-accent"></i>
                    <div>
                        <h4><span class="en">Dynamic & Fixed APY</span><span class="zh" style="display: none;">动态与固定 APY</span></h4>
                        <p><span class="en">Configure stable returns or let the protocol dynamically scale yields based on maximum/minimum parameters.</span><span class="zh" style="display: none;">配置稳定回报，或让协议根据最大/最小参数动态调整收益。</span></p>
                    </div>
                </div>
                <div class="info-item">
                    <i class="bi bi-shield-lock-fill icon-accent"></i>
                    <div>
                        <h4><span class="en">Time-Lock Controls</span><span class="zh" style="display: none;">时间锁定控制</span></h4>
                        <p><span class="en">Implement precise staking durations (in seconds) to prevent premature unstaking and protect liquidity.</span><span class="zh" style="display: none;">实施精确的质押时间（以秒为单位），防止过早取消质押并保护流动性。</span></p>
                    </div>
                </div>
                <div class="info-item">
                    <i class="bi bi-gem icon-accent"></i>
                    <div>
                        <h4><span class="en">NFT Eligibility Gateway</span><span class="zh" style="display: none;">NFT 资格网关</span></h4>
                        <p><span class="en">Create exclusive staking pools restricted to verified NFT holders. Users must own specific NFTs to access premium yields.</span><span class="zh" style="display: none;">创建仅限经过验证的 NFT 持有者参与的专属质押池。用户必须拥有特定的 NFT 才能获得高级收益。</span></p>
                    </div>
                </div>
            </div>

            <div class="admin-panel-showcase glass-card standout">
                <div class="panel-header">
                    <i class="bi bi-sliders"></i>
                    <h3><span class="en">Creator Admin Panel</span><span class="zh" style="display: none;">创建者管理面板</span></h3>
                </div>
                <p class="panel-desc">
                    <span class="en">Full administrative control over your deployed contracts.</span>
                    <span class="zh" style="display: none;">对您部署的合约拥有完全的管理控制权。</span>
                </p>
                <ul class="admin-features">
                    <li><i class="bi bi-check-circle-fill text-green"></i> <span class="en">Modify APY Rates instantly</span><span class="zh" style="display: none;">即时修改 APY 利率</span></li>
                    <li><i class="bi bi-check-circle-fill text-green"></i> <span class="en">Update Time-Lock durations</span><span class="zh" style="display: none;">更新时间锁定持续时间</span></li>
                    <li><i class="bi bi-check-circle-fill text-green"></i> <span class="en">Toggle NFT Eligibility</span><span class="zh" style="display: none;">切换 NFT 资格验证</span></li>
                    <li><i class="bi bi-check-circle-fill text-green"></i> <span class="en">Safe Freeze/Unfreeze protocol</span><span class="zh" style="display: none;">安全冻结/解冻协议</span></li>
                </ul>
            </div>
        </div>
    </section>

    <section id="security" class="section">
        <div class="security-banner glass-card flex-between">
            <div class="sec-text">
                <h2>
                    <i class="bi bi-shield-check text-green" style="margin-right: 10px;"></i>
                    <span class="en">Enterprise-Grade Security</span>
                    <span class="zh" style="display: none;">企业级安全</span>
                </h2>
                <p>
                    <span class="en">Our smart contracts are written in strict, memory-safe Rust (CosmWasm). The protocol features automated frozen states if reward pools deplete, strict math bounds (Uint128/Decimal), and secure access controls preventing unauthorized state mutations.</span>
                    <span class="zh" style="display: none;">我们的智能合约采用严格、内存安全的 Rust (CosmWasm) 编写。如果奖励池耗尽，协议将自动进入冻结状态，具有严格的数学边界，以及防止未经授权状态突变的安全访问控制。</span>
                </p>
            </div>
            <div class="sec-graphic">
                <i class="bi bi-file-earmark-code"></i>
            </div>
        </div>
    </section>

    <footer>
        <div class="footer-container">
            <div class="brand">
                <img src="assets/orionlogo.png" alt="ORION Logo" class="brand-logo" style="width: 32px;">
                <span style="font-size: 16px;">ORION ZERA</span>
            </div>
            <p class="copyright">
                <span class="en">© 2026 ORION ZERA. Built on Paxinet Chain.</span>
                <span class="zh" style="display: none;">© 2026 ORION ZERA. 基于 Paxinet 链构建。</span>
            </p>
            <div class="footer-links">
                <a href="#">Smart Contract</a>
                <a href="#">Audit</a>
                <a href="#">Docs</a>
            </div>
        </div>
    </footer>

</div>

<script>
    // --- 1. Loading Screen Logic ---
    window.addEventListener('load', () => {
        const loader = document.getElementById("loading");
        const app = document.getElementById("app");
        
        setTimeout(() => {
            loader.classList.add("fade-out");
            app.classList.remove("hidden");
            
            setTimeout(() => {
                loader.style.display = "none";
            }, 800);
        }, 2200);
    });

    // --- 2. Language Toggle Logic (EN / ZH) ---
    let currentLang = 'en';
    const langBtn = document.getElementById('lang-toggle');
    const enElements = document.querySelectorAll('.en');
    const zhElements = document.querySelectorAll('.zh');

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'zh' : 'en';
        
        if (currentLang === 'en') {
            enElements.forEach(el => el.style.display = '');
            zhElements.forEach(el => el.style.display = 'none');
        } else {
            enElements.forEach(el => el.style.display = 'none');
            zhElements.forEach(el => el.style.display = '');
        }
    });

    // --- 3. Navbar Scroll Effect ---
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
</script>

</body>
</html>