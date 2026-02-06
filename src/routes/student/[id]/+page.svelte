<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

{#if data.student}
    <h1 class="font-bold text-3xl">
        {data.student.name} ({data.student.active ? "active" : "inactive"})
    </h1>
    <hr />
{:else}
    <h1>Deposit does not exist</h1>
{/if}
