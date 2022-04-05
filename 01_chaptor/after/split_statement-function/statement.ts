import plays from '../plays.json';
import invoice from '../invoices.json';

console.log(statement(invoice[0], plays));

function statement (invoice:any, plays:any) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${ invoice.customer }\n`;

    function playFor(aPerformance: any) {
        return plays[aPerformance.playID];
    }

    const format = new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format;


    for (let perf of invoice.performances) {
        let thisAmount = amountFor(perf);
        function amountFor(aPerformance: any) {
            let result = 0;
            switch (playFor(perf).type) {
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

        //ボリューム特典のポイントを加算
        volumeCredits += Math.max(perf.audience - 30, 0);
        //喜劇のときは10人につき、さらにポイントを加算
        if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
        //注文の内訳を出力
        result += ` ${ playFor(perf).name }: ${ format(thisAmount/100) } (${ perf.audience } seats)\n`;
        totalAmount += thisAmount;
    }
    result += `Amount owed is ${ format(totalAmount/100) }\n`;
    result += `You earned ${ volumeCredits } credits\n`;
    return result;
}