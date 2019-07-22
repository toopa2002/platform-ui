<template>
  <BContainer>
    <BRow class="my-5">
      <BCol
        class="profileCol mb-4"
        lg="4"
      >
        <BCard class="text-center mb-4">
          <BImg
            :src="require('@/assets/images/profile-default.png')"
            rounded="circle"
            width="112"
            height="112"
            alt="img"
            class="m-1 mb-3"
          />
          <h4>{{ fullName }}</h4>
          <span class="text-muted">
            {{ email }}
          </span>
          <BButton
            v-if="$root.userStore.state.internalUser === false"
            ref="editProfileButton"
            variant="primary"
            block
            class="mt-4"
            v-b-modal.userDetailsModal
          >
            {{ $t('pages.profile.editPersonalInfo') }}
          </BButton>
        </BCard>

        <FrEditPersonalInfo
          :auto-open="openProfile"
          @updateProfile="updateProfile"
          :schema="schema"
          :profile="profile"
        />
      </BCol>
      <BCol lg="8">
        <BTabs content-class="mt-4">
          <BTab
            :title="$t('pages.profile.settings')"
            active
          >
            <FrAccountSecurity
              @updateProfile="updateProfile"
              @updateKBA="updateKBA"
            />
            <FrAuthorizedApplications v-if="$root.applicationStore.state.amDataEndpoints && $root.userStore.state.internalUser === false" />
            <FrTrustedDevices v-if="$root.applicationStore.state.amDataEndpoints && $root.userStore.state.internalUser === false" />
            <FrPreferences
              v-if="$root.userStore.state.internalUser === false"
              @updateProfile="updateProfile"
            />
            <FrConsent
              v-if="$root.userStore.state.internalUser === false"
              :consented-mappings="profile.consentedMappings"
              @updateProfile="updateProfile"
            />
            <FrAccountControls />
          </BTab>
        </BTabs>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script>
import _ from 'lodash';
/**
 * @description Controlling component for profile management
 *
 * @fires PATCH type/name/id (e.g. managed/user/_id) - Submits a patch object of changes for the provided resource record
 */
export default {
  name: 'Profile',
  props: {
    clientToken: {
      type: String,
      default: '',
    },
    linkedProvider: {
      type: String,
      default: '',
    },
    openProfile: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
    FrAccountControls: () => import('@/components/profile/AccountControls'),
    FrAccountSecurity: () => import('@/components/profile/AccountSecurity'),
    FrEditPersonalInfo: () => import('@/components/profile/EditPersonalInfo'),
    FrPreferences: () => import('@/components/profile/Preferences'),
    FrTrustedDevices: () => import('@/components/profile/TrustedDevices'),
    FrAuthorizedApplications: () => import('@/components/profile/AuthorizedApplications'),
    FrConsent: () => import('@/components/profile/Consent'),
  },
  computed: {
    fullName() {
      let fullName = '';

      if (this.$root.userStore.state.givenName.length > 0 || this.$root.userStore.state.sn.length > 0) {
        fullName = _.startCase(`${this.$root.userStore.state.givenName} ${this.$root.userStore.state.sn}`);
      } else {
        fullName = this.$root.userStore.state.userId;
      }

      return fullName;
    },
    email() {
      return this.$root.userStore.state.email;
    },
    profile() {
      return this.$root.userStore.state.profile;
    },
    schema() {
      return this.$root.userStore.state.schema;
    },
  },
  methods: {
    updateProfile(payload, config = {}) {
      this.makeUpdateRequest(this.$root.userStore.state.managedResource, payload, config);
    },
    updateKBA(payload, config) {
      this.makeUpdateRequest('selfservice/user', payload, config);
    },
    makeUpdateRequest(endpoint, payload, config = {}) {
      /* istanbul ignore next */
      const successMsg = config.successMsg || this.$t('common.user.profile.updateSuccess');
      const { userId } = this.$root.userStore.state;
      const selfServiceInstance = this.getRequestService({
        headers: config.headers,
      });

      /* istanbul ignore next */
      selfServiceInstance.patch(`${endpoint}/${userId}`, payload).then((response) => {
        this.$root.userStore.setProfileAction(response.data);
        this.displayNotification('success', successMsg);

        if (config.onSuccess) {
          config.onSuccess();
        }
      })
        .catch((error) => {
          /* istanbul ignore next */
          const errorMsg = config.errorMsg || error.response.data.message;
          this.displayNotification('error', errorMsg);

          if (config.onError) {
            config.onError(error);
          }
        });
    },
  },
};
</script>
<style type="scss" scoped>
    /deep/ .nav-tabs {
        border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
</style>