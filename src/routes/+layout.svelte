<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.svg";

    let { children, data } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="w-full min-h-screen p-6">
    <div class="w-full border-b-2 mb-4 flex flex-row items-center">
        <a href="/" class="text-blue-700 text-xl font-semibold">Homepage</a>

        {#if !data.signed_in}
            <a
                href="https://us-east-17bvoomwr4.auth.us-east-1.amazoncognito.com/login/continue?client_id=2cq5ns7arvn12i9ll973hdj0f9&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&response_type=code&scope=email+openid+phone"
                class="text-blue-700 ml-auto">Sign in</a
            >
        {:else}
            <a
                href="https://us-east-17bvoomwr4.auth.us-east-1.amazoncognito.com/logout?client_id=2cq5ns7arvn12i9ll973hdj0f9&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogout&logout_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogout&response_type=code"
                class="text-blue-700 ml-auto">Sign out</a
            >
        {/if}
    </div>
    {@render children()}
</div>
