<svelte:options accessors />

<script>
  import { getContext } from 'svelte'

  export let name

  let buttonText = 'Button'

  function handleClick() {
    buttonText = 'Button Clicked'
  }

  const contextName = getContext('name')
</script>

<h1 data-testid="test">Hello {name}!</h1>

<button on:click={handleClick}>{buttonText}</button>

<div>we have {contextName}</div>
