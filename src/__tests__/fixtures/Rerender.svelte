<script>
  import { onDestroy, onMount } from 'svelte'

  export let onExecuted = undefined
  export let onMounted = undefined
  export let onDestroyed = undefined

  export let name = ''

  onExecuted?.()

  onMount(() => onMounted?.())

  onDestroy(() => onDestroyed?.())
</script>

<div data-testid="test">Hello {name}!</div>
