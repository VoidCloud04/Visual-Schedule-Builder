<script>
    let {chipArr} = $props()
    /*
        Array of objects with these attributes:
        {text, iconName, color, disabled}
    */
    import Chip from "./Chip"
</script>

<div>
    {#each chipArr as item}
        <Chip text={item.text} iconName={item.iconName ? item.iconName : ''} color={item.color ? item.color : 'primary'} disabled={item.disabled ? item.disabled : 'false'}/>
    {/each}
</div>

<style lang="scss">
    
</style>