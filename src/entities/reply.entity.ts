import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Comment } from "./comment.entity";
import { User } from "./user.entity";

@Entity({name: 'replies'})
export class Reply extends BaseEntity {

	@Column({type: 'varchar', nullable: false})
	reply: string;

	@ManyToOne(() => User, user => user.replies)
	@JoinColumn([{name: 'replier', referencedColumnName: 'id'}])
	replier: User;

	@ManyToOne(() => Comment, c => c.replies, {onDelete: 'CASCADE', onUpdate: 'CASCADE', cascade: true})
	@JoinColumn([{name: 'commentId', referencedColumnName: 'id'}])
	comment: Comment;
}