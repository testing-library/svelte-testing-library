<script>
  import { onDestroy, onMount } from 'svelte'

  export let onMounted
  export let onDestroyed

  onMount(() => onMounted())
  onDestroy(() => onDestroyed())
</script>

<button />
