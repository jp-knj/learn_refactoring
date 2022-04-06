import plays from '../plays.json';
import invoice from '../invoices.json';

function statement (invoice:any, plays:any) {
    const statementData = {
        customer: '',
        performance: '',
        totalAmount: '',
        totalVolumeCredits: '',
    };

    statementData.customer = invoice.customer;
    statementData.performance = invoice.performance.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalValueCredits(statementData);

    return renderPlainText( statementData, plays);

    function enrichPerformance(aPerformance:any) {
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
        return result;
    }

    function amountFor(aPerformance: any) {
        let result = 0;
        switch (aPerformance.play.type) {
            case "tragedy":
                result = 40000;
                if (aPerformance.play.audience > 30) {
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
                throw new Error(`unknown type: ${ aPerformance.play.type }`);
        }
        return result;
    }

    function playFor(aPerformance: any) {
        return plays[aPerformance.playID];
    }

    function volumeCreditsFor(aPerformance: any){
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    function totalAmount(data:any){
        return data.performance.reduce((total: any, p:any) => total + p.amount, 0)
    }

    function totalValueCredits(data:any) {
        return data.performance.reduce((total:any, p:any) => total + p.volumeCredits, 0);
    }
}

function renderPlainText(data:any, plays: any) {
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