function createPerformanceCalculator(aPerformance: any, aPlay: any) {
    switch (aPlay.type) {
        case "tragedy": return new TragedyCalculator(aPerformance, aPlay);
        case "comedy": return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error(`unknown type: ${aPlay.type}`);
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
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
        const result = Object.assign({}, aPerformance);
        result.play = calculator.play;
        result.amount = calculator.amount;
        result.volumeCredits = calculator.volumeCredits;
        return result;
    }

    function playFor(aPerformance: any) {
        return plays[aPerformance.playID];
    }

    function totalAmount(data:any){
        return data.performance.reduce((total: any, p:any) => total + p.amount, 0)
    }

    function totalValueCredits(data:any) {
        return data.performance.reduce((total:any, p:any) => total + p.volumeCredits, 0);
    }
}

class PerformanceCalculator {
    public performance: any;
    public play: any;
    constructor(aPerformance: any, aPlay: any) {
        this.performance = aPerformance
        this.play = aPlay;
    }

    get amount () {
        throw new Error('subclass responsibility');
    }

    get volumeCredits(){
        return Math.max(this.performance.audience - 30, 0);
    }
}

class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if(this.performance.audience > 30) {
            result += 10000 * 500 * (this.performance.audience - 30);
        }
        return result;
    }
}

class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 30000;
        if(this.performance.audience > 30) {
            result += 10000 * 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        return result;
    }
    get volumeCredits(){
        return super.volumeCredits + Math.floor(this.performance.audience/ 5);
    }
}