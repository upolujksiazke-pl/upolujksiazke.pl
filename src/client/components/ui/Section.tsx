import React, {ReactNode} from 'react';
import c from 'classnames';

import {BasicWrapperProps} from '@client/components/ui';

type SectionProps = BasicWrapperProps & {
  title?: ReactNode,
  spaced?: number,
  bordered?: boolean,
  subsection?: boolean,
  noContentSpacing?: boolean,
  contentClassName?: string,
  headerClassName?: string,
};

export const Section = (
  {
    title,
    spaced = 4,
    bordered = true,
    className,
    subsection,
    contentClassName,
    noContentSpacing,
    headerClassName,
    children,
  }: SectionProps,
) => (
  <section
    className={c(
      'c-section',
      spaced && `is-spaced-${spaced}`,
      bordered && 'is-divided',
      subsection && 'is-subsection',
      className,
    )}
  >
    {title && (
      <h2
        className={c(
          'c-section__header',
          headerClassName,
        )}
      >
        {title}
        <span className='c-section__header-underline' />
      </h2>
    )}

    <div
      className={c(
        'c-section__content',
        noContentSpacing && 'has-no-spacing',
        contentClassName,
      )}
    >
      {children}
    </div>
  </section>
);

Section.displayName = 'Section';
