import React from 'react';

import {objPropsToPromise} from '@shared/helpers';
import {deserializeUrlFilters} from '@client/containers/filters/hooks/useStoreFiltersInURL';
import {serializeAggsToSearchParams} from '@client/containers/kinds/book/filters/helpers/serializeAggsToSearchParams';
import {
  BooksFiltersContainer,
  getDefaultBooksFilters,
} from '@client/containers/kinds/book/filters/BooksFiltersContainer';

import {useI18n} from '@client/i18n';

import {AsyncRoute} from '@client/components/utils/asyncRouteUtils';
import {Breadcrumbs} from '@client/containers/Breadcrumbs';
import {Container} from '@client/components/ui';
import {ViewMode} from '@shared/enums';
import {
  Layout,
  LayoutHeaderTitle,
  LayoutViewData,
} from '@client/containers/layout';

import {BooksPaginationResultWithAggs} from '@api/repo';
import {
  BooksLink,
  TOP_BOOKS_PATH,
} from '../Links';

type TopBooksRouteRouteData = {
  layoutData: LayoutViewData,
  initialBooks: BooksPaginationResultWithAggs,
  initialFilters: any,
};

export const TopBooksRoute: AsyncRoute<TopBooksRouteRouteData> = (
  {
    layoutData,
    initialBooks,
    initialFilters,
  },
) => {
  const t = useI18n('routes.top_books');
  const breadcrumbs = (
    <Breadcrumbs
      items={[
        {
          id: 'books',
          node: (
            <BooksLink>
              {t('shared.breadcrumbs.books')}
            </BooksLink>
          ),
        },
        {
          id: 'trending books',
          node: t('shared.breadcrumbs.top_books'),
        },
      ]}
    />
  );

  return (
    <Layout {...layoutData}>
      <Container className='c-top-books-route'>
        <BooksFiltersContainer
          hideSidebar
          initialBooks={initialBooks}
          initialFilters={initialFilters}
          contentHeader={
            ({searchInput}) => (
              <>
                {breadcrumbs}
                <LayoutHeaderTitle
                  margin='medium'
                  toolbar={searchInput}
                >
                  {t('title')}
                </LayoutHeaderTitle>
              </>
            )
          }
        />
      </Container>
    </Layout>
  );
};

TopBooksRoute.displayName = 'TopBooksRoute';

TopBooksRoute.route = {
  path: TOP_BOOKS_PATH,
  exact: true,
};

TopBooksRoute.getInitialProps = async (attrs) => {
  const {
    api: {repo},
    search,
  } = attrs;

  const initialFilters = {
    ...getDefaultBooksFilters(),
    ...deserializeUrlFilters(search),
    viewMode: ViewMode.LIST,
  };

  const {
    initialBooks,
    layoutData,
  } = await objPropsToPromise(
    {
      layoutData: Layout.getInitialProps(attrs),
      initialBooks: repo.books.findAggregatedBooks(
        serializeAggsToSearchParams(initialFilters),
      ),
    },
  );

  return {
    initialBooks,
    initialFilters,
    layoutData,
  } as TopBooksRouteRouteData;
};
