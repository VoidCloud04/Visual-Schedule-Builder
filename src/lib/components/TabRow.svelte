<script>
    const { tabs } = $props();
</script>

<div>
    {#if tabs.length > 0}
        {#each tabs as tab}
            <button class="button-primary">{tab.name}</button>
        {/each}
    {:else}
        <p>This tab row is configured improperly</p>
    {/if}
</div>

<style lang="scss">
    @use "../styles/variables" as *;
    p {
        color: $error;
    }

    
</style>