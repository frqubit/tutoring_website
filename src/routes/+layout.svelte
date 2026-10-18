<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.svg";
    import { dev } from "$app/environment";
    import Header from "$lib/components/Header.svelte";

    let { children, data } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class={`w-full min-h-screen p-6 ${dev && "bg-red-100"}`}>
    {#if dev}
        <div
            class="fixed top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
        >
            <span
                class="
                    text-9xl font-serif text-red-900 opacity-15
                "
            >
                DEV
            </span>
        </div>
    {/if}

    <Header signed_in={data.signed_in} />

    {@render children()}
</div>
