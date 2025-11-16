require("dotenv").config();
const axios = require("axios");
const { google } = require("googleapis");

// Etherscan API Configuration
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const ETHERSCAN_BASE_URL = "https://api.etherscan.io/api";

// Addresses to monitor (add yours here)
const MONITORED_ADDRESSES = process.env.MONITORED_ADDRESSES?.split(",") || [];

// Google Sheets setup (reuse from main app)
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// Initialize tracking state
let lastCheckedBlocks = {};

// Helper: Format Wei to Ether
function weiToEth(wei) {
  return (parseInt(wei) / 1e18).toFixed(6);
}

// Helper: Shorten address for display
function shortAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper: Get transaction type emoji
function getTxEmoji(tx, monitoredAddr) {
  const isIncoming = tx.to.toLowerCase() === monitoredAddr.toLowerCase();
  const isOutgoing = tx.from.toLowerCase() === monitoredAddr.toLowerCase();
  
  if (isIncoming) return "📥";
  if (isOutgoing) return "📤";
  return "🔄";
}

// Fetch normal transactions
async function fetchTransactions(address, startBlock = 0) {
  try {
    const response = await axios.get(ETHERSCAN_BASE_URL, {
      params: {
        module: "account",
        action: "txlist",
        address: address,
        startblock: startBlock,
        endblock: 99999999,
        page: 1,
        offset: 100,
        sort: "desc",
        apikey: ETHERSCAN_API_KEY,
      },
    });

    if (response.data.status === "1") {
      return response.data.result;
    }
    return [];
  } catch (error) {
    console.error(`❌ Error fetching transactions for ${address}:`, error.message);
    return [];
  }
}

// Fetch internal transactions (contract calls)
async function fetchInternalTransactions(address, startBlock = 0) {
  try {
    const response = await axios.get(ETHERSCAN_BASE_URL, {
      params: {
        module: "account",
        action: "txlistinternal",
        address: address,
        startblock: startBlock,
        endblock: 99999999,
        page: 1,
        offset: 100,
        sort: "desc",
        apikey: ETHERSCAN_API_KEY,
      },
    });

    if (response.data.status === "1") {
      return response.data.result;
    }
    return [];
  } catch (error) {
    console.error(`❌ Error fetching internal txs for ${address}:`, error.message);
    return [];
  }
}

// Fetch ERC-20 token transfers
async function fetchTokenTransfers(address, startBlock = 0) {
  try {
    const response = await axios.get(ETHERSCAN_BASE_URL, {
      params: {
        module: "account",
        action: "tokentx",
        address: address,
        startblock: startBlock,
        endblock: 99999999,
        page: 1,
        offset: 100,
        sort: "desc",
        apikey: ETHERSCAN_API_KEY,
      },
    });

    if (response.data.status === "1") {
      return response.data.result;
    }
    return [];
  } catch (error) {
    console.error(`❌ Error fetching token transfers for ${address}:`, error.message);
    return [];
  }
}

// Fetch current gas prices
async function fetchGasPrice() {
  try {
    const response = await axios.get(ETHERSCAN_BASE_URL, {
      params: {
        module: "gastracker",
        action: "gasoracle",
        apikey: ETHERSCAN_API_KEY,
      },
    });

    if (response.data.status === "1") {
      return response.data.result;
    }
    return null;
  } catch (error) {
    console.error("❌ Error fetching gas price:", error.message);
    return null;
  }
}

