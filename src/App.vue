<template>
    <v-app theme="dark">
        <v-app-bar>
            <v-container
                class="fill-height d-flex align-center app-bar-container"
            >
                <v-icon
                    icon="mdi-calculator-variant-outline"
                    size="x-large"
                    color="white"
                />

                <div class="text-h5">
                    Ипотечный Калькулятор
                </div>
            </v-container>
        </v-app-bar>
        <v-main>
            <AnnuityCalcInput id="calc-input" @calculate="calculateEventHandler" @precalculate_payment="precalculateEventHandler"/>
            <AnnuityCalculator ref="calcCore"/>
        </v-main>

    </v-app>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import AnnuityCalcInput from "@/components/AnnuityCalcInput.vue";
import AnnuityCalculator from "@/components/AnnuityCalculator.vue";

export default defineComponent({
    name: 'App',
    components: {
        AnnuityCalculator,
        AnnuityCalcInput,
    },
    setup() {

        const calcCore = ref();

        function calculateEventHandler() {
            calcCore.value.performCalculation();
        }

        function precalculateEventHandler() {
            calcCore.value.precalculate();
        }

        return {
            calcCore,
            calculateEventHandler,
            precalculateEventHandler
        }
    }
});
</script>

<style scoped lang="less">


#calc-input {
    padding: 20px;
}

.app-bar-container {
    gap: 20px;
}
</style>
