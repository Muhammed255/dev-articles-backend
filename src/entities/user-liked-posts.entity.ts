import { Column, Entity, ManyToOne } from "typeorm";
import { RelationType } from "../enum/relation-type.enum";
import { ArticlePost } from "./article-post.entity";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity({name: "users_liked_posts"})
export class UserLikedPosts extends BaseEntity {

	@Column({type: 'integer', nullable: false})
	postId: number

	@Column({type: 'integer', nullable: false})
	userId: number

	// relation type between user and post
	@Column({type: 'enum', enum: RelationType, nullable: false, default: RelationType.LIKE})
	type: RelationType

	@ManyToOne(() => User, (user) => user.userLikedPosts)
	user: User;

	@ManyToOne(() => ArticlePost, (article) => article.userLikedPosts)
	article: ArticlePost;

}