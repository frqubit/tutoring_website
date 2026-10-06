<script lang="ts">
    import type { PageProps } from "./$types";
    import {
        SessionFetcher,
        FetcherWithDefaultClientSettings,
    } from "$lib/fetchers";
    import { toLocalISOString } from "$lib";

    let { data }: PageProps = $props();

    let student_id = $state(0);
    let date = $state(toLocalISOString(new Date()).slice(0, 19));
    let minutes = $state("");
    let every = $state("");

    async function create_event() {
        const sessionFetcher = FetcherWithDefaultClientSettings(SessionFetcher);

        const response = await sessionFetcher.Create({
            body: {
                student_id,
                date: new Date(Date.parse(toLocalISOString(new Date(date)))),
                minutes: +minutes,
                every: +every,
                ends: undefined,
            },
        });

        if ("error" in response) {
            console.error(response.message);
        } else {
            window.location.href = `/calendar`;
        }
    }
</script>

<div class="flex flex-col">
    <label>
        Student
        <select name="student_id" bind:value={student_id}>
            {#each data.students as student}
                <option value={student.id}>{student.name}</option>
            {/each}
        </select>
    </label>
    <label>
        Date
        <input bind:value={date} name="date" type="datetime-local" />
    </label>
    <label>
        Minutes
        <input bind:value={minutes} name="minutes" type="text" />
    </label>
    <label>
        Every Week(s)
        <input bind:value={every} name="every" type="text" />
    </label>
    <button class="bg-blue-900 text-white" onclick={create_event}>Add</button>
</div>
