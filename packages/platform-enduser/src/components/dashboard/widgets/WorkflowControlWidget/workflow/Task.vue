<!-- Copyright 2020 ForgeRock AS. All Rights Reserved

Use of this code requires a commercial software license with ForgeRock AS.
or with one of its affiliates. All use shall be exclusively subject
to such license between the licensee and ForgeRock AS. -->
<template>
  <Transition
    name="fade"
    mode="out-in"
    duration="250">
    <Component
      v-if="processDefinition !== null && taskForm !== null"
      :is="taskForm"
      @submit="submit"
      @cancel="cancel"
      :process-definition="processDefinition"
      :task-definition="task"
      :variables="variables" />
    <GenericTask
      v-else-if="processDefinition !== null"
      :variables="taskInstance.task.variables"
      :task-fields="taskInstance.task.taskDefinition.formProperties"
      :process-fields="taskInstance.task.formProperties"
      @submit="submit"
      @cancel="cancel" />
    <ClipLoader
      v-else
      class="m-auto"
      :color="loadingColor" />
  </Transition>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import { get, isNull } from 'lodash';
import styles from '@forgerock/platform-shared/src/scss/main.scss';
import { ClipLoader } from 'vue-spinner/dist/vue-spinner.min';
import GenericTask from './GenericTask';

/**
* @description Dashboard widget that displays the specific details of a task
*
* */
export default {
  name: 'Task',
  props: {
    taskInstance: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loadingColor: styles.baseColor,
    };
  },
  components: {
    ClipLoader,
    GenericTask,
  },
  computed: {
    process() {
      return this.taskInstance.process;
    },
    processDefinition() {
      if (this.process.processDefinition === null) {
        this.$emit('loadProcess', this.process);
      }
      return this.process.processDefinition;
    },
    formProperties() {
      return this.processDefinition ? this.processDefinition.formProperties : [];
    },
    task() {
      return this.taskInstance.task;
    },
    taskDetails() {
      // eslint-disable-next-line no-underscore-dangle
      return this.formProperties.reduce((acc, property) => acc.concat({ _id: property._id, name: property.name, value: this.task.variables[property._id] }), []);
    },
    variables() {
      return get(this, 'task.variables');
    },
    taskForm() {
      const { formGenerationTemplate } = this.task.taskDefinition;
      const initializeForm = formGenerationTemplate ? Function(`return ${formGenerationTemplate}`) : null // eslint-disable-line

      if (!isNull(initializeForm)) {
        return initializeForm();
      }
      return null;
    },
  },
  methods: {
    submit(formData) {
      this.$emit('completeTask', { id: this.task._id, formData });
    },
    cancel() {
      this.$emit('cancel', this.task._id);
    },
  },
};
</script>