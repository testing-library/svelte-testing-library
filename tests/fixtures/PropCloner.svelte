<script>
  const { input } = $props()

  export function cloneInput() {
    return structuredClone(input)
  }
</script>
