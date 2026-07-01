<?php
// Deteksi halaman aktif
$current_page = basename($_SERVER['PHP_SELF']);
?>

<header class="dex-header">
    <a href="index.php" class="dex-brand">
        <img src="assets/orionlogo.png" class="dex-logo" alt="ORION">
        <span class="dex-brand-text">ORION ZERA</span>
    </a>

    <div class="dex-actions">
        <button class="hamburger-btn" id="menuToggleBtn" onclick="toggleMenu()">
            <i class="bi bi-list"></i>
        </button>
    </div>

    <nav class="dropdown-menu" id="navMenu">
        <a href="index.php" class="nav-link <?php echo ($current_page == 'index.php') ? 'active' : ''; ?>">
            <i class="bi bi-house"></i> Home
        </a>
        <a href="swap1.php" class="nav-link <?php echo ($current_page == 'swap1.php') ? 'active' : ''; ?>">
            <i class="bi bi-arrow-left-right"></i> Swap
        </a>
        <a href="staking.php" class="nav-link <?php echo ($current_page == 'staking.php') ? 'active' : ''; ?>">
            <i class="bi bi-piggy-bank"></i> Staking
        </a>
        <a href="create.php" class="nav-link <?php echo ($current_page == 'cctrk.php') ? 'active' : ''; ?>">
            <i class="bi bi-plus-circle"></i> Create
        </a>
        <a href="burn.php" class="nav-link <?php echo ($current_page == 'burn.php') ? 'active' : ''; ?>">
            <i class="bi bi-fire"></i> Burn
        </a>
        <a href="docs.php" class="nav-link <?php echo ($current_page == 'docs.php') ? 'active' : ''; ?>">
            <i class="bi bi-file-earmark-text"></i> Docs
        </a>
    </nav>
</header>

<script>
    function toggleMenu() {
        document.getElementById("navMenu").classList.toggle("show");
    }

    // Menutup menu jika user mengeklik di sembarang tempat di luar kotak menu
    document.addEventListener("click", function(event) {
        const menu = document.getElementById("navMenu");
        const btn = document.getElementById("menuToggleBtn");
        
        // Pastikan menu dan tombol ada, lalu cek posisi klik
        if (menu && btn && !menu.contains(event.target) && !btn.contains(event.target)) {
            menu.classList.remove("show");
        }
    });
</script>