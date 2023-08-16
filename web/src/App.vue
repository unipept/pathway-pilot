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
                        Pathway Pilot
                    </router-link>
                </h2>
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
