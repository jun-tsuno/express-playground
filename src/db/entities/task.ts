import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
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
	owner: User;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
