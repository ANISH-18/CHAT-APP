import { Injectable } from '@nestjs/common';
import { csvRecords, CsvMappingInterface } from './dto/types';
import { Readable } from 'stream';
import * as csvParser from 'csv-parser';

@Injectable()
export class ImportsModuleHelper {
  //IMPORT MODULE HELPER METHODS
  //Mapping CSV data
  mapCsvData1(typedCsvData): csvRecords {
    return typedCsvData.map((data) => ({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      role: data.role,
      org_id: data.org_id,
      ref_userId: data.ref_userId,
      profilePic: data.profilePic,
      address: data.address,
      parent_id: data.parent_id,
      phoneNumber: data.phoneNumber,
      businessName: data.businessName,
      userData: data.userData ? JSON.parse(data.userData) : undefined,
    }));
  }

  mapCsvData(typedCsvData): csvRecords {
    return typedCsvData.map((data) => ({
      firstName: this.findMatchingColumn(data, this.columnMappings.firstName),
      lastName: this.findMatchingColumn(data, this.columnMappings.lastName),
      email: this.findMatchingColumn(data, this.columnMappings.email),
      username: this.findMatchingColumn(data, this.columnMappings.username),
      role: this.findMatchingColumn(data, this.columnMappings.role),
      org_id: this.findMatchingColumn(data, this.columnMappings.orgId),
      address: this.findMatchingColumn(data, this.columnMappings.address),
      ref_userId: this.findMatchingColumn(data, this.columnMappings.ref_userId),
      profilePic: this.findMatchingColumn(data, this.columnMappings.profilePic),
      // Add other fields as needed
    }));
  }

  private readonly columnMappings: CsvMappingInterface = {
    firstName: ['firstName', 'first_name', 'fname', 'given_name', 'givenName'],
    lastName: ['lastName', 'last_name', 'lname', 'family_name', 'familyName'],
    email: ['email', 'e-mail', 'user_email', 'userEmail'],
    username: ['username', 'user_name', 'userName'],
    role: ['role_id', 'user_role', 'userRole'],
    orgId: ['org_id', 'organization_id', 'organizationId'],
    address: ['address', 'Address', 'user_address', 'userAddress'],
    ref_userId: ['ref_userId', 'userId'],
    profilePic: ['profile_pic', 'profilePic', 'profileImagePath'],
    // Add other field mappings as needed
  };

  private findMatchingColumn(
    row: Record<string, any>,
    possibleColumnNames: string[],
  ): any {
    const matchingColumn = possibleColumnNames.find(
      (columnName) => row[columnName] !== undefined,
    );
    return matchingColumn ? row[matchingColumn] : null;
  }

  //PARSE CSV
  async parseCSV(file) {
    const stream = Readable.from(file.buffer.toString());

    return await this.parseFile(stream);
  }

  private async parseFile(stream: Readable) {
    const results = [];

    return new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }
}
