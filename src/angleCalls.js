const agUrl = "https://api.goldsky.com/api/public/project_cltpyx1eh5g5v01xi0a5h5xea/subgraphs/analytics-arb/prod/gn";
let agRequest = {
  operationName: "Query",
  variables: {
    where: { id: "stUSD_0x5fb4fe566a7562cab072c2b2ca9bf534e4dc7c17" },
    savingsPricesWhere: { id: "stUSD" },
    orderBy: "timestamp",
    orderDirection: "asc",
  },
  query:
    "query Query($where: SavingsBalance_filter, $savingsPricesWhere: SavingsPrice_filter) {  savingsBalances(where: $where) {      accrued      price      deposited  }  savingsPrices(where: $savingsPricesWhere) {      price  }}",
};

async function getEarnings(agAddress) {
  agRequest.variables.where.id = "stUSD_" + agAddress.toLowerCase();
  const response = await fetch(agUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agRequest),
  });

  if (response.status === 200) {
    const history = await response.json();
    //console.log(history);
    const savingsBalances = history.data.savingsBalances;
    const savingsPrices = history.data.savingsPrices;
    const earnings = Number(savingsBalances[0].accrued) + (savingsPrices[0].price - savingsBalances[0].price) * (Number(savingsBalances[0].accrued) + Number(savingsBalances[0].deposited));
    return earnings;
  } else {
    console.error("Error in Quote:", response);
    return false;
  }
}

export { getEarnings };
