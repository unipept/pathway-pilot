<template>
    <div>
        <v-radio
            :label="label" 
            :value="value"
        >
            <template #label>
                <div class="radio-button">
                    {{ label }}
                </div>
            </template>
        </v-radio>
        <div class="radio-subtitle">
            {{ subtitle }}
        </div>
    </div>
</template>

<script setup lang="ts">
export interface Props {
    label: any
    value: any
    subtitle: string
}

const props = defineProps<Props>();
</script>

<style scoped>
:deep(.v-label) {
    font-size: 16px !important;
    opacity: 1;
}

.radio-subtitle {
    font-size: small;
    color: #7a7a7a;
    margin-left: 40px;
    margin-top: -8px;
}
</style>
