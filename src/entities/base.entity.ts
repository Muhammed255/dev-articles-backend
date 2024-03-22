import {
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

export abstract class BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createDateTime: Date;

	@Column({ type: "varchar", length: 300, default: null })
	createdBy: string;

	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	lastChangedDateTime: Date;

	@Column({ type: "varchar", length: 300, default: null })
	lastChangedBy: string;
}
