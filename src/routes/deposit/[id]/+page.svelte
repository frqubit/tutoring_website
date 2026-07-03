<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

{#if data.deposit}
    <div class="flex flex-row w-full items-center">
        <h1 class="font-bold text-3xl">
            <a href={`/client/${data.deposit.client.id}`} class="text-blue-700"
                >{data.deposit.client.name}</a
            >
            (${data.deposit.cents / 100})
        </h1>

        <form method="POST" action="?/delete" class="ml-auto">
            <button>Delete</button>
        </form>
    </div>
    <hr />
    <span>Deposited on {data.deposit.date.toLocaleDateString("en-US")}</span>
{:else}
    <h1>Deposit does not exist</h1>
{/if}
