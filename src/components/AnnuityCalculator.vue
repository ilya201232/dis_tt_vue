<template>
    <div class="calc-core">
        <v-dialog
            v-model="isOpen"
            scrollable
        >
            <v-card>
                <v-card-title
                    class="d-flex justify-center text-h4"
                >
                    План выплаты ипотеки
                </v-card-title>
                <v-divider></v-divider>
                <v-table
                    fixed-header
                    :height="calculateTableHeight()"
                >
                    <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Сумма Платежа</th>
                        <th>Процентная сумма</th>
                        <th>Погашено от долга</th>
                        <th>Остаток долга</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in creditPlan" :key="item.currentDate">
                        <td>{{ item.currentDate.year + "/" + item.currentDate.month }}</td>
                        <td>{{ Math.round(item.paymentAmount * 100) / 100 }}</td>
                        <td>{{ Math.round(item.percentagePart * 100) / 100 }}</td>
                        <td>{{ Math.round(item.baseDebtPart * 100) / 100 }}</td>
                        <td>{{ Math.round(item.debtRemain * 100) / 100 }}</td>
                    </tr>
                    </tbody>
                </v-table>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="primary" block @click="isOpen = false">Close Dialog</v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>
    </div>
</template>

<script lang="ts">
import {reactive, ref, watch} from "vue";
import {useStore} from "@/store";

export default {
    name: "AnnuityCalculator",
    setup() {

        const isOpen = ref(false);

        const housingCost = reactive(useStore().housingCost);
        const initialFee = reactive(useStore().initialFee);
        const creditTerm = reactive(useStore().creditTerm);
        const interestRate = reactive(useStore().interestRate);

        const fixedPayment = reactive(useStore().fixedPayment);

        const creditPlan = ref<[{
            currentDate: { year: number, month: number },
            paymentAmount: number,
            percentagePart: number,
            baseDebtPart: number,
            debtRemain: number
        }?]>([]);

        // Calculates payment amount
        function calcPaymentAmount(money: number, percentage: number) {
            fixedPayment.value =
                (percentage * Math.pow(percentage + 1, creditTerm.value * 12)) /
                (Math.pow(1 + percentage, creditTerm.value * 12) - 1) *
                money;
        }

        function performCalculation() {
            creditPlan.value = [];

            const percentage = Math.pow(1 + interestRate.value / 100, 1/16) - 1;

            let moneyLeft = housingCost.value - initialFee.value;

            calcPaymentAmount(moneyLeft, percentage);

            let currentDate = {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1
            }

            console.log(currentDate)

            function incrementDate(currentDate: { year: number, month: number }) {
                currentDate.month++;

                if (currentDate.month > 12) {
                    currentDate.month = 1;
                    currentDate.year++;
                }
            }

            while (Math.abs(moneyLeft) > 1e-5) {
                const newDebt = moneyLeft * (1 + percentage) - fixedPayment.value;

                creditPlan.value.push({
                    currentDate: {year: currentDate.year, month: currentDate.month},
                    paymentAmount: fixedPayment.value,
                    percentagePart: moneyLeft * percentage,
                    baseDebtPart: fixedPayment.value - moneyLeft * percentage,
                    debtRemain: newDebt
                })

                incrementDate(currentDate);
                moneyLeft = newDebt
            }

            isOpen.value = true;
        }

        function precalculate() {
            const percentage = Math.pow(1 + interestRate.value / 100, 1/16) - 1;

            let moneyLeft = housingCost.value - initialFee.value;

            calcPaymentAmount(moneyLeft, percentage);
        }

        function calculateTableHeight() {

            if (creditTerm.value === 1) {
                return innerHeight * 0.5;
            } else {
                return innerHeight * 0.8;
            }

        }

        return {
            performCalculation,
            isOpen,
            creditPlan,
            precalculate,
            calculateTableHeight
        }
    }
}
</script>

<style scoped>
.calc-core {

}


</style>