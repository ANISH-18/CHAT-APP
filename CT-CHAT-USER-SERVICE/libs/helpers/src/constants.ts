import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const syncuser = 'http://localhost:4001/api/v1/auth/syncuser';

export const canChat = {
  Yes: 1,
  No: 0,
};

export const PAGINATION = {
  // SORT_BY: 'id',
  PAGE_NUMBER: 1,
  SKIP: 0,
  TAKE: 10,
  RECORDS_PER_PAGE: 10,
};

export const PROBIZCA_SCOPE = {
  '1': 'probizcaAdmin',
  '2': 'probizcaBO',
  '3': 'probizcaEmp',
  '4': 'probizcaCust',
  '5': 'probizcaAff',
};
