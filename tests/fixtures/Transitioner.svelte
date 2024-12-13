<script>
  import { blur } from 'svelte/transition'

  let show = false
  let introDone = false
</script>

<button on:click={() => (show = true)}>Show</button>

{#if show}
  <div in:blur={{ duration: 64 }} on:introend={() => (introDone = true)}>
    {#if introDone}
      <p data-testid="intro-done">Done</p>
    {:else}
      <p data-testid="intro-pending">Pending</p>
    {/if}
  </div>
{/if}
