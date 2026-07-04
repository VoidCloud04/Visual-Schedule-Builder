<script>
    import Icon from "./Icon.svelte";
    let {iconName, type = '', disabled = false, onClick = () => {console.warn('No Action')}} = $props()
</script>

<button class="button-{disabled ? 'disabled' : type}", disabled={disabled} onclick={onClick}>
    <Icon name={iconName} fontSize="28px"/>
</button>

<style lang="scss">
    button {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        height: 80px;
        width: 80px;

        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 1000;
    }
</style>