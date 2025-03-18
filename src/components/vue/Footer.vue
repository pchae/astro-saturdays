<script setup lang="ts" scoped>
const navigation = [
    {
        id: '0',
        title: 'Company',
        links: [
            { name: 'Home', to: '/' },
            { name: 'About', to: '/about' },
        ],
    },
    {
        id: '1',
        title: 'Solutions',
        links: [
            { name: 'Client Login', to: '/login' },
            { name: 'Products', to: '/login' },
        ],
    },
    {
        id: '2',
        title: 'Connect',
        links: [
            { name: 'LinkedIn', to: 'https://www.linkedin.com/company/saturdaysdotio/' },
            { name: 'GitHub', to: 'https://github.com/saturdaysio' },
        ],
    },
    {
        id: '3',
        title: 'Legal',
        links: [
            { name: 'Terms of Service', to: '/terms-of-service' },
            { name: 'Privacy Policy', to: '/privacy-policy' },
        ],
    },
]

const currentYear = new Date().getFullYear()

const copyright = 'Saturdays.io Inc. All rights reserved.'
</script>

<template>
    <footer class="border-t border-gray-400/20">
        <nav aria-label="Footer" class="mx-auto max-w-(--breakpoint-xl) px-4 py-12 sm:px-6 sm:py-16">
            <div class="footerGrid grid grid-cols-1 xs:grid-cols-2 md:grid-cols-6 gap-8">
                <div id="logo" class="col-span-2 mb-8">
                    <NuxtLink to="/" class="flex items-center space-x-3">
                        <img class="h-8 w-8" src="@/assets/icons/logo.svg" alt="Saturdays.io logo" width="32px" height="32px">
                    </NuxtLink>
                </div>

                <div v-for="item in navigation" :key="item.id" class="footerCol w-full col-span-2 xs:col-span-1">
                    <h2 class="text-sm font-semibold text-white uppercase pb-4">
                        {{ item.title }}
                    </h2>
                    <ul>
                        <li v-for="(link, index) in item.links" :key="index" class="mb-4">
                            <suspense suspensible>
                                <NuxtLink :to="link.to" class="text-md sm:text-base leading-6 no-underline text-gray-600 hover:text-white" active-class="active">
                                    {{ link.name }}
                                </NuxtLink>
                            </suspense>
                        </li>
                    </ul>
                </div>
            </div>

            <hr class="mx-auto my-6 lg:my-8 border-gray-400/20">

            <div id="copyright">
                <span class="text-md sm:text-base leading-5 text-white">
                    © 2016 - {{ currentYear }} {{ copyright }}
                </span>
            </div>
        </nav>
    </footer>
</template>

<style lang="scss" scoped>
</style>
