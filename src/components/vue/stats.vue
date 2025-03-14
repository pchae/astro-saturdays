<script setup lang="ts">
const stats = [
    {
        id: '0',
        category: 'Revenue',
        title: '$21M+',
        desc: 'USD in Annual Recurring Revenue (ARR) for our clients',
    },
    {
        id: '1',
        category: 'Projects',
        title: '42+',
        desc: 'projects completed for Fortune 500s, startups, and SMEs',
    },
    {
        id: '2',
        category: 'Roots',
        title: '2016',
        desc: 'founded in Toronto, Canada and working with brands worldwide',
    },
    {
        id: '3',
        category: 'Experience',
        title: '23+',
        desc: 'collective years of professional experience designing and building software',
    },
]
</script>

<template>
    <section>
        <div class="mx-auto max-w-7xl px-4 lg:px-8 py-16 md:py-20 lg:py-24">
            <div>
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center text-white">
                    Our stats
                </h2>
            </div>
            <dl class="mt-16 grid grid-cols-1 gap-6 overflow-hidden sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div v-for="item in stats" :key="item.id" class="flex flex-col p-4 md:p-6 rounded-xs bg-gray-900/40 border border-gray-400/10">
                    <div class="my-4">
                        <dt class="order-first text-6xl md:text-7xl font-thin tracking-tight text-center text-green-300">
                            {{ item.title }}
                        </dt>
                        <dt class="text-base lg:text-lg font-normal text-white">
                            {{ item.desc }}
                        </dt>
                    </div>
                </div>
            </dl>
        </div>
    </section>
</template>

<style lang="scss" scoped>
</style>
