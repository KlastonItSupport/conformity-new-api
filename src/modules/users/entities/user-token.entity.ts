import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user_tokens')
export class UserToken {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column({ name: 'token_hash' })
  tokenHash: string;

  @Column({ name: 'created_at', default: new Date() })
  createdAt: Date;

  @Column({
    name: 'expires_in',
    default: new Date(new Date().getTime() + 1000 * 60 * 60 * 4), // 4 hours
  })
  expiresIn: Date;
}
