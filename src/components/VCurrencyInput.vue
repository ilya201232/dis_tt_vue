<template>
    <v-text-field

        v-on:keyup.enter="onEnterHandler"
        :autofocus="true"
        v-model="innerData"
        @input="inputHandler"
        @update:focused="onFocusChangeHandler"
        :rules="[
        () => !!innerData || 'This field required',
        () => !!innerData && !isNaN(Number(innerData)) || 'Only numbers are allowed',
        () => !!innerData && !isNaN(Number(innerData)) && Number(innerData) > 0 || 'Only positive value allowed'
      ]"
        maxlength="15"
    ></v-text-field>
</template>

<script lang="ts">
import {ref} from "vue";

export default {
    name: "VCurrencyInput",
    props: ['modelValue'],
    emits: [
        'update:modelValue',
        'onEnterKey',
        'onFocusLoose'
    ],
    setup(props: any, ctx: any) {

        const data = ref(props.modelValue);
        const innerData = ref(props.modelValue);

        function onEnterHandler() {
            ctx.emit('onEnterKey');
        }

        function onFocusChangeHandler(focus: boolean) {
            if (!focus)
                ctx.emit('onFocusLoose');
        }

        function inputHandler() {
            const value = innerData.value;

            if (!isNaN(+value) && value !== "" && +value > 0) {
                data.value = +value;
                innerData.value = data.value;
            }

            ctx.emit('update:modelValue', data.value);
        }

        return {
            data,
            innerData,
            onEnterHandler,
            inputHandler,
            onFocusChangeHandler
        }
    }
}
</script>

<style scoped>

</style>