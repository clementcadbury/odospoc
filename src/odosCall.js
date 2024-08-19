// https://app.odos.xyz/
// https://docs.odos.xyz/api/quickstart/sor/
// https://docs.odos.xyz/api/endpoints/

const quoteUrl = "https://api.odos.xyz/sor/quote/v2";
const assembleUrl = "https://api.odos.xyz/sor/assemble";

let quoteRequestBody = {
  chainId: 42161, // Arbitrum One
  inputTokens: [
    {
      tokenAddress: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC
      amount: "", // input amount as a string in fixed integer precision
    },
  ],
  outputTokens: [
    {
      tokenAddress: "0xFA5Ed56A203466CbBC2430a43c66b9D8723528E7", // EURA
      proportion: 1,
    },
  ],
  userAddr: "", // checksummed user address
  slippageLimitPercent: 0.3, // set your slippage limit percentage (1 = 1%),
  referralCode: 0, // referral code (recommended)
  disableRFQs: true,
  compact: true,
};

let assembleRequestBody = {
  userAddr: "", // the checksummed address used to generate the quote
  pathId: null, // Replace with the pathId from quote response in step 1
  simulate: true, // this can be set to true if the user isn't doing their own estimate gas call for the transaction
};

/**
 *
 * @param {string} userAddr
 * @param {string} amountIn
 */
async function getQuote(userAddr, amountIn) {
  if (isNaN(amountIn)) {
    alert("input a number ex: 50.2");
    return false;
  }
  quoteRequestBody.inputTokens[0].amount = Math.floor(amountIn * 1000000).toString(); // 1000000 because USDC has 6 decimals
  quoteRequestBody.userAddr = userAddr;
  console.log(quoteRequestBody);

  const response = await fetch(quoteUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quoteRequestBody),
  });

  if (response.status === 200) {
    const quote = await response.json();
    // handle quote response data
    return quote;
  } else {
    console.error("Error in Quote:", response);
    // handle quote failure cases
    return false;
  }
}

/**
 *
 * @param {string} userAddr
 * @param {object} _quote
 */
async function getAssemble(userAddr, _quote) {
  if (_quote === null) {
    alert("getAssemble : no quote");
    return false;
  }

  assembleRequestBody.userAddr = userAddr;
  assembleRequestBody.pathId = _quote.pathId;

  const response = await fetch(assembleUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assembleRequestBody),
  });

  if (response.status === 200) {
    const assembledTransaction = await response.json();
    // handle Transaction Assembly response data
    return assembledTransaction;
  } else {
    console.error("Error in Transaction Assembly:", response);
    // handle quote failure cases
    return false;
  }
}

async function sendTransaction(assemble, signer) {
  return await signer.sendTransaction(assemble);
}

export { getQuote, getAssemble, sendTransaction };
