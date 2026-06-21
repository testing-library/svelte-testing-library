<script>
  let { onEffectRun, value = $bindable(false) } = $props()

  let checked = $state()

  $effect(() => {
    value = checked
    onEffectRun?.(checked)
  })
</script>

<input type="checkbox" bind:checked />
