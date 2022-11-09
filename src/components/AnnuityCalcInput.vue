<template>
    <div class="calc-input">
        <v-select
            label='Цель кредита'
            v-model="chosenCreditType"
            :items="creditTypes"
            item-title="name"
            item-value="id"
        ></v-select>

        <v-switch
            v-model="hasSalaryCard"
            inset
            label="Есть заработная карта"
            color="green"
        ></v-switch>

        <div class="housing-cost-part">
            <div>Стоимость жилья</div>

            <v-currency-input
                v-if="isHousingCostInputActive"
                v-model="housingCostTmp"
                @onEnterKey="applyHousingCostInput"
            ></v-currency-input>
            <div
                @click="housingCostViewOnClick"
                v-else>
                {{ housingCostView }}
            </div>

            <v-slider
                v-model="housingCost"
                :min="minHousingCost"
                :max="maxHousingCost"
                :step="housingCostStep"
                hide-details
            >

            </v-slider>
            <div class="slider-boundaries">
                <div>{{ shortenMoneyString(minHousingCost) }}</div>
                <div>{{ shortenMoneyString(Math.round((minHousingCost + maxHousingCost) / 2 * 10) / 10) }}</div>
                <div>{{ shortenMoneyString(maxHousingCost) }}</div>
            </div>
        </div>

        <div class="initial-fee-part">
            <div>Первоначальный взнос</div>

            <v-currency-input
                v-if="isInitialFeeInputActive"
                v-model="initialFeeTmp"
                @onEnterKey="applyInitialFeeInput"
            ></v-currency-input>
            <div
                @click="initialFeeViewOnClick"
                v-else>
                {{ initialFeeView }}
            </div>

            <v-slider
                v-model="initialFee"
                :min="minInitialFee"
                :max="maxInitialFee"
                :step="initialFeeStep"
                hide-details
            >

            </v-slider>
            <div class="slider-boundaries">
                <div>{{ shortenMoneyString(minInitialFee) }}</div>
                <div>{{ shortenMoneyString(Math.round((minInitialFee + maxInitialFee) / 2 * 10) / 10) }}</div>
                <div>{{ shortenMoneyString(maxInitialFee) }}</div>
            </div>
        </div>

        <div class="credit-term-part">
            <div>Срок кредита</div>

            <v-currency-input
                v-if="isCreditTermInputActive"
                v-model="creditTermTmp"
                @onEnterKey="applyCreditTermInput"
            ></v-currency-input>
            <div
                @click="creditTermViewOnClick"
                v-else>
                {{ creditTermView }}
            </div>

            <v-slider
                v-model="creditTerm"
                :min="minCreditTerm"
                :max="maxCreditTerm"
                :step="1"
                hide-details
            >

            </v-slider>
            <div class="slider-boundaries">
                <div>{{ yearsToString(minCreditTerm) }}</div>
                <div>{{ yearsToString(Math.floor((minCreditTerm + maxCreditTerm) / 2)) }}</div>
                <div>{{ yearsToString(maxCreditTerm) }}</div>
            </div>
        </div>

        <v-btn
            rounded="lg"
            variant="outlined"
            @click="emitCalculate"
        >
            Submit
        </v-btn>
    </div>
</template>

<script lang="ts">

import ServerMock from "@/ServerMock";
import VCurrencyInput from "@/components/VCurrencyInput.vue";
import {onMounted, ref, watch} from "vue";

