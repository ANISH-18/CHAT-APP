import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageRef } from '../models';

export class MessageRefRepository {
  constructor(
    @InjectModel(MessageRef.name)
    private readonly messageRef: Model<MessageRef>,
  ) {}


  async createNotifcations()[]
}
