import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Topic } from "./topic.entity";
import { User } from "./user.entity";

@Entity({name: 'categories'})
export class Category extends BaseEntity{

	@Column({type: 'varchar', nullable: false})
	name: string;

	@Column({type: 'varchar', nullable: false})
	description: string;


	@ManyToOne(() => User, user => user.categories)
	@JoinColumn([{name: 'userId', referencedColumnName: 'id'}])
	user: User

	@OneToMany(() => Topic, top => top.category, {cascade: true})
	topics: Topic[];
}