import React from 'react';
import {StaticRouterProps} from 'react-router';

import {ENV} from '@client/constants/env';

import {AsyncRouterRouteInfo} from '@client/components/utils/asyncRouteUtils';
import {ModalsContextProvider} from '@client/hooks/useModal';
import {ProvideI18n} from '@client/i18n/ProvideI18n';
import {AjaxAPIContext} from '@client/modules/api/client/hooks/useAjaxAPIClient';
import {AjaxAPIClient} from '@client/modules/api/client/AjaxAPIClient';
import {
  AsyncRouter,
  ViewDataProvider,
} from '@client/components';

import {HomeRoute} from './Home';
import {BookRoute} from './Book';
import {BooksRoute} from './Books';
import {BooksCategoryRoute} from './BooksCategory';
import {AuthorRoute} from './Author';
import {AuthorsRoute} from './Authors';
import {TopBooksRoute} from './TopBooks';

export const APP_ROUTES_LIST: AsyncRouterRouteInfo[] = [
  {
    component: HomeRoute,
  },
  {
    component: BookRoute,
  },
  {
    component: BooksRoute,
  },
  {
    component: BooksCategoryRoute,
  },
  {
    component: AuthorsRoute,
  },
  {
    component: AuthorRoute,
  },
  {
    component: TopBooksRoute,
  },
];

export type PageRootProps = {
  routerConfig?: StaticRouterProps,
  initialViewData?: any,
};

export const PageRoot = ({initialViewData, routerConfig}: PageRootProps) => (
  <ViewDataProvider initialData={initialViewData}>
    {(viewData) => (
      <ProvideI18n
        lang={viewData.lang.current}
        translations={viewData.lang.translations}
      >
        <AjaxAPIContext.Provider
          value={
            new AjaxAPIClient(
              {
                url: ENV.client.apiConfig.url,
              },
            )
          }
        >
          <ModalsContextProvider>
            <AsyncRouter
              {...routerConfig}
              routes={APP_ROUTES_LIST}
            />
          </ModalsContextProvider>
        </AjaxAPIContext.Provider>
      </ProvideI18n>
    )}
  </ViewDataProvider>
);
