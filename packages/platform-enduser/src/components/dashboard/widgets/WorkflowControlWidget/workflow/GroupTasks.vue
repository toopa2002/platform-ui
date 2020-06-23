<!-- Copyright 2020 ForgeRock AS. All Rights Reserved

Use of this code requires a commercial software license with ForgeRock AS.
or with one of its affiliates. All use shall be exclusively subject
to such license between the licensee and ForgeRock AS. -->
<template>
  <div>
    <FrListGroup :title="this.$t('pages.workflow.unassignedTasks')">
      <template v-if="!isEmpty(tasks)">
        <TransitionGroup
          name="fade"
          mode="out-in">
          <FrListItem
            :collapsible="true"
            v-for="(taskDefinition, id) in tasks"
            :key="`groupTask_${id}`"
            :ref="`collapse-${id}`"
            @shown="setShown(id)"
            @hidden="setHidden(id)">
            <div
              slot="list-item-header"
              class="d-inline-flex w-100 media">
              <div class="media-body align-self-center">
                <h6 class="mb-1 mt-2">
                  {{ taskDefinition.name }}
                </h6>
                <small class="text-muted d-block mb-2">
                  {{ $t('pages.workflow.notAssigned') }}
                </small>
              </div>
              <div class="d-flex ml-3 align-self-center">
                <div
                  class="btn btn-sm btn-link float-right btn-cancel"
                  :ref="`cancel-${id}`">
                  {{ $t('pages.workflow.cancel') }}
                </div>
                <div class="btn btn-sm btn-link float-right btn-edit">
                  {{ $t('pages.workflow.assign') }}
                </div>
              </div>
            </div>
            <div
              slot="list-item-collapse-body"
              class="d-inline-flex w-100">
              <FrAssignTask
                :task-definition="taskDefinition"
                @loadProcess="(process) => $emit('loadProcess', process)"
                @assignTask="assignTask" />
            </div>
          </FrListItem>
        </TransitionGroup>
      </template>
      <FrListItem v-else>
        <div
          slot="list-item-header"
          class="text-muted text-center w-100">
          {{ $t('pages.workflow.noGroupTasks') }}
        </div>
      </FrListItem>
    </FrListGroup>
  </div>
</template>

<script>
import {
  isFunction, isEmpty, keys, difference, first, isUndefined,
} from 'lodash';
import FrListGroup from '@forgerock/platform-shared/src/components/ListGroup/';
import FrListItem from '@forgerock/platform-shared/src/components/ListItem/';
import AssignTask from './AssignTask';

/**
 * @description Dashboard widget that lists available group tasks that can be assigned
 *
 * */
export default {
  name: 'GroupTasks',
  props: {
    tasks: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return { panelShown: {}, onHidden: null };
  },
  components: {
    FrListGroup,
    FrListItem,
    FrAssignTask: AssignTask,
  },
  methods: {
    isEmpty,
    first,
    setShown(id) {
      this.$set(this.panelShown, id, true);
    },
    setHidden(id) {
      this.$set(this.panelShown, id, false);

      if (isFunction(this.onHidden)) {
        this.onHidden();
        this.onHidden = null;
      }
    },
    cancel(id) {
      first(this.$refs[`cancel-${id}`]).click();
    },
    assignTask({ id, assignee }) {
      const { task } = this.tasks[id];

      this.onHidden = () => {
        this.$emit('updateAssignment', { assignee, id, task });
      };

      this.cancel(id);
    },
  },
  watch: {
    tasks: {
      /**
        * This function sets the state of panelShown. Anytime new tasks are added to the tasks prop,
        * the prop key is added to the panelShown object with an initial state of `false`.
        */
      handler(val, oldVal) {
        const newVals = difference(keys(val), keys(oldVal));

        if (isUndefined(this.panelShown)) {
          this.panelShown = {};
        }

        newVals.forEach((panelValue) => {
          this.$set(this.panelShown, panelValue, false);
        });
      },
      deep: true,
    },
  },
};
</script>