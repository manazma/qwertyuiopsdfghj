const RPC = "https://mainnet-rpc.paxinet.io";
const LCD = "https://mainnet-lcd.paxinet.io";
const DENOM = "upaxi";
// Alamat Module Swap (Jangan diubah)
const SWAP_MODULE = "paxi1mfru9azs5nua2wxcd4sq64g5nt7nn4n80r745t";

// === KONFIGURASI BIAYA LAYANAN (SERVICE FEE) ===
// Ini adalah fee yang masuk ke wallet Anda (Admin) setiap ada user swap
const SERVICE_FEE = {
  address: "paxi1ml5r9ptp5e5hh3c87fme9sf9lquxvwg9u9j8vm", // Ganti dengan wallet penerima fee
  amount: "200000", 
  denom: "upaxi"
};

// === DAFTAR TOKEN ===
const TOKEN_LIST = {
  ORION: {
    contract: "paxi1y0vna6d25hmgpsl63w2v2ks7j4tj7mwplr0pzfjmes5yqld59egsc7ahnz",
    symbol: "ORION",
    decimals: 6,
  },
  WNS: {
    contract: "paxi1ee6eaha77veuwpzgpe875yrmz2k45zyquqn9sztjv2w5h9gke02q65crh6",
    symbol: "WNS",
    decimals: 6,
  },
  TRINEX: {
    contract: "paxi15jj45fwgqchx7ycfyl2ts678skk88097fewynhaze2r32uzhwylsn3ft9g",
    symbol: "TRINEX",
    decimals: 6,
  },
  LEO: {
    contract: "paxi1fl9glyfffr8kewueguj6jsnex3whxrhn44ucsv7djgec6prdp7jqenytw2",
    symbol: "LEO",
    decimals: 6,
  },
  PICS: {
    contract: "paxi1ltd0maxmte3xf4zshta9j5djrq9cl692ctsp9u5q0p9wss0f5lmsu3zxf3",
    symbol: "PICS",
    decimals: 6,
  },
  MEMEG: {
    contract: "paxi1lkmjka3muf3gtwf6trprnq0r370zz74unsgre4p6sqyn79g39xqqwrmygz",
    symbol: "MEMEG",
    decimals: 6,
  },
  ROON: {
    contract: "paxi1nvnyaedrxtvhgxkdwghpr377vlg484asapf9j76pdxczw6y2dxvqlgtcey",
    symbol: "ROON",
    decimals: 6,
  },
  COBRA: {
    contract: "paxi14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9snvcq0u",
    symbol: "COBRA",
    decimals: 6,
  },
  MYJB: {
    contract: "paxi1mvdyecvma29rtd8y5k33pekdrqr7m36n34kzlufy4jz5nyjllmqqg7fxp8",
    symbol: "MYJB",
    decimals: 6,
  },
  PINET: {
    contract: "paxi1l2fvuecjpakxxh6k0mhpxzeln2veqpjs7znm8mfavuwx506v0qnsmpnt55",
    symbol: "PINET",
    decimals: 6,
  },
  ALPS: {
    contract: "paxi1fka7t9avjmx7yphqxn3lzy3880tgcc0wu23xwfwxe5e5y3lkmzfqp07whx",
    symbol: "APLS",
    decimals: 6,
  },
  WWLW: {
    contract: "paxi1aqjn8sha92zyqd27d4gw8lnjgmgt24v3ytwm2f9j9rza7pfuku4s3tdf7z",
    symbol: "WWLW",
    decimals: 6,
  },
  TRUMP: {
    contract: "paxi1qfwnnm6z7zlgpk2ltwfh9hk8d4vwpu5h5nv2pqxwthve7htygzmswfpv8t",
    symbol: "TRUMP",
    decimals: 6,
  }
};

// Token Default
var ACTIVE_TOKEN = TOKEN_LIST.ORION;