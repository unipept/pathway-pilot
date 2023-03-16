<template>
    <v-app>
        <v-app-bar
            app
            dark
            color="primary"
            hide-on-scroll
        >
            <v-container class="d-flex">
                <h2 class="mr-5">
                    <router-link to="/" class="homepage-title">
                        Van 't pathje
                    </router-link>
                </h2>

                <router-link class="app-bar-item" to="/single" v-slot="{ href, navigate }">
                    <v-btn @click="navigate" :href="href">
                        Compare organisms
                    </v-btn>
                </router-link>

                <router-link class="app-bar-item" to="/multi" v-slot="{ href, navigate }">
                    <v-btn @click="navigate" :href="href">
                        Compare samples
                    </v-btn>
                </router-link>
            </v-container>
        </v-app-bar>

        <v-content>
            <v-container class="mt-15">
                <router-view></router-view>
            </v-container>
        </v-content>
    </v-app>
</template>

<style scoped>
.homepage-title {
    color: white !important;
    text-decoration: none;
}

.app-bar-item {
    text-decoration: none;
    color: white;
}
</style>
