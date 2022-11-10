<template>
    <v-app theme="dark">
        <AnnuityCalcInput id="calc-input" @calculate="calculateEventHandler"/>
        <AnnuityCalculator ref="calcCore"/>
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
    setup(props: any, ctx: any) {

        const calcCore = ref();

        function calculateEventHandler() {
            calcCore.value.performCalculation();
        }

        return {
            calcCore,
            calculateEventHandler
        }
    }
});
</script>

<style scoped lang="less">


#calc-input {
    padding: 20px;
}
</style>
