<script>
    let {content, disabled = false} = $props()
</script>

<div class="dialog-overlay" style="display: {disabled ? 'flex' : 'none'};">
    <div class="surface-2 flexCol dialog">
        {#if content}
            {@render content()}
        {:else}
            <p>Missing snippet <code>content</code></p>
        {/if}
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;
    .dialog-overlay {
        position: fixed;
        inset: 0;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }

    .dialog {
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 8px;
    }
</style>