<div data-testid="target">{message}</div>

<script>
    import { onMount } from 'svelte';

    let message = "not yet";

    onMount( () => {
        message = 'nailed it';
    });

</script>
