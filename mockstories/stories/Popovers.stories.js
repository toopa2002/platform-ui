/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
import { storiesOf } from '@storybook/vue';
import Popovers from '../mocks/components/Popovers.vue';

storiesOf('Components-Mock|Popovers', module)
    .add('Popovers', () => ({
        components: { 'fr-popovers': Popovers },
        template: '<fr-popovers></fr-popovers>'
    }));