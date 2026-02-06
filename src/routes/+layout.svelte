<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.svg";

    let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="w-full min-h-screen p-6">
    <div class="w-full border-b-2 mb-4">
        <a href="/" class="text-blue-700 text-xl font-semibold">Homepage</a>
    </div>
    {@render children()}
</div>
