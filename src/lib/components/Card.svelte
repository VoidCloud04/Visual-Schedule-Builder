<script>
    let { content } = $props()
</script>

<div>
    {#if content}
        {@render content()}
    {:else}
        <p> Use a Snippet named content to use this card c: </p>
    {/if}
</div>