import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column("text")
	name: string;

	@Column("text", { unique: true })
	email: string;

	@Column("text")
	passwordHash: string;

	@Column("text", { nullable: true })
	refreshToken: string | null;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
