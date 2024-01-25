<script>
  export let name

  let buttonText = 'Button Text'

  function handleClick() {
    buttonText = 'Button Clicked'
  }
</script>

<h1>Hello {name}!</h1>

<button on:click={handleClick}>{buttonText}</button>

<style></style>
