window.WALLET = null;
window.BALANCE_PAXI = 0;
window.BALANCE_TOKEN = 0;

window.connect = async function() {
  console.log("Connect Wallet...");
  
  if (!window.paxihub || !window.paxihub.paxi) {
    alert("PaxiHub Wallet tidak terdeteksi!");
    return;
  }

  try {
    const res = await window.paxihub.paxi.getAddress();
    window.WALLET = res.address;
    
    document.getElementById("walletText").textContent =
      window.WALLET.slice(0, 6) + "..." + window.WALLET.slice(-4);
    
    const btn = document.getElementById("swapBtn");
    btn.disabled = false;
    btn.textContent = "SWAP NOW";

    await window.updateBalances();

  } catch (err) {
    alert("Gagal connect: " + err.message);
  }
}

window.updateBalances = async function() {
  if (!window.WALLET) return;

  try {
    // 1. Saldo PAXI
    const paxiRes = await fetch(`${LCD}/cosmos/bank/v1beta1/balances/${window.WALLET}/by_denom?denom=${DENOM}`)
      .then(r => r.json());
    
    const rawPaxi = paxiRes.balance?.amount || "0";
    window.BALANCE_PAXI = Number(rawPaxi) / 1000000;

    // 2. Saldo TOKEN (Sesuai ACTIVE_TOKEN)
    if (!window.ACTIVE_TOKEN) {
        console.error("ACTIVE_TOKEN belum siap");
        return;
    }

    const queryJson = JSON.stringify({ balance: { address: window.WALLET } });
    const queryData = btoa(queryJson);
    
    const tokenRes = await fetch(`${LCD}/cosmwasm/wasm/v1/contract/${window.ACTIVE_TOKEN.contract}/smart/${queryData}`)
      .then(r => r.json());
    
    const rawToken = tokenRes.data?.balance || "0";
    window.BALANCE_TOKEN = Number(rawToken) / Math.pow(10, window.ACTIVE_TOKEN.decimals);

    if (window.renderBalances) window.renderBalances();

  } catch (e) {
    console.error("Gagal update saldo:", e);
  }
}