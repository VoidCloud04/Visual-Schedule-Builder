<script>
    let {text, iconName = '', disabled = false} = $props()
    import Icon from "./Icon.svelte";
</script>

<div class="chip {disabled ? 'disabled' : ''} {iconName !== '' ? 'has-icon' : ''}">
    {#if iconName !== ''}
        <Icon name={iconName} fontSize="18px"/>
    {/if}
    <p>{text}</p>
</div>

<style lang="scss">
    @use '$lib/styles/variables' as *;
    .chip {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        border: 2px solid $primaryVar;
        border-radius: 8px;
        background-color: $primary;
        color: $onPrimary;
        height: 32px;
        width: fit-content;
        padding: 0 16px;
    }
    .has-icon {
        padding: 0 8px;
        gap: 8px;
    }
    p {
        margin: 0;
        font-size: 14px;
        line-height: 1;
    }
    .disabled {
        border-color: $disabled;
        background-color: $onDisabled;
    }
</style>