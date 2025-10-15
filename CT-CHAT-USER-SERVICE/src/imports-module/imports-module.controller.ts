import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Logger,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ImportsModuleService } from './imports-module.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

import { performance } from 'perf_hooks';
import { ImportsModuleHelper } from './imports-module.helper';
import { csvRecords } from './dto/types';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SyncCreateUserDto } from './dto/syncCreateUser.dto';
import { DeleteUserDto } from './dto/delete-User.dto';
import { ApiKeyGuard } from '@jwt_auth';

@ApiTags('Imports Module')
@Controller('imports')
export class ImportsModuleController {
  constructor(
    private readonly importsModuleService: ImportsModuleService,
    private readonly importsModuleHelper: ImportsModuleHelper,
  ) {}

  //CODE Improvement
  @ApiOperation({ summary: 'Import Users From CSV' })
  @ApiResponse({
    status: 201,
    description: 'Csv Read Successfully...',
  })
  @ApiConflictResponse({
    status: 409,
    description: 'User already exists',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Post('users')
  @ApiBody({
    description: 'CSV file to import',
    type: Buffer,
  })
  @UseInterceptors(FileInterceptor('file'))
  async importUsers(@UploadedFile() file: Multer.File): Promise<any> {
    try {
      const startTime = performance.now();
      //Parse CSV
      const csvData = await this.importsModuleHelper.parseCSV(file);

      // Logger.log('csvData', csvData);
      //Interface Validation
      const typedCsvData = csvData as csvRecords[];

      const singleData = this.importsModuleHelper.mapCsvData1(typedCsvData);
      // Logger.log('singleData', singleData);

      // const csvmaptime = performance.now();
      // const insertStarttime = performance.now();
      //Save Users
      await this.importsModuleService.saveUsers(singleData);

      const endTime = performance.now();
      const elapsedTime = endTime - startTime;

      Logger.log(`Time taken to process CSV: ${elapsedTime} milliseconds`);

      return {
        message: "Csv Read Successfully...'",
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //User Insert Single API
  // @UseGuards(ApiKeyGuard)
  @Post('createUser')
  async syncCreateUser(@Body() syncCreateUserDto: SyncCreateUserDto) {
    Logger.log('Create User');
    return await this.importsModuleService.syncCreateUser(syncCreateUserDto);
  }

  @Delete('deleteUser')
  async deleteUser(@Query() deleteUserDto: DeleteUserDto) {
    return this.importsModuleService.deleteUser(deleteUserDto);
  }
}
