<template>
    <v-container>
        <p class="mb-5 text-justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <file-input />

        <v-btn class="mt-5 float-right" color="primary" @click="() => onContinue($router)" >
            Continue
        </v-btn>

        <v-btn class="me-5 mt-5 float-right" color="error" @click="() => fileStore.clear()">
            <v-icon class="me-2">mdi-delete-outline</v-icon> Clear file
        </v-btn>
    </v-container>
</template>

<script lang="ts" setup>
import FileInput from '@/components/inputs/FileInput.vue';
import useFileStore from '@/stores/FileStore';
import {Router} from "vue-router";

const fileStore = useFileStore();

const onContinue = async (router: Router) => {
    await fileStore.parse();
    await router.push("/selection");
};
</script>
