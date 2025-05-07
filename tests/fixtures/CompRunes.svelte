<script>
  let { name = 'World' } = $props()

  let buttonText = $state('Button')

  function handleClick() {
    buttonText = 'Button Clicked'
  }
</script>

<h1 data-testid="test">Hello {name}!</h1>

<button onclick={handleClick}>{buttonText}</button>
