<script setup lang="ts">
import { Joke } from "../types"

defineProps<{
    joke: Joke
}>()
</script>

<template>
    <div class="flex flex-col gap-2 rounded-xl border border-slate-300 p-4">
        <small>{{ new Date(joke.created_at).toLocaleString() }}</small>
        <p>{{ joke.value }}</p>
        <small class="text-right">Joke Page</small>
    </div>
</template>
