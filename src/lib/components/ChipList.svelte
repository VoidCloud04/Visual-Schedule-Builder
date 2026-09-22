<script>
    let {chipArr} = $props()
    /*
        Array of objects with these attributes:
        {text, iconName, color, disabled}
    */
    import Chip from "./Chip.svelte"
</script>

<div>
    {#each chipArr as item}
        <Chip text={item.text} iconName={item.iconName ? item.iconName : ''} color={item.color ? item.color : 'primary'} disabled={item.disabled ? item.disabled : 'false'}/>
    {/each}
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        :global(.chip) {
            margin-right: 0.25vw;
        }
    }
</style>