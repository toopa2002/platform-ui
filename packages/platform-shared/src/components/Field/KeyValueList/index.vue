<!-- Copyright 2020 ForgeRock AS. All Rights Reserved

Use of this code requires a commercial software license with ForgeRock AS.
or with one of its affiliates. All use shall be exclusively subject
to such license between the licensee and ForgeRock AS. -->
<template>
  <div class="mt-3">
    <div
      v-if="!isEmpty(keyValues)"
      class="fr-key-value-list">
      <div
        v-for="(text, key) in keyValues"
        :key="`${id}_keyvalue-${key}`"
        class="fr-key-value-list-item">
        <div class="fr-key-value-list-header mt-3">
          <h5 class="text-truncate">
            {{ key }}
          </h5>
          <i
            v-if="!disabled"
            @click="deleteItem(key)"
            class="material-icons-outlined fr-key-value-icon noselect">
            delete
          </i>
        </div>
        <p class="d-flex">
          <span class="flex-fill">
            {{ text }}
          </span>
          <i
            v-if="!disabled"
            @click="editItem(key)"
            class="material-icons-outlined fr-key-value-icon noselect d-none">
            edit
          </i>
        </p>
        <FrKeyValuePanel
          v-if="currentKey === key"
          :validation-rules="validationRules"
          v-model="keyValueObject"
          @cancel="currentKey = null"
          @saveKeyValue="saveKeyValue" />
      </div>
    </div>
    <div
      v-if="isEmpty(keyValues) && !currentKey"
      class="fr-key-value-panel text-center py-3">
      <span class="text-secondary">
        ({{ $t('trees.editPanel.none') }})
      </span>
    </div>
    <FrKeyValuePanel
      v-if="currentKey === ''"
      :validation-rules="validationRules"
      v-model="keyValueObject"
      @cancel="currentKey = null"
      @saveKeyValue="saveKeyValue" />
    <div
      v-else-if="!disabled"
      class="mt-3">
      <span
        class="fr-key-link"
        @click="showAdd()">
        <i class="material-icons-outlined mr-1 mb-1">
          add
        </i>
        {{ $t('common.add') }}
      </span>
    </div>
  </div>
</template>

<script>
import { isEmpty, cloneDeep } from 'lodash';
import KeyValuePanel from './KeyValuePanel';

/**
 * Key value pair component
 */
export default {
  name: 'KeyValueList',
  components: {
    FrKeyValuePanel: KeyValuePanel,
  },
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let keyValues;

    if (this.value === null) {
      keyValues = {};
    } else {
      keyValues = cloneDeep(this.value);
    }

    return {
      id: null,
      currentKey: null,
      keyValues,
      validationRules: {},
      keyValueObject: { key: '', value: '' },
    };
  },
  mounted() {
    // eslint-disable-next-line no-underscore-dangle
    this.id = this._uid;
  },
  methods: {
    /**
      * Removes an item from the key value list
      *
      * @param {String} key key for the object property to be deleted
      */
    deleteItem(key) {
      this.$delete(this.keyValues, key);
      this.$emit('input', this.keyValues);
    },
    /**
     * Shows edit fields for key and value
     *
     * @param {String} key key for the object property to be edited
     */
    editItem(key) {
      const paredDownKeyValues = cloneDeep(this.keyValues);
      this.$delete(paredDownKeyValues, key);
      this.setValidationRules(paredDownKeyValues);
      this.keyValueObject.value = this.keyValues[key];
      this.keyValueObject.key = key;
      this.currentKey = key;
    },
    /**
      * Check if an object is empty
      *
      * @param {Object} objectToCheck
      */
    isEmpty,
    /**
      * Emits an input change to notify v-model that the component has updated
      *
      * @param {Object} keyValueObject the key and value values to be added/edited in the save
      */
    saveKeyValue(keyValueObject) {
      if (keyValueObject.key !== this.currentKey && this.currentKey !== '') {
        this.$delete(this.keyValues, this.currentKey);
      }
      this.keyValues[keyValueObject.key] = keyValueObject.value;
      this.$emit('input', this.keyValues);
      this.currentKey = null;
    },
    /**
     * Sets which values should be considered in unique check
     */
    setValidationRules(keyValues) {
      const rulesObject = { unique: Object.keys(keyValues) };
      this.validationRules = { ...rulesObject, required: true };
    },
    /**
     * Displays blank key and value fields to add a new key-value object
     */
    showAdd() {
      this.keyValueObject.value = '';
      this.keyValueObject.key = '';
      this.currentKey = '';
      this.setValidationRules(this.keyValues);
    },
  },
};
</script>
<style lang="scss" scoped>
.fr-key-value-panel {
  background-color: $gray-100;
}

.fr-key-link {
  color: $blue;

  &:hover {
    cursor: pointer;
    color: $hover-blue;
  }
}

.fr-key-value-list {
  .fr-key-value-list-item {
    border-bottom: 1px solid $gray-200;

    &:hover .d-none {
      display: block !important;
    }

    .fr-key-value-list-header {
      display: flex;
      justify-content: space-between;
    }

    .fr-key-value-icon {
      cursor: pointer;
      color: $gray-500;

      &:hover {
        color: $gray-900;
      }
    }
  }
}
</style>