import { Todo } from 'src/todo/entities/todo.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ unique: true })
  emailConfirmationToken: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[] | [];
}
