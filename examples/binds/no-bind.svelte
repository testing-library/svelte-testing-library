<script>
  let { value, onInput } = $props()

  const oninput = (event) => {
    onInput(event.target.value)
  }
</script>

<input type="text" {value} {oninput} />
