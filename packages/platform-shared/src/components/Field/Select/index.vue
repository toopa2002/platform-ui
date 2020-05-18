<!-- Copyright 2020 ForgeRock AS. All Rights Reserved

Use of this code requires a commercial software license with ForgeRock AS.
or with one of its affiliates. All use shall be exclusively subject
to such license between the licensee and ForgeRock AS. -->
<template>
  <FrInputLayout
    :id="id"
    :field-name="fieldName"
    :help-text="helpText"
    :is-html="isHtml"
    :label="label"
  >
    <VueMultiSelect
      v-model="inputValue"
      :name="fieldName"
      label="text"
      track-by="value"
      :disabled="disabled"
      :options="options"
      :searchable="options.length > 5"
      :show-labels="false"
      :allow-empty="false"
      :class="[{'polyfill-placeholder': floatLabels }, 'white-label-background form-control p-0', {'no-multiselect-label': !this.label }]"
      :placeholder="$t('common.typeToSearch')">
      <slot name="noResult">
        {{ $t('common.noResult') }}
      </slot>
    </VueMultiSelect>
    <template
      v-for="(key, slotName) in $scopedSlots"
      v-slot:[slotName]="slotData">
      <!-- @slot passthrough slot -->
      <slot
        :name="slotName"
        v-bind="slotData" />
    </template>
  </FrInputLayout>
</template>

<script>
import {
  find,
  has,
  map,
} from 'lodash';
import VueMultiSelect from 'vue-multiselect';
import InputLayout from '../Wrapper/Layout';
import InputMixin from '../Wrapper/Mixin';

/**
 *  Single select input. Allows selection of one element in a dropdown
 *
 *  @Mixes InputMixin - default props and methods for inputs
 *  @prop {boolean} disabled default false
 *  @prop {string} fieldName default ''
 *  @prop {string} helpText default ''
 *  @prop {string} label default ''
 *  @prop {array|object} failedPolicies default {}
 *  @prop {function} validator default noop
 *  @prop {Array|Object|Number|String} value default ''
 */
export default {
  name: 'Select',
  mixins: [InputMixin],
  components: {
    FrInputLayout: InputLayout,
    VueMultiSelect,
  },
  props: {
    /**
     * Options for select input.
     */
    selectOptions: {
      type: [Array, Object],
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      floatLabels: false,
    };
  },
  computed: {
    options() {
      if (this.selectOptions.length && has(this.selectOptions[0], 'value')) {
        return this.selectOptions;
      }

      return map(this.selectOptions, (option) => ({
        text: option,
        value: option,
      }));
    },
  },
  methods: {
    setInputValue(newVal) {
      if (newVal !== undefined && newVal !== null) {
        this.inputValue = find(this.options, { value: newVal });
      }
    },
  },
  watch: {
    value: {
      handler(value) {
        this.setInputValue(value);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@forgerock/platform-shared/src/components/Field/assets/vue-multiselect.scss';
</style>