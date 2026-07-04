<script>
    let {name} = $props()
</script>

{#if name === undefined || name === null}
    <p>Icon is Missing Name</p>
{:else}
    <span>{name}</span>
{/if}

<style lang="scss">
    @use '$lib/styles/variables' as *;

    span {
        font-family: $iconFont;
        font-size: inherit;
        color: inherit;
        padding: 0;
        line-height: 1;
        display: block;
    }
</style>