import plays from '../plays.json';
import invoice from '../invoices.json';
import createStatementData from "./createStatementData";

statement(invoice, plays);

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

}

function htmlStatement(invoice:any, plays:any) {
    return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data:any) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += "<table>\n";
    result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
    for (let perf of data.performances) {
        result += `  <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
        result += `<td>${usd(perf.amount)}</td></tr>\n`;
    }
    result += "</table>\n";
    result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>\n`;
    result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
    return result;
}

function usd(aNumber:any) {
    return new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber/100);
}
