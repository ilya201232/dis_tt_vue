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
            creditTypeId: 1,
            interestRate: 5.7
        },
        {
            creditTypeId: 2,
            interestRate: 10.4
        },
        {
            creditTypeId: 3,
            interestRate: 5.7
        },
        {
            creditTypeId: 4,
            interestRate: 5.3
        },
        {
            creditTypeId: 5,
            interestRate: 10.7
        },
        {
            creditTypeId: 6,
            interestRate: 5.7
        },
        {
            creditTypeId: 7,
            interestRate: 10.9
        },
        {
            creditTypeId: 8,
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


    async getSalaryCardDif():Promise<Response> {
        return {
            code: 200,
            message: "Ok",
            body: {
                salaryCardDif: this.salaryCardDif
            }
        };
    }

    async getMinInterestRate(chosenTypeId: number): Promise<Response> {

        for (const minInterestRate of this.minInterestRates) {
            if (minInterestRate.creditTypeId === chosenTypeId) {
                return {
                    code: 200,
                    message: "Ok",
                    body: {
                        minInterestRate: minInterestRate.interestRate
                    }
                };
            }
        }

        return {
            code: 404,
            message: "Couldn't find min interest rate for this type id: " + chosenTypeId
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

                // TODO: make step depend on chosenHousingCost
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
}

const instance = new ServerMock();

export default instance;