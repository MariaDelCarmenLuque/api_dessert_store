import { PartialType } from '@nestjs/swagger';

import { CreateDessertDto } from './create-dessert.dto';

export class UpdateDessertDto extends PartialType(CreateDessertDto) {}
