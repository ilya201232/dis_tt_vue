import {ref, watch} from "vue";

const housingCost = ref(2000000);
const initialFee = ref(2000000);
const creditTerm = ref(1);
const interestRate = ref(0);

export function useStore() {

    return {
        housingCost,
        initialFee,
        creditTerm,
        interestRate
    }
}