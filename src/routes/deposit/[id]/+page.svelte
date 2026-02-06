<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

{#if data.deposit}
    <h1 class="font-bold text-3xl">
        <a href={`/student/${data.deposit.student.id}`} class="text-blue-700"
            >{data.deposit.student.name}</a
        >
        (${data.deposit.cents / 100})
    </h1>
    <hr />
    <span>Deposited on {data.deposit.date.toLocaleDateString("en-US")}</span>
{:else}
    <h1>Deposit does not exist</h1>
{/if}
