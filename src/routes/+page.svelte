<script>
    import Header from "./Header.svelte";
    import TabRow from "$lib/components/TabRow.svelte";

    const mainTabs = [
        {name: 'Configuration'},
        {name: 'Docs'}
    ]
</script>

<Header />
<TabRow tabs={mainTabs}/>


