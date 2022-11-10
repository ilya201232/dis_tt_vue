<template>
    <div class="calc-input">
        <v-container class="">
            <v-row>
                <v-col>
                    <v-sheet
                        class="pa-5 border-lg sheet-border"
                        rounded="xl"
                    >
                        <v-select
                            label='Цель кредита'
                            v-model="chosenCreditType"
                            :items="creditTypes"
                            item-title="label"
                            item-value="id"
                        >
                            <template v-slot:item="{ item, props }">
                                <v-list-item v-on:click="props.onClick" value="{{ props.value }}">
                                    <v-list-item-title>
                                        <v-row no-gutters align="center">
                                            <v-tooltip
                                                location="top"

                                            >
                                                <template v-slot:activator="{ props }">
                                                    <v-icon
                                                        icon="mdi-help-circle-outline"
                                                        v-bind="props"
                                                        class="descr-icon"
                                                    >
                                                    </v-icon>
                                                </template>
                                                <span class="tooltip-text">
                                                    {{ item.raw.description }}
                                                </span>
                                            </v-tooltip>

                                            <span class="item-title">{{ item.title }}</span>
                                            <v-spacer></v-spacer>
                                            <span>{{ item.raw.interestRate + "%" }}</span>
                                        </v-row>
                                    </v-list-item-title>
                                </v-list-item>
                            </template>
                        </v-select>

                        <v-switch
                            v-model="hasSalaryCard"
                            inset
                            label="Есть заработная карта"
                            color="green"
                        ></v-switch>

                        <div class="parameters">
                            <div class="text-h4">
                                Параметры
                            </div>

                            <div id="housing-cost-part" class="parameter">
                                <div>Стоимость жилья</div>

                                <v-currency-input
                                    v-if="isHousingCostInputActive"
                                    v-model="housingCostTmp"
                                    @onFocusLoose="closeAllInputs"
                                    @onEnterKey="applyHousingCostInput"
                                ></v-currency-input>
                                <div
                                    @click="housingCostViewOnClick"
                                    class="text-h5 to-be-input-field"
                                    v-else>
                                    {{ housingCostView }}
                                </div>

                                <div class="slider-part">
                                    <v-slider
                                        v-model="housingCost"
                                        :min="minHousingCost"
                                        :max="maxHousingCost"
                                        :step="housingCostStep"
                                        hide-details
                                    />
                                    <div class="slider-boundaries">
                                        <div>{{ shortenMoneyString(minHousingCost) }}</div>
                                        <div>{{
                                                shortenMoneyString(Math.round((minHousingCost + maxHousingCost) / 2 * 10) / 10)
                                            }}
                                        </div>
                                        <div>{{ shortenMoneyString(maxHousingCost) }}</div>
                                    </div>
                                </div>

                            </div>

                            <div id="initial-fee-part" class="parameter">
                                <div>Первоначальный взнос</div>

                                <v-currency-input
                                    v-if="isInitialFeeInputActive"
                                    v-model="initialFeeTmp"
                                    @onFocusLoose="closeAllInputs"
                                    @onEnterKey="applyInitialFeeInput"
                                ></v-currency-input>
                                <div
                                    @click="initialFeeViewOnClick"
                                    class="text-h5 to-be-input-field"
                                    v-else>
                                    {{ initialFeeView }}
                                </div>

                                <div class="slider-part">
                                    <v-slider
                                        v-model="initialFee"
                                        :min="minInitialFee"
                                        :max="maxInitialFee"
                                        :step="initialFeeStep"
                                        hide-details
                                    />
                                    <div class="slider-boundaries">
                                        <div>{{ shortenMoneyString(minInitialFee) }}</div>
                                        <div>{{
                                                shortenMoneyString(Math.round((minInitialFee + maxInitialFee) / 2 * 10) / 10)
                                            }}
                                        </div>
                                        <div>{{ shortenMoneyString(maxInitialFee) }}</div>
                                    </div>
                                </div>

                            </div>

                            <div id="credit-term-part" class="parameter">
                                <div>Срок кредита</div>

                                <v-currency-input
                                    v-if="isCreditTermInputActive"
                                    v-model="creditTermTmp"
                                    @onFocusLoose="closeAllInputs"
                                    @onEnterKey="applyCreditTermInput"
                                ></v-currency-input>
                                <div
                                    @click="creditTermViewOnClick"
                                    class="text-h5 to-be-input-field"
                                    v-else>
                                    {{ creditTermView }}
                                </div>

                                <div class="slider-part">
                                    <v-slider
                                        v-model="creditTerm"
                                        :min="minCreditTerm"
                                        :max="maxCreditTerm"
                                        :step="1"
                                        hide-details
                                    />
                                    <div class="slider-boundaries">
                                        <div>{{ yearsToString(minCreditTerm) }}</div>
                                        <div>{{ yearsToString(Math.floor((minCreditTerm + maxCreditTerm) / 2)) }}</div>
                                        <div>{{ yearsToString(maxCreditTerm) }}</div>
                                    </div>
                                </div>

                            </div>
                        </div>


                    </v-sheet>
                </v-col>
                <v-col class="info-col">
                    <v-sheet
                        class="pa-8 border-lg sheet-border info-sheet"
                        :class="{
                            'valid-error-border': isValid === -1
                        }"
                        rounded="xl"
                    >
                        <div class="properties">
                            <div class="property">
                                <div class="property-name text-subtitle-1">
                                    Процентная ставка
                                </div>
                                <div class="property-value text-h3">
                                    {{ interestRate + "%" }}
                                </div>
                            </div>

                            <div class="property">
                                <div class="property-name text-subtitle-1">
                                    Ежемесячный платеж
                                </div>
                                <div class="property-value text-h3">
                                    {{ moneyToString(Math.round(fixedPayment)) }}
                                </div>
                            </div>

                            <div class="property">
                                <div class="property-name text-subtitle-1">
                                    Сумма кредита
                                </div>
                                <div class="property-value text-h3">
                                    {{ moneyToString(Math.round((housingCost - initialFee) * 100) / 100) }}
                                </div>
                                <div class="valid-error-msg text-subtitle-2" :class="{ hidden: isValid !== -1 }">
                                    Сумма кредита не может быть меньше {{ moneyToString(minCreditSum) }}
                                </div>
                            </div>

                            <div class="property">
                                <div class="property-name text-subtitle-1">
                                    Срок кредита
                                </div>
                                <div class="property-value text-h3">
                                    {{ creditTermView }}
                                </div>
                            </div>
                        </div>

                        <v-btn
                            type="submit"
                            rounded="lg"
                            variant="outlined"
                            @click="handleSubmission"
                        >
                            Submit
                        </v-btn>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>


    </div>
