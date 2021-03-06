/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import Layout from './index';

const localVue = createLocalVue();
localVue.use(Vuex);

// https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const store = new Vuex.Store({
  state: {
    UserStore: {},
    ApplicationStore: {},
  },
  getters: {
    UserStore: (state) => state.UserStore,
    ApplicationStore: (state) => state.ApplicationStore,
  },
});

describe('Layout Component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Layout, {
      localVue,
      store,
      mocks: {
        $t: () => {},
      },
      propsData: {
        menuItems: [
          {
            columns: 'testColumns',
            displayName: 'test',
            icon: 'testIcon',
            order: 'testOrder',
            routeName: 'ListResource',
            resourceType: 'testType',
          },
          {
            displayName: 'Local Route Item',
            icon: '',
            routeName: 'Local Route',
          },
          {
            displayName: 'External URL Item',
            icon: '',
            url: 'http://example.com',
          },
        ],
      },
    });
  });

  it('Component successfully loaded', () => {
    expect(wrapper.name()).toEqual('Layout');
  });
});
