<template>
    <v-dialog
        v-model="dialogOpen"
        @click:outside="onClickOutside"
        max-width="600px"
    >
        <v-card color="#ffa3a3">
            <error-alert>
                <div class="d-flex">
                    <p v-if="errors.length === 1">Your input data contains <b>1</b> error. Please fix this error in order to continue.</p>
                    <p v-else>Your input data contains a total of <b>{{ errors.length }}</b> errors. Please fix these errors in order to continue.</p>
                    <v-icon class="ms-3" @click="onClickOutside">mdi-close</v-icon>
                </div>
                <div class="mt-3 overflow-container">
                    <div v-for="error of errors">
                        <b>line {{ error.line }}</b>: {{ error.message }}.
                    </div>
                </div>
            </error-alert>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import VerifierError from '@/logic/verifiers/VerifierError';
import { ref, watch } from 'vue';
import ErrorAlert from '../alerts/ErrorAlert.vue';

export interface Props {
    modelValue: VerifierError[];
}

const props = defineProps<Props>();

const emits = defineEmits(['update:model-value']);

const errors = ref<VerifierError[]>(props.modelValue);
const dialogOpen = ref<boolean>(props.modelValue.length > 0);

const onClickOutside = () => {
    emits('update:model-value', []);
};

watch(() => props.modelValue, (value) => {
    errors.value = value;
    dialogOpen.value = value.length > 0;
});
</script>

<style scoped>
.overflow-container {
    overflow: scroll;
    max-height: 250px;
}
</style>
