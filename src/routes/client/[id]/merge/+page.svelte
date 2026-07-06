<script lang="ts">
    import {
        ClientFetcher,
        FetcherWithDefaultClientSettings,
    } from "$lib/fetchers";
    import type { PageProps } from "./$types";

    let { data, params }: PageProps = $props();

    let merge_into_id = $state(0);

    async function apply_merge() {
        const clientFetcher = FetcherWithDefaultClientSettings(ClientFetcher);

        const result = await clientFetcher.MergeInto([
            +params.id,
            merge_into_id,
        ]);

        if (!result) {
            window.location.href = `/client/${merge_into_id}`;
        } else {
            console.log(result);
        }
    }
</script>

<div class="flex flex-col">
    <div class="flex flex-row">
        Client
        <span class="font-bold ml-2">{data.this_client?.name}</span>
    </div>
    <label>
        Merge Into
        <select bind:value={merge_into_id} name="student_id">
            {#each data.clients as client}
                <option value={client.id}>{client.name}</option>
            {/each}
        </select>
    </label>
    <button onclick={apply_merge} class="bg-blue-900 text-white mt-5"
        >Add</button
    >
</div>
