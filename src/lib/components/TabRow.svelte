<script>
    let { tabs, selected = $bindable() } = $props()
</script>

<div>
    {#if tabs.length > 0}
        {#each tabs as tab, i}
            <button 
            class="{selected === i ? 'button-primary' : 'button-secondary'}"
            onclick={() => {selected = i}}>{tab.name}</button>
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
    button {
        border-radius: 12px;
    }
</style>