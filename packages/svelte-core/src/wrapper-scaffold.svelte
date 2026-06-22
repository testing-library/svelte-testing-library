<svelte:options runes={false} />

<script>
  export let wrapper
  export let wrapperProps
  export let component
  export let componentProps

  let wrapperInstance
  let componentInstance

  export const getWrapper = () => wrapperInstance
  export const getComponent = () => componentInstance
  export const getComponentProps = () => componentProps
</script>

<svelte:component this={wrapper} bind:this={wrapperInstance} {...wrapperProps}>
  <svelte:component
    this={component}
    bind:this={componentInstance}
    {...componentProps}
  />
</svelte:component>
