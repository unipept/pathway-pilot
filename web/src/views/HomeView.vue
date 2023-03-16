<template>
    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>

    <v-row class="mt-3">
        <v-col cols="6">
            <v-card height="300" color="primary" to="/single" variant="outlined">
                <v-card-text class="center-card">
                    Compare multiple organisms
                </v-card-text>
            </v-card>
        </v-col>

        <v-col cols="6">
            <v-card height="300" color="primary" to="/multi" variant="outlined">
                <v-card-text class="center-card">
                    Compare multiple samples
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<style scoped>
.center-card {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: x-large;
}
</style>
