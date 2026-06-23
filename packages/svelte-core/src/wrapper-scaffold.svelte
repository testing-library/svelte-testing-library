<script>
  let {
    wrapper: Wrapper,
    wrapperProps,
    component: Component,
    componentProps,
  } = $props()

  let wrapperInstance = $state()
  let componentInstance = $state()

  export const getWrapper = () => wrapperInstance
  export const getComponent = () => componentInstance
  export const getComponentProps = () => componentProps
</script>

<Wrapper bind:this={wrapperInstance} {...wrapperProps}>
  <Component bind:this={componentInstance} {...componentProps} />
</Wrapper>
