import plays from '../plays.json';
import invoice from '../invoices.json';
import createStatementData from "./createStatementData";

function statement (invoice:any, plays:any) {
    return renderPlainText(createStatementData(invoice,plays));
}

function renderPlainText(data:any) {
    let result = `Statement for ${ data.customer }\n`;
    for (let perf of data.performances) {
        result += ` ${ perf.play.name }: ${ usd(perf.audience)} (${ perf.audience } seats)\n`;
    }

    result += `Amount owed is ${usd(data.totalAmount)}\n`;
    result += `You earned ${data.totalValueCredits} credits\n`;
    return result;

    function usd(aNumber:any) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(aNumber/100);
    }
}