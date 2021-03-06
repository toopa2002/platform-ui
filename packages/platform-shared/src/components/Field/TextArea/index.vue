<!-- Copyright 2020 ForgeRock AS. All Rights Reserved

Use of this code requires a commercial software license with ForgeRock AS.
or with one of its affiliates. All use shall be exclusively subject
to such license between the licensee and ForgeRock AS. -->
<template>
  <FrInputLayout
    :id="id"
    :field-name="fieldName"
    :help-text="helpText"
    :errors="errors"
    :is-html="isHtml"
    :label="label"
  >
    <textarea
      :autofocus="autofocus"
      :id="id"
      :rows="rows"
      :cols="cols"
      :class="[{'polyfill-placeholder': floatLabels }, 'white-label-background form-control']"
      v-model="inputValue"
      :placeholder="label"
      :data-vv-as="label"
      :disabled="disabled"
      @keyup="validator"
      :name="fieldName" />
  </FrInputLayout>
</template>

<script>
import InputLayout from '../Wrapper/InputLayout';
import InputMixin from '../Wrapper/InputMixin';

/**
 *  Text area input
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
  name: 'TextArea',
  mixins: [InputMixin],
  components: {
    FrInputLayout: InputLayout,
  },
  props: {
    /**
     * Autofocus field.
     */
    autofocus: {
      type: Boolean,
      default: false,
    },
    /**
     * List of errors related to input value
     */
    errors: {
      type: Array,
      default: () => [],
    },
    /**
     * specifies the visible height of a text area, in lines.
     */
    rows: {
      type: Number,
      default: 5,
    },
    /**
     * specifies the visible width of a text area.
     */
    cols: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {};
  },
  methods: {
    setInputValue(newVal) {
      if (newVal !== undefined && newVal !== null) {
        this.inputValue = newVal.toString();
      }
    },
  },
};
</script>
