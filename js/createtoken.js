  const LCD = "https://mainnet-lcd.paxinet.io";
    const RPC = "https://mainnet-rpc.paxinet.io";
    const CHAIN_ID = "paxi-mainnet";
    const DENOM = "upaxi";
    const CW20_CODE_ID = 1;

    let WALLET = null;
    let activeTab = 'launch';

    // =====================================
    // UI CONTROLS
    // =====================================
    function switchTab(tab) {
        activeTab = tab;
        
        // Buttons
        document.getElementById('tabLaunch').classList.remove('active');
        document.getElementById('tabManage').classList.remove('active');
        
        // Content
        document.getElementById('contentLaunch').classList.remove('active');
        document.getElementById('contentManage').classList.remove('active');
        
        // Hide Status
        hideStatus();

        if (tab === 'launch') {
            document.getElementById('tabLaunch').classList.add('active');
            document.getElementById('contentLaunch').classList.add('active');
            document.getElementById('mainTitle').innerHTML = '<i class="bi bi-heptagon-fill"></i> Deploy Token';
        } else {
            document.getElementById('tabManage').classList.add('active');
            document.getElementById('contentManage').classList.add('active');
            document.getElementById('mainTitle').innerHTML = '<i class="bi bi-gear-fill"></i> Manage Token';
        }
    }

    function previewImage(type) {
        const inputId = type === 'Launch' ? 'tkLogo' : 'updLogo';
        const inputUrl = document.getElementById(inputId).value.trim();
        const imgEl = document.getElementById(`previewImg${type}`);
        const iconEl = document.getElementById(`previewIcon${type}`);
        const container = document.getElementById(`previewContainer${type}`);

        if (!inputUrl) {
            imgEl.style.display = "none";
            iconEl.style.display = "block";
            container.style.borderColor = "var(--border)";
            container.style.boxShadow = "0 4px 10px rgba(0,0,0,0.5)";
            return;
        }

        let finalUrl = inputUrl;
        if (inputUrl.startsWith("ipfs://")) {
            finalUrl = inputUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
        }

        imgEl.src = finalUrl;
        imgEl.style.display = "block";
        iconEl.style.display = "none";
        
        container.style.borderColor = "#94a3b8";
        container.style.boxShadow = "0 0 15px rgba(148, 163, 184, 0.2)";
    }

    function imgError(type) {
        document.getElementById(`previewImg${type}`).style.display = "none";
        document.getElementById(`previewIcon${type}`).style.display = "block";
        const container = document.getElementById(`previewContainer${type}`);
        container.style.borderColor = "var(--danger)";
        container.style.boxShadow = "none";
    }

    // =====================================
    // MANUAL PROTOBUF ENCODERS
    // =====================================
    function encodeVarint(val) {
        let varint = [];
        while (val > 127) {
            varint.push((val & 127) | 128);
            val >>>= 7;
        }
        varint.push(val & 127);
        return varint;
    }
    
    function encodeString(fieldNumber, str) {
        if (!str) return [];
        const utf8 = new TextEncoder().encode(str);
        return [(fieldNumber << 3) | 2, ...encodeVarint(utf8.length), ...utf8];
    }
    
    function encodeUint64(fieldNumber, num) {
        if (!num) return [];
        return [(fieldNumber << 3) | 0, ...encodeVarint(Number(num))];
    }
    
    function encodeBytes(fieldNumber, bytes) {
        if (!bytes || bytes.length === 0) return [];
        return [(fieldNumber << 3) | 2, ...encodeVarint(bytes.length), ...bytes];
    }

    function buildMsgInstantiateContractBytes(sender, admin, codeId, label, msgObj) {
        let bytes = [];
        bytes.push(...encodeString(1, sender)); 
        bytes.push(...encodeString(2, admin));  
        bytes.push(...encodeUint64(3, codeId)); 
        bytes.push(...encodeString(4, label));  
        
        const msgBytes = new TextEncoder().encode(JSON.stringify(msgObj));
        bytes.push(...encodeBytes(5, msgBytes)); 
        return new Uint8Array(bytes);
    }

    // =====================================
    // CONNECT WALLET
    // =====================================
    async function connectWallet() {
        if (!window.paxihub || !window.paxihub.paxi) {
            alert("PaxiHub extension not found! Please install it.");
            return;
        }
        
        try {
            const btn = document.getElementById("btnConnect");
            btn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Connecting...';

            const res = await window.paxihub.paxi.getAddress();
            WALLET = res.address;
            
            btn.innerHTML = '<i class="bi bi-check2-circle"></i> ' + WALLET.slice(0, 6) + "..." + WALLET.slice(-4);
            btn.style.background = "rgba(248, 250, 252, 0.1)";
            btn.style.color = "#f8fafc";
            btn.style.borderColor = "rgba(248, 250, 252, 0.4)";
            
            document.getElementById("formSection").classList.add("active");
            document.getElementById("btnSubmit").disabled = false;
            document.getElementById("btnUpdate").disabled = false;
        } catch (err) {
            console.error("Connection failed", err);
            document.getElementById("btnConnect").innerHTML = '<i class="bi bi-wallet2"></i> Connect';
        }
    }

    // =====================================
    // EXECUTION: CREATE TOKEN (WITH BALANCE CHECK & FEE)
    // =====================================
    async function instantiateToken() {
        const name = document.getElementById("tkName").value.trim();
        const symbol = document.getElementById("tkSymbol").value.trim();
        const supply = document.getElementById("tkSupply").value;
        const decimals = document.getElementById("tkDecimals").value;
        const project = document.getElementById("tkProject").value.trim();
        const desc = document.getElementById("tkDesc").value.trim();
        const logoUrl = document.getElementById("tkLogo").value.trim();

        if (!name || !symbol || !supply || !decimals) {
            alert("Please fill required fields: Name, Symbol, Supply, and Decimals.");
            return;
        }

        const btn = document.getElementById("btnSubmit");
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Checking Balance...';
        hideStatus();

        try {
            // 0. CEK SALDO PENGGUNA TERLEBIH DAHULU
            const balanceRes = await fetch(`${LCD}/cosmos/bank/v1beta1/balances/${WALLET}/by_denom?denom=${DENOM}`).then(r => r.json());
            const userBalance = balanceRes.balance ? BigInt(balanceRes.balance.amount) : 0n;
            
            // Total yang dibutuhkan: 6 PAXI (Fee Dev) + 4 PAXI (Gas Fee) = 10 PAXI (10.000.000 upaxi)
            const requiredTotal = 10000000n;

            if (userBalance < requiredTotal) {
                const paxiBalance = (Number(userBalance) / 1000000).toFixed(2);
                throw new Error(`Saldo tidak mencukupi! Saldo Anda: ${paxiBalance} PAXI. Dibutuhkan minimal 10 PAXI (6 PAXI Fee + 4 PAXI Gas) untuk membuat token.`);
            }

            btn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Processing Transaction...';

            // CONFIG FEE DEPLOYER
            const DEV_WALLET = "paxi1ml5r9ptp5e5hh3c87fme9sf9lquxvwg9u9j8vm";
            const FEE_AMOUNT = "6000000"; // 6 PAXI

            const rawSupply = (BigInt(supply) * (10n ** BigInt(decimals))).toString();

            // FIXED SUPPLY & FIXED CONTRACT BY DEFAULT
            const instantiateMsgObj = {
                name: name,
                symbol: symbol,
                decimals: parseInt(decimals),
                initial_balances: [{ address: WALLET, amount: rawSupply }],
                marketing: {
                    project: project,
                    description: desc,
                    marketing: WALLET,
                    logo: logoUrl ? { url: logoUrl } : null
                }
            };

            const adminAddress = ""; 

            // 1. BUAT PESAN PERTAMA: TRANSFER FEE KE DEV WALLET
            const msgSend = PaxiCosmJS.MsgSend.fromPartial({
                fromAddress: WALLET,
                toAddress: DEV_WALLET,
                amount: [{ denom: DENOM, amount: FEE_AMOUNT }]
            });

            const anyMsgSend = PaxiCosmJS.Any.fromPartial({
                typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                value: PaxiCosmJS.MsgSend.encode(msgSend).finish()
            });

            // 2. BUAT PESAN KEDUA: INSTANTIATE SMART CONTRACT (TOKEN)
            const rawInstantiateBytes = buildMsgInstantiateContractBytes(
                WALLET, adminAddress, CW20_CODE_ID, `Token ${symbol}`, instantiateMsgObj
            );

            const anyMsgInstantiate = PaxiCosmJS.Any.fromPartial({
                typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract",
                value: rawInstantiateBytes
            });

            // 3. GABUNGKAN PESAN & EKSEKUSI (ATOMIC TRANSACTION)
            const multiMessages = [anyMsgSend, anyMsgInstantiate];

            // Kirim transaksi dengan gas yang memadai (4 PAXI = 4000000 upaxi)
            await buildAndBroadcastTx(multiMessages, "4000000", 80000000, "launch");

        } catch (e) {
            showStatus("Transaction Failed", e.message, "error");
            resetButton('launch');
        }
    }

    // =====================================
    // EXECUTION: UPDATE TOKEN (MANAGE)
    // =====================================
    async function updateToken() {
        const contract = document.getElementById("updContract").value.trim();
        const project = document.getElementById("updProject").value.trim();
        const desc = document.getElementById("updDesc").value.trim();
        const logoUrl = document.getElementById("updLogo").value.trim();

        if (!contract.startsWith("paxi1") || contract.length < 30) {
            alert("Please enter a valid contract address.");
            return;
        }

        if (!project && !desc && !logoUrl) {
            alert("Please fill at least one marketing field to update.");
            return;
        }

        const btn = document.getElementById("btnUpdate");
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Submitting to Blockchain...';
        hideStatus();

        try {
            const msgsProto = [];

            // 1. Update Project & Description
            if (project || desc) {
                const marketingMsg = { update_marketing: {} };
                if (project) marketingMsg.update_marketing.project = project;
                if (desc) marketingMsg.update_marketing.description = desc;

                const execMsg1 = PaxiCosmJS.MsgExecuteContract.fromPartial({
                    sender: WALLET,
                    contract: contract,
                    msg: new TextEncoder().encode(JSON.stringify(marketingMsg)),
                    funds: []
                });
                msgsProto.push(PaxiCosmJS.Any.fromPartial({
                    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                    value: PaxiCosmJS.MsgExecuteContract.encode(execMsg1).finish()
                }));
            }

            // 2. Update Logo
            if (logoUrl) {
                const logoMsg = { upload_logo: { url: logoUrl } };
                const execMsg2 = PaxiCosmJS.MsgExecuteContract.fromPartial({
                    sender: WALLET,
                    contract: contract,
                    msg: new TextEncoder().encode(JSON.stringify(logoMsg)),
                    funds: []
                });
                msgsProto.push(PaxiCosmJS.Any.fromPartial({
                    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
                    value: PaxiCosmJS.MsgExecuteContract.encode(execMsg2).finish()
                }));
            }

            // Biaya execute diset ke 0.08 PAXI (80000 upaxi)
            await buildAndBroadcastTx(msgsProto, "130000", 2500000, "update");
            
        } catch (e) {
            showStatus("Transaction Failed", e.message, "error");
            resetButton('manage');
        }
    }

    // =====================================
    // TX BUILDER & BROADCASTER
    // =====================================
    async function buildAndBroadcastTx(messages, feeAmount, gasLimit, mode) {
        const accRes = await fetch(`${LCD}/cosmos/auth/v1beta1/accounts/${WALLET}`).then(r => r.json());
        const acc = accRes.account.base_account || accRes.account;

        const txBody = PaxiCosmJS.TxBody.fromPartial({ messages: messages });
        const fee = { amount: [{ denom: DENOM, amount: feeAmount }], gasLimit: gasLimit };

        const accInfo = await window.paxihub.paxi.getAddress();
        const pubkeyAny = { 
            typeUrl: "/cosmos.crypto.secp256k1.PubKey", 
            value: PaxiCosmJS.PubKey.encode({ key: new Uint8Array(accInfo.public_key) }).finish() 
        };
        
        const authInfo = PaxiCosmJS.AuthInfo.fromPartial({ 
            signerInfos: [{ publicKey: pubkeyAny, modeInfo: { single: { mode: 1 } }, sequence: BigInt(acc.sequence) }], 
            fee 
        });

        const signDoc = PaxiCosmJS.SignDoc.fromPartial({ 
            bodyBytes: PaxiCosmJS.TxBody.encode(txBody).finish(), 
            authInfoBytes: PaxiCosmJS.AuthInfo.encode(authInfo).finish(), 
            chainId: CHAIN_ID, 
            accountNumber: BigInt(acc.account_number) 
        });

        const txObj = { 
            bodyBytes: btoa(String.fromCharCode(...signDoc.bodyBytes)), 
            authInfoBytes: btoa(String.fromCharCode(...signDoc.authInfoBytes)), 
            chainId: CHAIN_ID, 
            accountNumber: acc.account_number.toString() 
        };

        const result = await window.paxihub.paxi.signAndSendTransaction(txObj);
        if(!result.success && !result.signature) throw new Error("Transaction rejected by user");

        const sigBase64 = result.success || result.signature;
        const txRaw = PaxiCosmJS.TxRaw.fromPartial({ 
            bodyBytes: signDoc.bodyBytes, 
            authInfoBytes: signDoc.authInfoBytes, 
            signatures: [Uint8Array.from(atob(sigBase64), c => c.charCodeAt(0))] 
        });
        const base64Tx = btoa(String.fromCharCode(...PaxiCosmJS.TxRaw.encode(txRaw).finish()));

        const broadcast = await fetch(`${LCD}/cosmos/tx/v1beta1/txs`, { 
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify({ tx_bytes: base64Tx, mode: "BROADCAST_MODE_SYNC" }) 
        }).then(r => r.json());

        if (broadcast.tx_response && broadcast.tx_response.code === 0) {
            const txHash = broadcast.tx_response.txhash;
            
            if (mode === "launch") {
                document.getElementById("btnSubmit").innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Verifying...';
                pollForContractAddress(txHash);
            } else {
                document.getElementById("btnUpdate").innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Confirming...';
                pollForUpdateTx(txHash);
            }
        } else {
            throw new Error(broadcast.tx_response.raw_log || "Broadcast failed");
        }
    }

    // =====================================
    // POLLING (LAUNCH & UPDATE)
    // =====================================
    async function pollForContractAddress(txHash) {
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await fetch(`${LCD}/cosmos/tx/v1beta1/txs/${txHash}`).then(r => r.json());
                if (res.tx_response) {
                    clearInterval(interval);
                    if (res.tx_response.code === 0) {
                        let contractAddr = "Unknown (Check Explorer)";
                        try {
                            const logs = res.tx_response.logs[0];
                            const instantiateEvent = logs.events.find(e => e.type === "instantiate");
                            if (instantiateEvent) {
                                const attr = instantiateEvent.attributes.find(a => a.key === "_contract_address");
                                if (attr) contractAddr = attr.value;
                            }
                        } catch(err) {}

                        showStatus(
                            "Token Launched Successfully!", 
                            `Your token is now live (Supply Fixed & Immutable). <a href="https://explorer.paxinet.io/txs/${txHash}" target="_blank" style="color: #cbd5e1;">View Tx ↗</a>`, 
                            "success"
                        );
                        
                        const cb = document.getElementById("contractBox");
                        cb.style.display = "block";
                        cb.innerHTML = `<span style="color:var(--text-muted); font-size:0.8rem; text-transform:uppercase;">Contract Address</span><br><span style="user-select:all; font-weight: 600; font-size: 1rem; color: #f8fafc; display: block; margin-top: 4px;">${contractAddr}</span>`;
                        
                        resetButton('launch');
                        
                        // Clear Launch form
                        document.getElementById("tkName").value = '';
                        document.getElementById("tkSymbol").value = '';
                        document.getElementById("tkProject").value = '';
                        document.getElementById("tkDesc").value = '';
                        document.getElementById("tkLogo").value = '';
                        imgError('Launch');

                    } else {
                        showStatus("Reverted by Network", res.tx_response.raw_log, "error");
                        resetButton('launch');
                    }
                }
            } catch (e) {}

            if (attempts >= 15) {
                clearInterval(interval);
                showStatus("Network Timeout", "Check the explorer to verify.", "error");
                resetButton('launch');
            }
        }, 3000);
    }

    async function pollForUpdateTx(txHash) {
        let attempts = 0;
        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await fetch(`${LCD}/cosmos/tx/v1beta1/txs/${txHash}`).then(r => r.json());
                if (res.tx_response) {
                    clearInterval(interval);
                    if (res.tx_response.code === 0) {
                        showStatus(
                            "Changes Applied Successfully!", 
                            `The contract marketing info has been updated. <a href="https://explorer.paxinet.io/txs/${txHash}" target="_blank" style="color: #cbd5e1;">View Tx ↗</a>`, 
                            "success"
                        );
                        resetButton('manage');
                        
                        // Clear Manage form
                        document.getElementById("updProject").value = '';
                        document.getElementById("updDesc").value = '';
                        document.getElementById("updLogo").value = '';
                        imgError('Manage');
                    } else {
                        showStatus("Update Failed", res.tx_response.raw_log, "error");
                        resetButton('manage');
                    }
                }
            } catch (e) {}

            if (attempts >= 15) {
                clearInterval(interval);
                showStatus("Network Timeout", "Check the explorer to verify.", "error");
                resetButton('manage');
            }
        }, 3000);
    }

    // =====================================
    // UTILS
    // =====================================
    function showStatus(title, desc, type) {
        const box = document.getElementById("statusBox");
        box.style.display = "block";
        box.className = `status-box ${type}`;
        
        const icon = type === 'success' ? '<i class="bi bi-check-circle"></i>' : '<i class="bi bi-exclamation-triangle"></i>';
        document.getElementById("statusTitle").innerHTML = `${icon} ${title}`;
        document.getElementById("statusDesc").innerHTML = desc;
        document.getElementById("contractBox").style.display = "none";
    }

    function hideStatus() {
        document.getElementById("statusBox").style.display = "none";
    }
    
    function resetButton(mode) {
        if (mode === 'launch') {
            const btn = document.getElementById("btnSubmit");
            btn.innerHTML = 'Launch Token (6 PAXI) <i class="bi bi-rocket-takeoff"></i>';
            btn.disabled = false;
        } else {
            const btn = document.getElementById("btnUpdate");
            btn.innerHTML = 'Submit Changes <i class="bi bi-check2-circle"></i>';
            btn.disabled = false;
        }
    }