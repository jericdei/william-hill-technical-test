<script setup lang="ts">
import Dropdown from "primevue/dropdown"
import SelectButton from "primevue/selectbutton"
import { Ref, onMounted, ref } from "vue"
import axios, { CustomError } from "./lib/axios"
import Button from "primevue/button"
import InputText from "primevue/inputtext"
import Toast from "primevue/toast"
import { useToast } from "primevue/usetoast"
import Paginator from "primevue/paginator"
import { Joke } from "./types"
import JokeCard from "./components/JokeCard.vue"

const toast = useToast()

const options = ["Category", "Free Text"]
const mode: Ref<"Category" | "Free Text"> = ref("Category")
const categories = ref<string[]>()
const selectedCategory = ref()
const query = ref("")
const loading = ref(false)

const totalItems = ref(0)
const first = ref(0)
const perPage = ref(1)

const jokes = ref<Joke[]>([])

function showErrorToast(errorMessage: string) {
    toast.add({
        group: "br",
        severity: "error",
        summary: "An error occured!",
        detail: errorMessage,
        life: 3000,
    })
}

function handleError(error: unknown) {
    if (error instanceof CustomError) {
        console.error("Custom error occurred:", error.message)

        showErrorToast(error.message)
    } else {
        console.error("Unexpected error occurred:", error)

        showErrorToast("Unexpected error occured.")
    }
}

onMounted(async () => {
    try {
        loading.value = true

        // Get categories
        const { data } = await axios.get("/categories")

        categories.value = data.categories
    } catch (error) {
        handleError(error)
    } finally {
        loading.value = false
    }
})

async function submit() {
    try {
        loading.value = true

        if (mode.value === "Category") {
            const { data } = await axios.get("/jokes/random", {
                params: {
                    category: selectedCategory.value,
                },
            })

            jokes.value = [data]
        } else if (mode.value === "Free Text") {
            if (!query.value) {
                showErrorToast("Search value cannot be blank.")

                return
            }

            const { data } = await axios.get("/jokes/search", {
                params: {
                    query: query.value,
                },
            })

            jokes.value = data.result
            totalItems.value = data.total

            // Reset pagination to beginning
            first.value = 0
        }
    } catch (error) {
        handleError(error)
    } finally {
        loading.value = false
    }
}

function reset() {
    jokes.value = []
    totalItems.value = 0
}
</script>

<template>
    <div class="grid h-screen w-screen place-items-center p-4">
        <Toast
            position="bottom-right"
            group="br"
        />

        <div class="rounded-xl border-slate-400 p-4 sm:border md:w-3/4 lg:w-1/2">
            <h1 class="text-center text-2xl font-bold">Chuck Norris Jokes</h1>

            <SelectButton
                v-model="mode"
                class="mt-8 flex justify-center"
                :options="options"
                @change="reset"
            />

            <div class="mt-16 flex flex-wrap items-center justify-center gap-4">
                <div class="flex items-center justify-center gap-4">
                    <label>{{ mode }}: </label>

                    <Dropdown
                        v-if="mode === 'Category'"
                        v-model="selectedCategory"
                        class="h-full w-full"
                        :options="categories"
                        placeholder="Choose"
                        show-clear
                    >
                        <template #option="{ option }">
                            <span class="capitalize">{{ option }}</span>
                        </template>

                        <template #value="{ value, placeholder }">
                            <span v-if="!value">{{ placeholder }}</span>

                            <span
                                v-else
                                class="capitalize"
                                >{{ value }}</span
                            >
                        </template>
                    </Dropdown>

                    <InputText
                        v-model="query"
                        v-else-if="mode === 'Free Text'"
                        class="w-full"
                        placeholder="Type here.."
                    />
                </div>

                <Button
                    label="Search"
                    @click="submit"
                    :loading="loading"
                />
            </div>

            <div
                v-if="mode === 'Free Text'"
                class="mt-16"
            >
                <div
                    v-if="jokes?.length === 0"
                    class="p-4"
                >
                    <p class="text-center">No jokes found.</p>
                </div>

                <div v-else>
                    <div class="max-h-96 space-y-4 overflow-y-auto">
                        <div v-for="joke in jokes?.slice(first, first + perPage)">
                            <JokeCard
                                :joke="joke"
                                class="flex flex-col gap-2 rounded-xl border border-slate-300 p-4"
                            />
                        </div>
                    </div>

                    <div class="mt-4">
                        <Paginator
                            v-model:first="first"
                            v-model:rows="perPage"
                            :total-records="totalItems"
                            :template="{
                                '640px': 'PrevPageLink CurrentPageReport NextPageLink',
                                '960px':
                                    'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown',
                                '1300px':
                                    'FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown',
                                default:
                                    'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown',
                            }"
                            current-page-report-template="{first} to {last} of {totalRecords}"
                            :rows-per-page-options="[1, 5, 10, 15, totalItems]"
                        />
                    </div>
                </div>
            </div>

            <div
                v-else
                class="mt-16"
            >
                <JokeCard
                    v-if="jokes.length === 1"
                    :joke="jokes[0]"
                    class="flex flex-col gap-2 rounded-xl border border-slate-300 p-4"
                />
            </div>
        </div>
    </div>
</template>
