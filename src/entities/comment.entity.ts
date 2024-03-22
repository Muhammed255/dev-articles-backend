import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ArticlePost } from "./article-post.entity";
import { BaseEntity } from "./base.entity";
import { Reply } from "./reply.entity";
import { User } from "./user.entity";

@Entity({name: "comments"})
export class Comment extends BaseEntity {

	@Column({type: 'varchar', nullable: false})
	comment: string;

	@ManyToOne(() => ArticlePost, art => art.comments)
	@JoinColumn([{name: 'articleId', referencedColumnName: 'id'}])
	article: ArticlePost;

	@ManyToOne(() => User, user => user.comments)
	@JoinColumn([{name: 'commentator', referencedColumnName: 'id'}])
	commentator: User;

	@OneToMany(() => Reply, reply => reply.comment)
	replies: Reply[];
}