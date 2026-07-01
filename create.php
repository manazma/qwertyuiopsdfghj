<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cosmic Studio Hub</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/create.css?v=<?php echo time(); ?>">
     <link rel="stylesheet" href="css/navbar-app.css?v=<?php echo time(); ?>">
</head>
<body>

 <?php include 'navbar.php'; ?>
 
    <main class="content-container">
        <div class="menu-container">
            <h1 class="welcome-title">Creator Dashboard</h1>
            <p class="welcome-desc">Select a tool to start building on the Paxi Network.</p>
            
            <div class="menu-grid">
                <a href="createtoken.php" class="menu-card">
                    <i class="bi bi-rocket-takeoff-fill menu-icon token-icon"></i>
                    <h3>Token Factory</h3>
                    <p>Deploy custom PRC20 tokens with immutable supply and secure protocols.</p>
                    <div class="btn-launch">Launch Tool</div>
                </a>

                <a href="createcontrakstaking.php" class="menu-card staking">
                    <i class="bi bi-bank-fill menu-icon staking-icon"></i>
                    <h3>Staking Factory</h3>
                    <p>Build yield-generating pools and reward systems for your community.</p>
                    <div class="btn-launch">Launch Tool</div>
                </a>
            </div>
        </div>
    </main>

</body>
</html>