</template>

<script lang="ts">

import ServerMock from "@/ServerMock";
import VCurrencyInput from "@/components/VCurrencyInput.vue";
import {onMounted, reactive, ref, watch} from "vue";
import {useStore} from "@/store";

export default {
    name: "AnnuityCalcInput",
    components: {VCurrencyInput},
    emits: [
        'calculate',
        'precalculate_payment'
    ],
    setup(props: any, ctx: any) {

        // ################### Credit type ####################

        // Storing all the credit types available for usage
        const creditTypes = ref<[{
            id: number,
            label: string,
            description: string,
            interestRate: number
        }?]>([]);
        // Chosen credit type (its id)
        const chosenCreditType = ref(1);
        // Stores current minimal interest rate for easy access
        const minInterestRate = ref();

        // Gets current min interest rate from current chosen credit type
        function getCurrentMinInterestRate() {
            for (const creditType of creditTypes.value) {
                if (creditType!.id === chosenCreditType.value) {
                    minInterestRate.value = creditType!.interestRate;
                    break;
                }
            }
        }

        // Watching for any changes in chosen credit type
        watch(chosenCreditType, async () => {

            // Resetting validation
            if (isValid.value !== 0) {
                isValid.value = 0;
            }

            // Updating minimal interest rate and recalculating total rate.
            getCurrentMinInterestRate();
            recalculateInterestRate();

            // Emitting event to ask core to recalculate payment
            ctx.emit('precalculate_payment');
        })

        // ################### Salary card ####################

        // Controls if user has salary card
        const hasSalaryCard = ref(true);
        // Stores salary interest rate delta param
        const salaryInterestRateDif = ref();

        // Watching for any changes in hasSalaryCard variable
        watch(hasSalaryCard, () => {

            // Resetting validation
            if (isValid.value !== 0) {
                isValid.value = 0;
            }

            // Recalculating total interest rate.
            recalculateInterestRate();

            // Emitting event to ask core to recalculate payment
            ctx.emit('precalculate_payment');
        })

        // ################### Interest rate ####################

        // Reference to store's interest rate (to be able to edit it here)
        const interestRate = reactive(useStore().interestRate);

        // Recalculates interest rate
        function recalculateInterestRate() {
            interestRate.value = Math.round(
                (minInterestRate.value + ((hasSalaryCard.value) ? 1 : -1) * salaryInterestRateDif.value) * 100
            ) / 100;
        }

        // ################### Housing cost ####################

        // Controls input visibility
        const isHousingCostInputActive = ref(false);
        // Temp variable for input (to be able to perform modification after it was applied)
        const housingCostTmp = ref(2000000);
        // Main variable for housing input. It's reference from store.
        const housingCost = reactive(useStore().housingCost)
        // Min, Max and Step values for slider
        const minHousingCost = ref(2020000)
        const maxHousingCost = ref(10040000)
        const housingCostStep = ref(10000)
        // String variable for text representation
        const housingCostView = ref("");

        // Watching for any changes in housingCost variable
        watch(housingCost, async (newValue: number) => {

            // Resetting validation
            if (isValid.value !== 0) {
                isValid.value = 0;
            }

            // Getting new slider data (Min, Max, Step)
            let response = await ServerMock.getInitialFeeData(housingCost.value);

            if (response.code === 200) {
                minInitialFee.value = response.body.minInitialFee;
                maxInitialFee.value = housingCost.value;
                initialFeeStep.value = response.body.initialFeeStep;

                // If current value is out of new borders - adjusting it
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

            // Recreating view string
            housingCostView.value = moneyToString(newValue);

            // Emitting event to ask core to recalculate payment
            ctx.emit('precalculate_payment');
        })

        // Showing housingCost input field
        function housingCostViewOnClick() {
            // Updating input's variable
            housingCostTmp.value = housingCost.value;
            isHousingCostInputActive.value = true;
        }

        // Applying housingCost input's data
        function applyHousingCostInput() {

            // Adjusting new value to the slider's range if needed
            if (housingCostTmp.value < minHousingCost.value) {
                housingCostTmp.value = minHousingCost.value;
            } else if (housingCostTmp.value > maxHousingCost.value) {
                housingCostTmp.value = maxHousingCost.value;
            }

            // Applying new value
            housingCost.value = housingCostTmp.value;

            // Closing input field
            isHousingCostInputActive.value = false;
        }

        // ################### Initial fee ####################

        // Controls input visibility
        const isInitialFeeInputActive = ref(false);
        // Temp variable for input (to be able to perform modification after it was applied)
        const initialFeeTmp = ref(2000000);
        // Main variable for initial fee. It's reference from store.
        const initialFee = reactive(useStore().initialFee)
        // Min, Max and Step values for slider
        const minInitialFee = ref(2000000)
        const maxInitialFee = ref(10000000)
        const initialFeeStep = ref(10000)
        // String variable for text representation
        const initialFeeView = ref("");

        // Watching for any changes in initialFee variable
        watch(initialFee, async (newValue: number) => {

            // Resetting validation
            if (isValid.value !== 0) {
                isValid.value = 0;
            }

            // Recreating view string
            initialFeeView.value = moneyToString(newValue);

            // Emitting event to ask core to recalculate payment
            ctx.emit('precalculate_payment');
        })

        // Showing housingCost input field
        function initialFeeViewOnClick() {
            // Updating input's variable
            initialFeeTmp.value = initialFee.value;
            isInitialFeeInputActive.value = true;
        }

        // Applying housingCost input's data
        function applyInitialFeeInput() {
            // Adjusting new value to the slider's range if needed
            if (initialFeeTmp.value < minInitialFee.value) {
                initialFeeTmp.value = minInitialFee.value;
            } else if (initialFeeTmp.value > maxInitialFee.value) {
                initialFeeTmp.value = maxInitialFee.value;
            }

            // Applying new value
            initialFee.value = initialFeeTmp.value;

            // Closing input field
            isInitialFeeInputActive.value = false;
        }

        // ################### Credit term ####################

        // Controls input visibility
        const isCreditTermInputActive = ref(false);
        // Temp variable for input (to be able to perform modification after it was applied)
        const creditTermTmp = ref(1);
        // Main variable for credit term. It's reference from store.
        const creditTerm = reactive(useStore().creditTerm)
        // Min, Max values for slider (Step is always 1)
        const minCreditTerm = ref(1)
        const maxCreditTerm = ref(30)
        // String variable for text representation
        const creditTermView = ref("");

        // Watching for any changes in creditTerm variable
        watch(creditTerm, async (newValue: number) => {

            // Resetting validation
            if (isValid.value !== 0) {
                isValid.value = 0;
            }

            // Recreating view string
            creditTermView.value = yearsToString(newValue);

            // Emitting event to ask core to recalculate payment
            ctx.emit('precalculate_payment');
        })

        // Showing housingCost input field
        function creditTermViewOnClick() {
            // Updating input's variable
            creditTermTmp.value = creditTerm.value;
            isCreditTermInputActive.value = true;
        }

        // Applying housingCost input's data
        function applyCreditTermInput() {
            // Adjusting new value to the slider's range if needed
            if (creditTermTmp.value < minCreditTerm.value) {
                creditTermTmp.value = minCreditTerm.value;
            } else if (creditTermTmp.value > maxCreditTerm.value) {
                creditTermTmp.value = maxCreditTerm.value;
            }

            // Applying new value
            creditTerm.value = creditTermTmp.value;

            // Closing input field
            isCreditTermInputActive.value = false;
        }

        // @@@@@@@@@@@@@@@@ On Mounted @@@@@@@@@@@@@@@@

        onMounted(async () => {

            // Getting info about minimum credit sum
            let response = await ServerMock.getMinCreditSum();

            if (response.code === 200) {
                minCreditSum.value = response.body.minCreditSum;
            } else {
                console.error("Couldn't get min credit sum.");
                console.error("Error message: " + response.message);
            }

            // Getting info about all credit types
            response = await ServerMock.getCreditTypes();

            if (response.code === 200) {
                creditTypes.value = response.body.minInterestRates;

                getCurrentMinInterestRate();

                recalculateInterestRate();
            } else {
                console.error("Couldn't get min interest rate for credit type id: " + chosenCreditType.value + ".");
                console.error("Error message: " + response.message);
            }

            // Getting info about interest rate delta of salary card
            response = await ServerMock.getSalaryCardDif();

            if (response.code === 200) {
                salaryInterestRateDif.value = response.body.salaryCardDif;
            } else {
                console.error("Couldn't get salary interest rate difference.");
                console.error("Error message: " + response.message + ".");
            }

            recalculateInterestRate();

            // Getting slider data of housing cost parameter
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


            // Getting slider data of initial fee parameter
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

            // Getting slider data of credit term parameter
            response = await ServerMock.getCreditTermData();

            if (response.code === 200) {
                minCreditTerm.value = response.body.minCreditTerm;
                maxCreditTerm.value = response.body.maxCreditTerm;
            } else {
                console.error("Couldn't get credit term data.");
                console.error("Error message: " + response.message + ".");
            }

            // Precalculating payment amount
            ctx.emit('precalculate_payment');

            // Creating view representations
            housingCostView.value = moneyToString(housingCost.value);
            initialFeeView.value = moneyToString(initialFee.value);
            creditTermView.value = yearsToString(creditTerm.value);
        })

        // ################### Validation and Form submission ####################

        // Controls validation status:
        // -1: Not valid
        //  0: To be validated
        //  1: Valid
        const isValid = ref(0);

        // Handles submission event and performs validation
        function handleSubmission() {
            console.log("Submission happened!");

            if (validate()) {
                isValid.value = 1;
                emitCalculate();
            } else {
                isValid.value = -1;
            }
        }

        // Main validation method
        function validate(): boolean {
            return housingCost.value - initialFee.value >= minCreditSum.value;
        }

        // Emits event that tells core to start calculating and show results afterwards
        function emitCalculate() {
            ctx.emit('calculate');
        }

        // ################### Data to string methods ####################

        // Creates short money string
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

        // Created money string with gaps after every 3 symbols
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

        // Creates year string
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

        // ################### ELSE ####################

        // Stores minimum credit sum allowed
        const minCreditSum = ref(0);

        // Reference to credit payment amount that calculates at core
        const fixedPayment = reactive(useStore().fixedPayment);

        // Closes all input fields
        function closeAllInputs() {
            isHousingCostInputActive.value = false;
            isInitialFeeInputActive.value = false;
            isCreditTermInputActive.value = false;
        }

        return {
            moneyToString,
            closeAllInputs,

            creditTypes,
            chosenCreditType,

            hasSalaryCard,

            interestRate,

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

            fixedPayment,

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

            handleSubmission,
            isValid,

            minCreditSum
        }
    }
}
</script>

<style scoped lang="scss">

.tooltip-text {
    color: black !important;
}

.v-overlay__content {
    font-size: 50px !important;
    opacity: 1 !important;
    display: block !important;
}

.slider-boundaries {
    display: flex;
    justify-content: space-between;
}

.sheet-border {
    border-color: #4b3572 !important;
}

.valid-error-border {
    border-color: #723535 !important;
}

.properties {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20px
}

.property {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0 48px 0 0;
}

.valid-error-msg {
    color: #c22121;
}

.hidden {
    display: none;
}

.descr-icon {
    margin-right: 16px;
}

.item-title {
    margin-right: 16px;
}

.info-sheet {
    position: sticky;
    top: 70px;

    display: flex;
    flex-direction: column;
    gap: 40px
}

.parameters {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.parameter {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.to-be-input-field {
    cursor: pointer;

    &:hover {
        color: #1be8c8;
    }
}

</style>