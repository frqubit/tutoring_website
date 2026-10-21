<script lang="ts">
    import { UserInfoCls } from "$lib/utils/user_utils.svelte";
    import {
        FetcherWithDefaultClientSettings,
        ClientFetcher,
    } from "$lib/fetchers";

    async function get_clients() {
        const fetcher = FetcherWithDefaultClientSettings(ClientFetcher);
        const output = await fetcher.FindAll({});

        return output;
    }

    let devid = $state(0);
    let clients = $state(get_clients());

    async function devlogin() {
        UserInfoCls.wipe();
        window.location.href = `http://localhost:3000/auth/devsignin?clientid=${devid}`;
    }
</script>

<select class="ml-auto border-b-2" bind:value={devid}>
    <option value="-1">Administrator</option>
    {#await clients then clients}
        {#each clients as client}
            <option value={client.id}>{client.name}</option>
        {/each}
    {/await}
</select>

<button onclick={devlogin}>Log in</button>
