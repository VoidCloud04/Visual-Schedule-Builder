<script>
    import Icon from "./Icon.svelte";
    let {active = $bindable(), name = '', iconName = '', disabledIcon = iconName, activeClass = 'button-primary'} = $props()
</script>

<button class={active ? activeClass : 'button-disabled'} onclick={() => {active = !active}}>
    {#if iconName != ''}
        <Icon name={active ? iconName : disabledIcon} />
    {:else}
        {name}
    {/if}
</button>

<style lang="scss">
    
    button {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>