<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

{#if data.session}
    <div class="flex flex-row w-full items-center">
        <h1 class="font-bold text-3xl">
            <a
                href={`/student/${data.session.student.id}`}
                class="text-blue-700">{data.session.student.name}</a
            >
            ({data.session.minutes} minutes)
        </h1>
        <form method="POST" action="?/delete" class="ml-auto">
            <button>Delete</button>
        </form>
    </div>
    <hr />
    <span>Deposited on {data.session.date.toLocaleDateString("en-US")}</span>
{:else}
    <h1>Deposit does not exist</h1>
{/if}