// Log transaction to Google Sheet
async function logTransactionToSheet(tx, type, monitoredAddr) {
  const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  const spreadsheetId = process.env.SHEET_ID;

  const timestamp = new Date(tx.timeStamp * 1000).toISOString();
  const readableTime = new Date(tx.timeStamp * 1000).toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const emoji = getTxEmoji(tx, monitoredAddr);
  const direction = tx.to.toLowerCase() === monitoredAddr.toLowerCase() ? "IN" : "OUT";
  
  let row = [
    timestamp,
    readableTime,
    `${emoji} ${direction}`,
    shortAddress(tx.from),
    shortAddress(tx.to),
    weiToEth(tx.value) + " ETH",
    tx.hash,
    `=HYPERLINK("https://etherscan.io/tx/${tx.hash}", "View")`,
    tx.isError === "0" ? "✅ Success" : "❌ Failed",
    (parseInt(tx.gasUsed) * parseInt(tx.gasPrice)) / 1e18 + " ETH",
    tx.blockNumber,
    type,
  ];

  // Add to appropriate sheet
  const sheetName = type === "ERC-20" ? "Token Transfers" : "ETH Transactions";

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:L`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [row] },
    });

    console.log(`✅ Logged ${type} transaction: ${tx.hash.slice(0, 10)}...`);
  } catch (error) {
    console.error(`❌ Error logging to sheet:`, error.message);
  }
}

// Initialize Etherscan sheets
async function initializeEtherscanSheets() {
  const sheets = google.sheets({ version: "v4", auth: oauth2Client });
  const spreadsheetId = process.env.SHEET_ID;

  try {
    // Get existing sheets
    const sheetMeta = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheets = sheetMeta.data.sheets.map((s) => s.properties.title);

    // Create ETH Transactions sheet
    if (!existingSheets.includes("ETH Transactions")) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: "ETH Transactions",
                  gridProperties: { frozenRowCount: 1 },
                },
              },
            },
          ],
        },
      });

      // Add headers
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "ETH Transactions!A1:L1",
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [
            [
              "Timestamp",
              "Date/Time",
              "Direction",
              "From",
              "To",
              "Amount",
              "Tx Hash",
              "Link",
              "Status",
              "Gas Fee",
              "Block",
              "Type",
            ],
          ],
        },
      });

      // Style headers
      const ethSheetId = (await sheets.spreadsheets.get({ spreadsheetId }))
        .data.sheets.find((s) => s.properties.title === "ETH Transactions")
        .properties.sheetId;

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              updateCells: {
                range: {
                  sheetId: ethSheetId,
                  startRowIndex: 0,
                  endRowIndex: 1,
                },
                rows: [
                  {
                    values: Array(12).fill({
                      userEnteredFormat: {
                        backgroundColor: { red: 0.2, green: 0.3, blue: 0.5 },
                        textFormat: {
                          foregroundColor: { red: 1, green: 1, blue: 1 },
                          bold: true,
                        },
                        horizontalAlignment: "CENTER",
                      },
                    }),
                  },
                ],
                fields: "userEnteredFormat",
              },
            },
          ],
        },
      });
    }

    // Create Token Transfers sheet
    if (!existingSheets.includes("Token Transfers")) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: "Token Transfers",
                  gridProperties: { frozenRowCount: 1 },
                },
              },
            },
          ],
        },
      });

      // Add headers
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Token Transfers!A1:L1",
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [
            [
              "Timestamp",
              "Date/Time",
              "Direction",
              "From",
              "To",
              "Amount",
              "Tx Hash",
              "Link",
              "Status",
              "Gas Fee",
              "Block",
              "Token",
            ],
          ],
        },
      });
    }

    // Add Home button and freeze rows
    const updatedMeta = await sheets.spreadsheets.get({ spreadsheetId });
    for (const sheet of updatedMeta.data.sheets) {
      const sheetName = sheet.properties.title;
      if (sheetName === "ETH Transactions" || sheetName === "Token Transfers") {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                updateCells: {
                  range: {
                    sheetId: sheet.properties.sheetId,
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: 1,
                  },
                  rows: [
                    {
                      values: [
                        {
                          userEnteredValue: { formulaValue: '=HYPERLINK("#gid=0","🏠 Home")' },
                          userEnteredFormat: {
                            backgroundColor: { red: 0.2, green: 0.5, blue: 0.8 },
                            textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true },
                            horizontalAlignment: "CENTER",
                          },
                        },
                      ],
                    },
                  ],
                  fields: "userEnteredValue,userEnteredFormat",
                },
              },
            ],
          },
        });
      }
    }

    console.log("✅ Etherscan sheets initialized");
  } catch (error) {
    console.error("❌ Error initializing Etherscan sheets:", error.message);
  }
}

// Monitor addresses for new transactions
async function monitorAddresses() {
  console.log("\n🔍 Checking for new transactions...");

  for (const address of MONITORED_ADDRESSES) {
    const startBlock = lastCheckedBlocks[address] || 0;

    // Fetch normal transactions
    const normalTxs = await fetchTransactions(address, startBlock);
    for (const tx of normalTxs.slice(0, 10)) {
      // Log last 10
      await logTransactionToSheet(tx, "Normal", address);
    }

    // Fetch internal transactions
    const internalTxs = await fetchInternalTransactions(address, startBlock);
    for (const tx of internalTxs.slice(0, 10)) {
      await logTransactionToSheet(tx, "Internal", address);
    }

    // Fetch token transfers
    const tokenTxs = await fetchTokenTransfers(address, startBlock);
    for (const tx of tokenTxs.slice(0, 10)) {
      const tokenRow = { ...tx, value: tx.value }; // Token amount
      await logTransactionToSheet(tokenRow, "ERC-20", address);
    }

    // Update last checked block
    if (normalTxs.length > 0) {
      lastCheckedBlocks[address] = Math.max(
        ...normalTxs.map((tx) => parseInt(tx.blockNumber))
      );
    }
  }

  // Log current gas prices
  const gasPrice = await fetchGasPrice();
  if (gasPrice) {
    console.log(
      `⛽ Gas Prices - Low: ${gasPrice.SafeGasPrice} | Avg: ${gasPrice.ProposeGasPrice} | High: ${gasPrice.FastGasPrice}`
    );
  }
}

// Main execution
async function main() {
  console.log("🚀 Starting Etherscan Monitor...");
  console.log(`📍 Monitoring addresses: ${MONITORED_ADDRESSES.join(", ")}`);

  // Initialize sheets
  await initializeEtherscanSheets();

  // Initial check
  await monitorAddresses();

  // Poll every 5 minutes
  setInterval(async () => {
    await monitorAddresses();
  }, 5 * 60 * 1000);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { monitorAddresses, initializeEtherscanSheets };