<!--
Copyright (c) 2020 ForgeRock. All rights reserved.

This software may be modified and distributed under the terms
of the MIT license. See the LICENSE file for details.
-->

<template>
  <div>
    <BRow>
      <BCol md="10">
        <h5>
          {{ $t('pages.profile.accountSecurity.securityQuestions') }}
        </h5>
      </BCol>
      <BCol md="2">
        <BButton
          v-b-toggle.collapse-1
          variant="link"
          class="py-0"
          ref="button"
          @click="initializeForm(kbaData.minimumAnswersToDefine)">
          {{ showCancel ? $t('common.cancel') : $t('common.reset') }}
        </BButton>
      </BCol>
    </BRow>
    <BCollapse
      @hidden="clearComponent"
      id="collapse-1"
      class="mt-4">
      <ValidationObserver ref="observer">
        <div
          v-for="(kbaChoice, id) in kbaChoices"
          :key="id"
          class="pb-3">
          <FrField
            :field="kbaChoice.selected"
            class="mb-3" />
          <FrField
            v-if="kbaChoice.selected.value === customIndex"
            :field="kbaChoice.customQuestion"
            class="mb-3" />
          <FrField
            :field="kbaChoice.answer"
            class="mb-3" />
          <hr
            v-if="id !== kbaChoices.length - 1"
            class="mt-4">
        </div>
        <FrLoadingButton
          variant="primary"
          :label="$t('common.save')"
          :loading="loading"
          @click="onSaveKBA" />
      </ValidationObserver>
    </BCollapse>
  </div>
</template>

<script>
import {
  includes,
  map,
  noop,
  times,
} from 'lodash';
import {
  BButton,
  BCol,
  BRow,
} from 'bootstrap-vue';
import FrField from '@forgerock/platform-shared/src/components/Field';
import LoadingButton from '@/components/utils/LoadingButton';

/**
 * @description Allows a user to change their KBA, will ensure based on KBA configuration a user must match the systems KBA requirements.
 *
 */
export default {
  name: 'EditKBA',
  components: {
    FrLoadingButton: LoadingButton,
    FrField,
    BButton,
    BCol,
    BRow,
  },
  props: {
    kbaData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      questions: {},
      selectOptions: [],
      kbaChoices: [],
      customIndex: null,
      loading: false,
      showCancel: false,
    };
  },
  mounted() {
    this.questions = this.kbaData.questions;
  },
  methods: {
    /**
     * Initializes select options for each required KBA definition
     * @param {Number} minimumRequired number of KBA definitions required
     */
    initializeForm(minimumRequired) {
      // if cancel form is already showing, don't need to initialize
      if (this.showCancel) {
        return;
      }
      const { locale, fallbackLocale } = this.$i18n;

      // create select options
      this.selectOptions = map(this.questions, (question, index) => ({ value: index, text: question[locale] || question[fallbackLocale], $isDisabled: false }));
      this.customIndex = this.selectOptions.length;
      this.selectOptions.push({ value: this.customIndex, text: this.$t('user.kba.custom'), $isDisabled: false });

      // set form state based on stored user questions
      times(minimumRequired, (index) => {
        this.kbaChoices.push({
          selected: {
            type: 'select',
            title: this.$t('user.kba.selectQuestion'),
            value: '',
            options: this.selectOptions,
          },
          answer: {
            key: `${this.$t('user.kba.answer')} ${index + 1}`,
            title: this.$t('user.kba.answer'),
            value: '',
            validation: 'required',
          },
          customQuestion: {
            key: `${this.$t('pages.profile.accountSecurity.custom')} ${index + 1}`,
            title: this.$t('pages.profile.accountSecurity.custom'),
            value: '',
            validation: 'required',
          },
        });
      });
      this.showCancel = true;
    },
    /**
     * Generate patch options for updating KBA
     * @returns {Object[]} Array containing single object with patch options as key/value pairs
     */
    generatePatch() {
      const values = map(this.kbaChoices, (field) => {
        if (field.customQuestion.value) {
          return {
            answer: field.answer.value,
            customQuestion: field.customQuestion.value,
          };
        }
        return {
          answer: field.answer.value,
          questionId: field.selected.value,
        };
      });

      return [{
        operation: 'replace',
        field: '/kbaInfo',
        value: values,
      }];
    },
    /**
     * Clear the component data
     */
    clearComponent() {
      this.loading = false;
      this.selectOptions = [];
      this.kbaChoices = [];
      this.customIndex = null;
      this.questions = this.kbaData.questions;
      this.showCancel = false;
    },
    /**
     * Sends event to update KBA and collapses component if successful
     */
    async onSaveKBA() {
      const isValid = await this.$refs.observer.validate();
      if (isValid) {
        this.loading = true;
        this.$emit('updateKBA', this.generatePatch(), {
          onSuccess: () => {
            this.$refs.button.click();
          },
          onError: () => {
            this.loading = false;
          },
        });
      }
    },
  },
  watch: {
    kbaChoices: {
      handler() {
        // create array of selected options that aren't custom
        const toDisable = map(this.kbaChoices, (kbaChoice) => {
          if (kbaChoice.selected.value !== null && kbaChoice.selected.value !== this.customIndex) {
            return kbaChoice.selected.value;
          }
          return null;
        });

        // set any [toDisable] option to disabled
        this.selectOptions.forEach((option) => {
          if (includes(toDisable, option.value) || option.value === 0) {
            option.$isDisabled = true;
          } else {
            option.$isDisabled = false;
          }
        });
      },
      deep: true,
    },
    kbaData: { deep: true, handler: noop },
  },
};
</script>
