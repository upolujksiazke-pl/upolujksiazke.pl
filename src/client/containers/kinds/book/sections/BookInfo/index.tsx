import React from 'react';

import {useI18n} from '@client/i18n';
import {formatBookTitle} from '@client/helpers/logic';

import {BookFullInfoRecord} from '@api/types';
import {
  ExpandableDescriptionBox,
  Divider,
  Section,
} from '@client/components/ui';

import {BookAuthorsRow} from '../../cards/BookCard/BookAuthorsRow';
import {BookCover} from '../../cards/BookCard/BookCover';
import {BookPriceBox} from './BookPriceBox';
import {BookProperties} from './BookProperties';

type BookInfoProps = {
  book: BookFullInfoRecord,
};

export const BookInfo = ({book}: BookInfoProps) => {
  const t = useI18n();
  const {primaryRelease, authors} = book;

  const formattedTitle = formatBookTitle(
    {
      t,
      book,
    },
  );

  return (
    <Section
      spaced={3}
      className='c-book-info-section'
    >
      <div className='c-book-info-section__cover'>
        <BookCover
          alt={formattedTitle}
          book={book}
          forceRatio={false}
        />
      </div>

      <div className='c-book-info-section__info'>
        <h1 className='c-book-info-section__header'>
          {formattedTitle}
        </h1>

        <div className='c-book-info-section__author'>
          {`${t('book.created_by')}:`}
          <BookAuthorsRow
            className='ml-1'
            authors={authors}
            linkProps={{
              underline: true,
            }}
            block={false}
            separated
          />
        </div>

        <ExpandableDescriptionBox
          maxCharactersCount={900}
          text={
            primaryRelease.description || t('book.no_description')
          }
        />

        <Divider />

        <BookProperties book={book} />
      </div>

      <BookPriceBox book={book} />
    </Section>
  );
};

BookInfo.displayName = 'BookInfo';