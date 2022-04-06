import plays from '../plays.json';
import invoice from '../invoices.json';

console.log(statement(invoice[0], plays));

function statement (invoice:any, plays:any) {
    const statementData = {
        customer: '',
        performance: ''
    };
    statementData.customer = invoice.customer;
    statementData.performance = invoice.performance.map(enrichPerformance);
    return renderPlainText( statementData, plays);

    function enrichPerformance(aPerformance:any) {
        const result = Object.assign({}, aPerformance);
        return result;
    }
}

function renderPlainText(data:any, plays: any) {
    let result = `Statement for ${ data.customer }\n`;
    for (let perf of data.performances) {
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
        for (let perf of data.performances) {
            result += volumeCreditsFor(perf);
        }
        return result
    }

    function totalAmount(){
        let result = 0;
        for (let perf of data.performances) {
            result += amountFor(perf);
        }
        return result
    }
}