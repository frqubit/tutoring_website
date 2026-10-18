<script lang="ts">
    import { SIGNIN_URL, SIGNOUT_URL } from "$lib";
    import { localUserInfo } from "$lib/utils/user_utils.svelte.js";

    let { signed_in } = $props();

    let userInfo = localUserInfo();
</script>

<div class="w-full border-b-2 mb-4 flex flex-row items-center gap-x-5">
    {#await userInfo}
        <a href="/" class="text-blue-700 text-xl font-semibold">Homepage</a>
    {:then userInfo}
        <a
            href={userInfo.value?.is_administrator ? "/admin" : "/"}
            class={`${userInfo.value?.is_administrator ? "text-red-700" : "text-blue-700"} text-xl font-semibold`}
        >
            Homepage
        </a>
    {/await}
    <a href="/admin/student" class="text-blue-700 text-xl font-semibold"
        >Students</a
    >
    <a href="/admin/client" class="text-blue-700 text-xl font-semibold"
        >Clients</a
    >
    <a href="/admin/calendar" class="text-blue-700 text-xl font-semibold"
        >Calendar</a
    >

    {#if !signed_in}
        <a href={SIGNIN_URL} class="text-blue-700 ml-auto">Sign in</a>
    {:else}
        <div class="ml-auto flex flex-row items-center gap-x-5">
            {#await userInfo then userInfo}
                {#if userInfo.value?.client?.id}
                    <a
                        class="text-blue-700"
                        href={`/client/${userInfo.value.client.id}`}
                        >{userInfo.value.client.name}</a
                    >
                {:else if userInfo.value?.is_administrator}
                    <span class="text-red-700 bold select-none"
                        >Administrator</span
                    >
                {/if}
            {/await}
            <a href={SIGNOUT_URL} class="text-blue-700">Sign out</a>
        </div>
    {/if}
</div>
