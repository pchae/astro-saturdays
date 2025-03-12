<script setup lang="ts">
</script>

<template>
    <section>
        <div class="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
            <div class="relative z-20 bg-black/40 border b-1 border-gray-400/10 shadow-2xl px-6 py-24 text-center rounded-3xl">
                <div id="tag" class="mx-auto pb-10">
                    <h2 class="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                        Let's talk today and design tomorrow.
                    </h2>
                </div>
                <div class="flex items-center justify-center">
                    <UButton
                        type="button"
                        label="button"
                        color="secondary"
                        variant="outline"
                        size="xl"
                        to="mailto:hello@saturdays.io"
                        rel="noreferrer"
                        target="_blank"
                        class="font-bold text-xl rounded-full border-2 px-10 py-4"
                    >
                        Get in touch
                    </UButton>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
</style>
