<template>
    <v-app theme="dark">
        <AnnuityCalcInput id="calc-input" @calculate="calculateEventHandler"/>
    </v-app>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import AnnuityCalcInput from "@/components/AnnuityCalcInput.vue";

export default defineComponent({
    name: 'App',
    components: {
        AnnuityCalcInput,
    },
    setup(ctx: any) {
        function calculateEventHandler(data: { housingCost: number, initialFee: number, creditTerm: number, interestRate: number }) {
            console.log(data);
        }

        return {
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
