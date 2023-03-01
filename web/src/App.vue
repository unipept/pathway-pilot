<template>
    <v-app>
        <v-toolbar
            app
            color="primary"
            dark
            hide-on-scroll
            class="px-lg-16"
        >
            <v-container>
                <router-link to="/" class="homepage-title">
                    <h1>Van 't pathje</h1>
                </router-link>

                <v-spacer />
            </v-container>
        </v-toolbar>

        <v-content>
            <v-container>
                <router-view></router-view>
            </v-container>
        </v-content>
    </v-app>
</template>

<style>
.homepage-title {
    color: white !important;
    text-decoration: none;
}
</style>
