import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { User } from "./user.js";

@Entity()
export class Task {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column("text")
	title: string;

	@Column("text", { nullable: true })
	description?: string;

	@Column("text")
	status: "TODO" | "DOING" | "DONE";

	@ManyToOne(() => User)
	@JoinColumn({ name: "ownerId" })
	owner: User;

	@Column("uuid", { nullable: true })
	ownerId?: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
