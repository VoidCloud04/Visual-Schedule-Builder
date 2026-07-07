<script>
    import Icon from "./Icon.svelte";
    const { name, title='', disabledName = name, type = '', buttonType= 'button', disabled = false, onClick = () => {console.warn('No Action')} } = $props()

</script>

<button class='{type}' title={title} disabled={disabled} onclick={onClick} type={buttonType}>
    <Icon name={disabled ? disabledName : name} />
</button>

<style lang="scss">
    @use '$lib/styles/variables' as *;



    button {
        width: 32px;
        height: 32px;
        flex: 0 0 32px;
        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>