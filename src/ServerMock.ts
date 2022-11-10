interface Response {
    code: number,
    message: string,
    body?: any
}

class ServerMock {

    // Difference in interest rate for having or not having a salary card
    private salaryCardDif = 0.3;

    // Minimal interest rates depending on credit type
    private minInterestRates = [
        {
            id: 1,
            label: "Новостройка",
            description: "Кредит на покупку квартиры в доме, который еще строится или был построен недавно.",
            interestRate: 6.4
        },
        {
            id: 2,
            label: "Вторичный рынок",
            description: "Кредит на покупку квартиры на вторичном рынке.",
            interestRate: 10.4
        },
        {
            id: 3,
            label: "Покупка дома",
            description: "Кредит на покупку дома.",
            interestRate: 5.7
        },
        {
            id: 4,
            label: "Постройка дома",
            description: "Кредит на постройку дома.",
            interestRate: 5.3
        },
        {
            id: 5,
            label: "Покупка земли или дачного дома",
            description: "Кредит на покупку земли или дачного дома.",
            interestRate: 10.7
        },
        {
            id: 6,
            label: "Рефинансирование",
            description: "Оформление ипотеки в другом банке на новых условиях для погашения существующего долга.",
            interestRate: 5.7
        },
        {
            id: 7,
            label: "Гараж, машино-место или кладовая",
            description: "Ипотека на покупку гаража и т.д.",
            interestRate: 10.9
        },
        {
            id: 8,
            label: "Наличные под залог жилья",
            description: "Ипотека для получения наличных денег под залог жилья.",
            interestRate: 10.7
        }
    ];

    private minHousingCost = 1500000;
    private maxHousingCost = 60000000;
    private housingCostStep = 250000;

    private minInitialFeeBase = 225000;
    private minInitialFeeMultiplier = 0.15;
    private initialFeeStepBase = 10000;

    // Credit terms boundaries in years
    private minCreditTerm = 1;
    private maxCreditTerm = 30;


    private minCreditSum = 1500000;


    async getSalaryCardDif():Promise<Response> {
        return {
            code: 200,
            message: "Ok",
            body: {
                salaryCardDif: this.salaryCardDif
            }
        };
    }

    async getCreditTypes(): Promise<Response> {
        return {
            code: 200,
            message: "Ok",
            body: {
                minInterestRates: this.minInterestRates
            }
        };
    }

    async getHousingCostSliderData(): Promise<Response> {
        return {
            code: 200,
            message: "Ok",
            body: {
                minHousingCost: this.minHousingCost,
                maxHousingCost: this.maxHousingCost,
                housingCostStep: this.housingCostStep
            }
        };
    }

    async getInitialFeeData(chosenHousingCost: number): Promise<Response> {

        const minInitialFee = Math.max(this.minInitialFeeMultiplier * chosenHousingCost, this.minInitialFeeBase);

        return {
            code: 200,
            message: "Ok",
            body: {
                minInitialFee: minInitialFee,
                initialFeeStep: this.initialFeeStepBase,
            }
        };
    }

    async getCreditTermData(): Promise<Response> {
        return {
            code: 200,
            message: "Ok",
            body: {
                minCreditTerm: this.minCreditTerm,
                maxCreditTerm: this.maxCreditTerm,
            }
        };
    }

    async getMinCreditSum(): Promise<Response> {
        return {
            code: 200,
            message: "Ok",
            body: {
                minCreditSum: this.minCreditSum
            }
        }
    }
}

const instance = new ServerMock();

export default instance;