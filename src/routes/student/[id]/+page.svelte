<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

{#if data.student}
    <div class="flex flex-row w-full items-center">
        <h1 class="font-bold text-3xl">
            {data.student.name} ({data.student.active ? "active" : "inactive"})
        </h1>

        <form method="POST" action="?/delete" class="ml-auto">
            <button>Delete</button>
        </form>
    </div>
    <hr />
{:else}
    <h1>Deposit does not exist</h1>
{/if}
