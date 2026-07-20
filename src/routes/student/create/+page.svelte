<script lang="ts">
    import {
        FetcherWithDefaultClientSettings,
        StudentFetcher,
    } from "$lib/fetchers";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    let name = $state("");
    let client_id = $state(0);
    let active = $state(false);

    async function create_student() {
        const studentFetcher = FetcherWithDefaultClientSettings(StudentFetcher);

        const result = await studentFetcher.Create({
            body: {
                name,
                client_id,
                active,
            },
        });

        if ("error" in result) {
            console.error(result.message);
        } else {
            window.location.href = `/student/${result.id}`;
        }
    }
</script>

<div class="flex flex-col">
    <label>
        Name
        <input type="text" bind:value={name} />
    </label>
    <label>
        Client
        <select bind:value={client_id}>
            {#each data.clients as client}
                <option value={client.id}>{client.name}</option>
            {/each}
        </select>
    </label>
    <label>
        Active
        <input
            name="active"
            type="checkbox"
            class="ml-4"
            bind:checked={active}
        />
    </label>
    <button onclick={create_student} class="bg-blue-900 text-white">Add</button>
</div>
