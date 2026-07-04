<script>
    let {name, fontSize = 'default'} = $props()
</script>

{#if name === undefined || name === null}
    <p>Icon is Missing Name</p>
{:else}
    {#if fontSize === 'default'}
        <span style="font-size: inherit">{name}</span>
    {:else}
        <span style="font-size: {fontSize}">{name}</span>
    {/if}
{/if}

<style lang="scss">
    @use '$lib/styles/variables' as *;

    span {
        font-family: $iconFont;
        color: inherit;
        padding: 0;
        line-height: 1;
    }
</style>