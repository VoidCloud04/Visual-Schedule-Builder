<script>
    let {text, iconName = '', color = 'primary', disabled = false} = $props()
    import Icon from "./Icon.svelte";
</script>

<div class="chip color-{color} {disabled ? 'disabled' : ''} {iconName !== '' ? 'has-icon' : ''}">
    {#if iconName !== ''}
        <Icon name={iconName} fontSize="18px"/>
    {/if}
    <p>{text}</p>
</div>

<style lang="scss">
    @use 'sass:list';
    @use '$lib/styles/variables' as *;

    $chip-colors: (
        primary: ($primary, $primaryVar, $onPrimary),
        secondary: ($secondary, $secondaryVar, $onSecondary),
        tertiary: ($tertiary, $tertiaryVar, $onTertiary),
        quaternary: ($quaternary, $quaternaryVar, $onQuaternary),
        quinary: ($quinary, $quinaryVar, $onQuinary),
        senary: ($senary, $senaryVar, $onSenary),
        septenary: ($septenary, $septenaryVar, $onSeptenary),
        octonary: ($octonary, $octonaryVar, $onOctonary),
    );

    .chip {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        box-sizing: border-box;
        border-radius: 8px;
        height: 32px;
        width: fit-content;
        padding: 0 16px;
    }

    @each $name, $colors in $chip-colors {
        .chip.color-#{$name} {
            border: 2px solid list.nth($colors, 1);
            background-color: list.nth($colors, 1);
            color: list.nth($colors, 3);
        }
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