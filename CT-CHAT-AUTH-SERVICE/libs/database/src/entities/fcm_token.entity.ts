

import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { UserEntity } from './user.entity';

  export enum DEVICE_TYPE {
    WEB = 1,
    ANDROID = 2,
    IOS = 3,
  }

  @Entity('fcm_tokens')
  export class FCMTokenEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => UserEntity, (user) => user.fcmTokens, { onDelete: 'CASCADE' })
    user: UserEntity;
  
    @Column({ type: 'text', nullable: true })
    fcmToken: string;
  
    @Column({
        type: 'enum',
        enum: DEVICE_TYPE,
        nullable: true,
      })
    deviceType: DEVICE_TYPE; 

    @Column({type: 'string', nullable: true})
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastUsed: Date;
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    public updatedAt!: Date;
  
    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', default: null })
    public deletedAt!: Date;
  }
  