export default {
    name: "AnnuityCalcInput",
    components: {VCurrencyInput},
    emits: [
        'calculate'
    ],
    setup(props: any, ctx: any) {
        const creditTypes = ref([
            {
                id: 1,
                name: "Новостройка"
            },
            {
                id: 2,
                name: "Вторичный рынок"
            },
            {
                id: 3,
                name: "Покупка дома"
            },
            {
                id: 4,
                name: "Постройка дома"
            },
            {
                id: 5,
                name: "Покупка земли или дачного дома"
            },
            {
                id: 6,
                name: "Рефинансирование"
            },
            {
                id: 7,
                name: "Гараж, машино-место или кладовая"
            },
            {
                id: 8,
                name: "Наличные под залог жилья"
            },

        ]);
        const chosenCreditType = ref(1);

        const hasSalaryCard = ref(true);

        const minInterestRate = ref();
        const salaryInterestRateDif = ref();

        const isHousingCostInputActive = ref(false);
        const housingCostTmp = ref(2000000);
        const housingCost = ref(2000000);
        const minHousingCost = ref(2020000)
        const maxHousingCost = ref(10040000)
        const housingCostStep = ref(10000)
        const housingCostView = ref("");

        watch(housingCost, async (newValue: number) => {
            let response = await ServerMock.getInitialFeeData(housingCost.value);

            if (response.code === 200) {
                minInitialFee.value = response.body.minInitialFee;
                maxInitialFee.value = housingCost.value;
                initialFeeStep.value = response.body.initialFeeStep;

                if (initialFee.value > maxInitialFee.value) {
                    initialFee.value = maxInitialFee.value;
                    initialFeeTmp.value = maxInitialFee.value;
                } else if (initialFee.value < minInitialFee.value) {
                    initialFee.value = minInitialFee.value;
                    initialFeeTmp.value = minInitialFee.value;
                }

            } else {
                console.error("Couldn't get initial fee data.");
                console.error("Error message: " + response.message + ".");
            }

            housingCostView.value = moneyToString(newValue);
        })

        function housingCostViewOnClick() {
            housingCostTmp.value = housingCost.value;
            isHousingCostInputActive.value = true;
        }
        function applyHousingCostInput() {
            if (housingCostTmp.value < minHousingCost.value) {
                housingCostTmp.value = minHousingCost.value;
            } else if (housingCostTmp.value > maxHousingCost.value) {
                housingCostTmp.value = maxHousingCost.value;
            }

            housingCost.value = housingCostTmp.value;

            isHousingCostInputActive.value = false;
        }

        const isInitialFeeInputActive = ref(false);
        const initialFeeTmp = ref(2000000);
        const initialFee = ref(2000000);
        const minInitialFee = ref(2000000)
        const maxInitialFee = ref(10000000)
        const initialFeeStep = ref(10000)
        const initialFeeView = ref("");

        watch(initialFee, async (newValue: number) => {
            initialFeeView.value = moneyToString(newValue);
        })

        function initialFeeViewOnClick() {
            initialFeeTmp.value = initialFee.value;
            isInitialFeeInputActive.value = true;
        }
        function applyInitialFeeInput() {
            if (initialFeeTmp.value < minInitialFee.value) {
                initialFeeTmp.value = minInitialFee.value;
            } else if (initialFeeTmp.value > maxInitialFee.value) {
                initialFeeTmp.value = maxInitialFee.value;
            }

            initialFee.value = initialFeeTmp.value;

            isInitialFeeInputActive.value = false;
        }


        const isCreditTermInputActive = ref(false);
        const creditTermTmp = ref(1);
        const creditTerm = ref(1);
        const minCreditTerm = ref(1)
        const maxCreditTerm = ref(30)
        const creditTermView = ref("");

        watch(creditTerm, async (newValue: number) => {
            creditTermView.value = yearsToString(newValue);
        })

        function creditTermViewOnClick() {
            creditTermTmp.value = creditTerm.value;
            isCreditTermInputActive.value = true;
        }
        function applyCreditTermInput() {
            if (creditTermTmp.value < minCreditTerm.value) {
                creditTermTmp.value = minCreditTerm.value;
            } else if (creditTermTmp.value > maxCreditTerm.value) {
                creditTermTmp.value = maxCreditTerm.value;
            }

            creditTerm.value = creditTermTmp.value;

            isCreditTermInputActive.value = false;
        }


        function shortenMoneyString(money: number) {
            let resultString = "";

            if (money >= 1000000) {
                resultString = (Math.round(money / 10000) / 100).toString() + " млн ";
            } else if (money >= 1000) {
                resultString = (Math.round(money / 10) / 100).toString() + " тыс ";
            }

            resultString += "₽";

            return resultString;
        }
        function moneyToString(money: number) {
            const parts = [];
            let valueCopy = money;

            if (money === 0) {
                parts.push('0');
            } else {
                while (valueCopy > 0) {
                    let part = (valueCopy % 1000).toString();
                    if (valueCopy >= 1000) {
                        part = '0'.repeat(3 - part.length) + part;
                    }
                    parts.push(part);
                    valueCopy = Math.floor(valueCopy / 1000);
                }
            }

            let resultString = "";

            for (let i = parts.length - 1; i >= 0; i--) {
                resultString += parts[i] + " ";
            }

            resultString += "₽";
            return resultString;
        }
        function yearsToString(years: number) {
            let resultString = years.toString() + " ";

            if (years === 1) {
                resultString += "год"
            } else if (years <= 4) {
                resultString += "года"
            } else {
                if (years <= 20) {
                    resultString += "лет"
                } else {
                    if (years % 10 === 1) {
                        resultString += "год"
                    } else if (years % 10 > 0 && years % 10 <= 4) {
                        resultString += "года"
                    } else {
                        resultString += "лет"
                    }
                }
            }

            return resultString;
        }

        onMounted(async () => {
            let response = await ServerMock.getMinInterestRate(chosenCreditType.value);

            if (response.code === 200) {
                minInterestRate.value = response.body.minInterestRate;
            } else {
                console.error("Couldn't get min interest rate for credit type id: " + chosenCreditType.value + ".");
                console.error("Error message: " + response.message);
            }


            response = await ServerMock.getSalaryCardDif();

            if (response.code === 200) {
                salaryInterestRateDif.value = response.body.salaryCardDif;
            } else {
                console.error("Couldn't get salary interest rate difference.");
                console.error("Error message: " + response.message + ".");
            }


            response = await ServerMock.getHousingCostSliderData();

            if (response.code === 200) {
                minHousingCost.value = response.body.minHousingCost;
                maxHousingCost.value = response.body.maxHousingCost;
                housingCostStep.value = response.body.housingCostStep;
                housingCost.value = minHousingCost.value;
                housingCostTmp.value = minHousingCost.value;
            } else {
                console.error("Couldn't get housing cost slider data.");
                console.error("Error message: " + response.message + ".");
            }


            response = await ServerMock.getInitialFeeData(housingCost.value);

            if (response.code === 200) {
                minInitialFee.value = response.body.minInitialFee;
                maxInitialFee.value = housingCost.value;
                initialFeeStep.value = response.body.initialFeeStep;
                initialFee.value = minInitialFee.value;
                initialFeeTmp.value = minInitialFee.value;
            } else {
                console.error("Couldn't get initial fee data.");
                console.error("Error message: " + response.message + ".");
            }


            response = await ServerMock.getCreditTermData();

            if (response.code === 200) {
                minCreditTerm.value = response.body.minCreditTerm;
                maxCreditTerm.value = response.body.maxCreditTerm;
            } else {
                console.error("Couldn't get credit term data.");
                console.error("Error message: " + response.message + ".");
            }

            housingCostView.value = moneyToString(housingCost.value);
            initialFeeView.value = moneyToString(initialFee.value);
            creditTermView.value = yearsToString(creditTerm.value);
        })


        function emitCalculate() {
            ctx.emit('calculate', {
                housingCost: housingCost.value,
                initialFee: initialFee.value,
                creditTerm: creditTerm.value,
                interestRate: minInterestRate.value + ((hasSalaryCard.value) ? 1 : -1) * salaryInterestRateDif.value
            });
        }

        return {
            creditTypes,
            chosenCreditType,

            hasSalaryCard,

            isHousingCostInputActive,
            housingCostTmp,
            housingCost,
            minHousingCost,
            maxHousingCost,
            housingCostStep,
            housingCostView,
            housingCostViewOnClick,
            applyHousingCostInput,

            isInitialFeeInputActive,
            initialFeeTmp,
            initialFee,
            minInitialFee,
            maxInitialFee,
            initialFeeStep,
            initialFeeView,
            initialFeeViewOnClick,
            applyInitialFeeInput,

            isCreditTermInputActive,
            creditTermTmp,
            creditTerm,
            minCreditTerm,
            maxCreditTerm,
            creditTermView,
            creditTermViewOnClick,
            applyCreditTermInput,

            shortenMoneyString,
            yearsToString,

            emitCalculate
        }
    }
}
</script>

<style scoped lang="less">
.slider-boundaries {
    display: flex;
    justify-content: space-between;
}
</style>