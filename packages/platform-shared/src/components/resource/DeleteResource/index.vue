<!-- Copyright 2020 ForgeRock AS. All Rights Reserved

Use of this code requires a commercial software license with ForgeRock AS.
or with one of its affiliates. All use shall be exclusively subject
to such license between the licensee and ForgeRock AS. -->
<template>
  <BModal
    :id="modalId"
    ref="resourceDeleteModal"
    :static="isTesting">
    <template #modal-title>
      <h5
        class="fr-modal-title mb-0">
        {{ $t(`managed.deleteResource.title`, { resource: resourceTitle }) }}
      </h5>
    </template>
    <p>{{ $t(`managed.deleteResource.body`, { resource: resourceName }) }}</p>
    <template v-slot:modal-footer="{ cancel }">
      <BRow>
        <div class="d-flex justify-content-end w-100 pr-3">
          <BButton
            variant="none"
            class="test_cancelButton"
            @click="cancel()">
            {{ $t('common.cancel') }}
          </BButton>
          <BButton
            @click="deleteResource()"
            class="test_deleteButton"
            variant="danger">
            {{ $t(`managed.deleteResource.primaryButton`, { resource: resourceName }) }}
          </BButton>
        </div>
      </BRow>
    </template>
  </BModal>
</template>

<script>
import {
  BButton,
  BRow,
  BModal,
} from 'bootstrap-vue';
import NotificationMixin from '@forgerock/platform-shared/src/mixins/NotificationMixin';

export default {
  name: 'DeleteResource',
  mixins: [
    NotificationMixin,
  ],
  components: {
    BButton,
    BRow,
    BModal,
  },
  computed: {
    resourceTitle() {
      return this.resourceName.charAt(0).toUpperCase() + this.resourceName.slice(1);
    },
  },
  props: {
    modalId: {
      type: String,
      default: 'deleteResource',
    },
    deleteManagedResource: {
      type: Function,
      default: () => {
        const retv = {
          then: () => {},
        };
        return retv;
      },
    },
    deleteInternalResource: {
      type: Function,
      default: () => {
        const retv = {
          then: () => {},
        };
        return retv;
      },
    },
    resourceToDeleteId: {
      type: String,
      default: '',
    },
    resourceName: {
      type: String,
      default: '',
    },
    resourceType: {
      type: String,
      default: '',
    },
    // Required to render modal for integration testing
    isTesting: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    deleteResource() {
      let resourceFunction;
      // TODO: unify the below endpoints for "managed" and "internal"
      if (this.resourceType === 'managed') {
        resourceFunction = this.deleteManagedResource(this.resourceName, this.resourceToDeleteId);
      } else {
        resourceFunction = this.deleteInternalResource(this.resourceName, this.resourceToDeleteId);
      }
      resourceFunction
        .then(() => {
          this.$refs.resourceDeleteModal.hide();
          this.$emit('resource-deleted');
        })
        .catch((err) => {
          this.showErrorMessage(
            err,
            this.$t('application.errors.errorDeletingResource'),
          );
        });
    },
  },
  mounted() {
    /**
     * Trigger cancel event for parent.
     */
    this.$root.$on('bv::modal::hide', (bvEvent) => {
      /**
       * `bvEvent.trigger` for programmatic modal hiding is `null`.
       * Programmatic `hide` is only used when a resource is successfully deleted,
       * and this (below) is only used when the delete action is *cancelled*.
       */
      if (bvEvent.trigger) {
        this.$emit('cancel-resource-deletion');
      }
    });
  },
  watch: {
    resourceToDeleteId(value) {
      /**
       * Don't open if "clearing" value
       */
      if (value) { this.$refs.resourceDeleteModal.show(); }
    },
  },
};
</script>