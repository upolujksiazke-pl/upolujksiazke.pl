import React from 'react';

import {objPropsToPromise} from '@shared/helpers';
import {useI18n} from '@client/i18n';

import {AsyncRoute} from '@client/components/utils/asyncRouteUtils';
import {BookAuthorRecord} from '@api/types';
import {Breadcrumbs} from '@client/containers/Breadcrumbs';
import {Container} from '@client/components/ui';
import {LettersAuthorsSection} from '@client/containers/kinds/author';
import {
  Layout,
  LayoutHeaderTitle,
  LayoutViewData,
} from '@client/containers/layout';

import {AUTHORS_PATH} from '../Links';

type AuthorsRouteData = {
  layoutData: LayoutViewData,
  letter: {
    current: string,
    authorsLetters: string[],
    authors: BookAuthorRecord[],
  },
};

export const AuthorsRoute: AsyncRoute<AuthorsRouteData> = (
  {
    layoutData,
    letter,
  },
) => {
  const t = useI18n('routes.authors');

  return (
    <Layout {...layoutData}>
      <Container className='c-book-route'>
        <Breadcrumbs
          items={[
            {
              id: 'authors',
              node: t('shared.breadcrumbs.authors'),
            },
          ]}
        />

        <LayoutHeaderTitle>
          {t('title', [letter.current])}
        </LayoutHeaderTitle>

        <LettersAuthorsSection
          letter={letter.current}
          letters={letter.authorsLetters}
          authors={letter.authors}
        />
      </Container>
    </Layout>
  );
};

AuthorsRoute.displayName = 'AuthorsRoute';

AuthorsRoute.route = {
  path: AUTHORS_PATH,
  exact: true,
};

AuthorsRoute.getInitialProps = async (attrs) => {
  const {
    api: {repo},
    match: {
      params: {
        letter = 'A',
      },
    },
  } = attrs;

  const {
    layoutData,
    authors,
    firstAuthorsLetters,
  } = await objPropsToPromise(
    {
      layoutData: Layout.getInitialProps(attrs),
      firstAuthorsLetters: repo.authors.findAuthorsFirstNamesLetters(),
      authors: repo.authors.findAll(
        {
          firstLetters: [
            decodeURIComponent(letter),
          ],
        },
      ),
    },
  );

  return {
    layoutData,
    letter: {
      current: letter,
      authorsLetters: firstAuthorsLetters,
      authors: authors.items,
    },
  } as AuthorsRouteData;
};