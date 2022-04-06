import plays from '../plays.json';
import invoice from '../invoices.json';

console.log(statement(invoice[0], plays));

function statement (invoice:any, plays:any) {
    const statementData = {};
    return renderPlainText( statementData, invoice, plays);
}

function renderPlainText(data:any, invoice: any, plays: any) {
    let result = `Statement for ${ invoice.customer }\n`;
    for (let perf of invoice.performances) {
        result += ` ${ playFor(perf).name }: ${ usd(amountFor(perf)/100) } (${ perf.audience } seats)\n`;
    }

    result += `Amount owed is ${usd(totalAmount())}\n`;
    result += `You earned ${totalValueCredits()} credits\n`;
    return result;

    function playFor(aPerformance: any) {
        return plays[aPerformance.playID];
    }

    function amountFor(aPerformance: any) {
        let result = 0;
        switch (playFor(aPerformance).type) {
            case "tragedy":
                result = 40000;
                if (playFor(aPerformance).audience > 30) {
                    result += 1000 * (aPerformance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (aPerformance.audience > 20) {
                    result += 10000 + 500 * (aPerformance.audience - 20);
                }
                result += 300 * aPerformance.audience;
                break;
            default:
                throw new Error(`unknown type: ${ playFor(aPerformance).type }`);
        }
        return result;
    }

    function volumeCreditsFor(aPerformance: any){
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function usd(aNumber:any) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(aNumber/100);
    }

    function totalValueCredits() {
        let result = 0;
        for (let perf of invoice.performances) {
            result += volumeCreditsFor(perf);
        }
        return result
    }

    function totalAmount(){
        let result = 0;
        for (let perf of invoice.performances) {
            result += amountFor(perf);
        }
        return result
    }
}