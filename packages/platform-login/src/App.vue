<template>
  <div id="app">
    <div id="wrapper">
      <div id="appContentWrapper">
        <Transition
          name="fade"
          mode="out-in"
        >
          <RouterView :key="this.$route.fullPath" />
        </Transition>
      </div>
    </div>
    <!--
          Application View
        -->
    <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
    <notifications
      group="IDMMessages"
      position="bottom left"
      width="320"
      :duration="400000"
    >
      <template
        slot="body"
        slot-scope="props"
      >
        <FrAlert
          class="w-50 m-3"
          :variant="props.item.type"
          show
        >
          {{ props.item.text }}
        </FrAlert>
      </template>
    </notifications>
  </div>
</template>

<script>
import Alert from '@forgerock/platform-components/src/components/alert/';

export default {
  name: 'App',
  components: {
    FrAlert: Alert,
  },
};
</script>

<style lang="scss">
@import 'scss/main';
@import "~bootstrap/scss/bootstrap.scss";

#app {
  -webkit-transition: all 0.2s ease;
  -moz-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
  transition: all 0.2s ease;
  height: 100%;

  .container, .container-fluid {
    @media(min-width:768px) {
      padding-left: $grid-gutter-width;
      padding-right: $grid-gutter-width;
    }
  }

  #wrapper {
    height: 100%;

    #appContentWrapper {
      height: 100%;
      -webkit-transition: all 0.2s ease;
      -moz-transition: all 0.2s ease;
      -o-transition: all 0.2s ease;
      transition: all 0.2s ease;
      padding-left: 0;
    }
  }
}
</style>