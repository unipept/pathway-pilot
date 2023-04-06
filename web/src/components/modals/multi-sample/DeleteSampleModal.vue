<template>
    <v-dialog
        v-model="dialogOpen"
        @click:outside="onClickOutside"
        max-width="60%"
        width="auto"
    >
        <v-card class="pa-3" flat>
            <error-alert>
                You are about to delete sample: {{ name }}. This action cannot be undone. Are you sure you want to continue?
            </error-alert>

            <div class="d-flex justify-end mt-3">
                <v-btn class="ms-3" color="primary" variant="outlined" @click="onClickOutside">
                    Cancel
                </v-btn>

                <v-btn class="ms-3" color="error" @click="onRemove">
                    Delete sample
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import ErrorAlert from '@/components/alerts/ErrorAlert.vue';
import { ref, watch } from 'vue';

export interface Props {
    modelValue: boolean

    index: number
    name: string
}

const props = defineProps<Props>();

const emits = defineEmits(['update:model-value', 'remove']);

const dialogOpen = ref<boolean>(props.modelValue);

const onClickOutside = () => {
    emits('update:model-value', false);
};

const onRemove = () => {
    emits('remove', props.index);
    emits('update:model-value', false);
};

watch(() => props.modelValue, (value) => {
    dialogOpen.value = value;
});
</script>
