
class PerformanceCalculator {
    public performance: any;
    public play: any;
    constructor(aPerformance: any, aPlay: any) {
        this.performance = aPerformance
        this.play = aPlay;
    }

    get amount () {
        let result = 0;
        switch (this.play.type) {
            case "tragedy":
                result = 40000;
                if (this.play.audience > 30) {
                    result += 1000 * (this.performance.audience - 30);
                }
                break;
            case "comedy":
                result = 30000;
                if (this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience - 20);
                }
                result += 300 * this.performance.audience;
                break;
            default:
                throw new Error(`unknown type: ${ this.play.type }`);
        }

        return result;
    }

    get volumeCredits(){
        let result = 0;
        result += Math.max(this.performance.audience - 30, 0);
        if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5);
        return result;
    }
}

export default function createStatementData(invoice:any, plays:any) {
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
    return statementData;

    function enrichPerformance(aPerformance:any) {
        const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function amountFor(aPerformance: any) {
        return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
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