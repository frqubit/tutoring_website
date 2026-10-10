<script lang="ts">
    import type { PageProps } from "./$types";
    import {
        AuthFetcher,
        FetcherWithDefaultClientSettings,
    } from "$lib/fetchers";

    let { data, params }: PageProps = $props();

    let email = $state("");

    async function create_account() {
        const authFetcher = FetcherWithDefaultClientSettings(AuthFetcher);

        const result = await authFetcher.CreateUserFromClient({
            params: { id: +params.id },
            body: { email },
        });

        if (result !== null) {
            window.location.href = `/client/${params.id}?a=${result}`;
        } else {
            console.log("FAILED");
        }
    }
</script>

<div class="flex flex-col">
    <div class="flex flex-row">
        Client
        <span class="font-bold ml-2">
            {data.client?.name}
        </span>
    </div>

    <div class="flex flex-row">
        Email
        <input type="text" class="ml-2" bind:value={email} />
    </div>

    <button onclick={create_account} class="bg-blue-900 text-white mt-5">
        Create
    </button>
</div>
