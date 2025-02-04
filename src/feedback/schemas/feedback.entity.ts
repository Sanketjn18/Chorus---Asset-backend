import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Asset } from 'src/assets/schemas/assets.entity';

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  // Maps feedback to the `deviceId` field in the Asset table
  @ManyToOne(() => Asset, (asset) => asset.deviceId, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'deviceId', referencedColumnName: 'deviceId' })
  asset: Asset;

  @Column()
  deviceId: string; // Refers to the `deviceId` of the `Asset` table

  @Column({ nullable: true })
  userEmail: string; // Refers to the `email` of the `User` table

  @Column({ nullable: true })
  zone: string; // Optional field for zone information

  @Column({ type: 'enum', enum: ['thumb_up', 'thumb_down'], nullable: true })
  feedback: 'thumb_up' | 'thumb_down'; // Feedback value

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Timestamp for when feedback was created
}
