<svelte:options accessors />

<script>
  export let name

  let buttonText = 'Button'

  function handleClick() {
    buttonText = 'Button Clicked'
  }
</script>

<h1 data-testid="test">Hello {name}!</h1>

<button on:click={handleClick}>{buttonText}</button>

<style></style>
