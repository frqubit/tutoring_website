<script lang="ts">
    import { UserInfoCls } from "$lib/utils/user_utils.svelte";
    import {
        FetcherWithDefaultClientSettings,
        ClientFetcher,
    } from "$lib/fetchers";
    import { BACKEND_DOMAIN } from "$lib";

    async function get_clients() {
        const fetcher = FetcherWithDefaultClientSettings(ClientFetcher);
        const output = await fetcher.FindAll({});

        return output;
    }

    let devid = $state(0);
    let clients = $state(get_clients());

    async function devlogin() {
        UserInfoCls.wipe();
        window.location.href = `${BACKEND_DOMAIN}/auth/devsignin?clientid=${devid}`;
    }
</script>

<select class="ml-auto border-b-2 hidden md:block" bind:value={devid}>
    <option value="-1">Administrator</option>
    {#await clients then clients}
        {#each clients as client}
            <option value={client.id}>{client.name}</option>
        {/each}
    {/await}
</select>

<button class="hidden md:block" onclick={devlogin}>Become</button>
