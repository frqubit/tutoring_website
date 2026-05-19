<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.svg";
    import { SIGNIN_URL, SIGNOUT_URL } from "$lib";
    import { dev } from "$app/environment";

    let { children, data } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class={`w-full min-h-screen p-6 ${dev && "bg-red-100"}`}>
    <div class="w-full border-b-2 mb-4 flex flex-row items-center gap-x-5">
        <a href="/" class="text-blue-700 text-xl font-semibold">Homepage</a>
        <a href="/student" class="text-blue-700 text-xl font-semibold"
            >Students</a
        >
        <a href="/calendar" class="text-blue-700 text-xl font-semibold"
            >Calendar</a
        >

        {#if !data.signed_in}
            <a href={SIGNIN_URL} class="text-blue-700 ml-auto">Sign in</a>
        {:else}
            <a href={SIGNOUT_URL} class="text-blue-700 ml-auto">Sign out</a>
        {/if}
    </div>
    {@render children()}
</div>
