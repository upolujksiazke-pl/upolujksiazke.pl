import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {BookEntity} from '../../Book.entity';
import {BookVolumeEntity} from '../volume/BookVolume.entity';
import {BookAvailabilityEntity} from './BookAvailability.entity';
import {BookAvailabilityService} from './BookAvailability.service';

@Module(
  {
    imports: [
      TypeOrmModule.forFeature(
        [
          BookEntity,
          BookVolumeEntity,
          BookAvailabilityEntity,
        ],
      ),
    ],
    providers: [
      BookAvailabilityService,
    ],
    exports: [
      BookAvailabilityService,
    ],
  },
)
export class BookAvailabilityModule {}