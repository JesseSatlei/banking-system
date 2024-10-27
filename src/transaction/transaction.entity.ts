import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  originAccount: number;

  @Column({ nullable: true })
  destinationAccount: number;

  @Column()
  amount: number;

  @CreateDateColumn()
  date: Date;
}
