import {ref} from "vue";

// Stores housing cost
const housingCost = ref(2000000);

// Stores initial fee (Part of credit that will be paid momentarily)
const initialFee = ref(2000000);

// Store credit term (how long credit will last)
const creditTerm = ref(1);

// Stores total interest rate (per year)
const interestRate = ref(0);

// Stores fixed payment amount (per month)
const fixedPayment = ref(0);

export function useStore() {

    return {
        housingCost,
        initialFee,
        creditTerm,
        interestRate,
        fixedPayment
    }
}