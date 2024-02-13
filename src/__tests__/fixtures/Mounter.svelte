<script>
  import { onDestroy, onMount } from 'svelte'

  export let onExecuted = undefined
  export let onMounted = undefined
  export let onDestroyed = undefined

  onExecuted?.()

  onMount(() => {
    onMounted?.()
  })

  onDestroy(() => {
    onDestroyed?.()
  })
</script>

<button />
