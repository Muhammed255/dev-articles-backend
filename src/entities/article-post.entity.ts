import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { Comment } from "./comment.entity";
import { Topic } from "./topic.entity";
import { UserLikedPosts } from "./user-liked-posts.entity";
import { User } from "./user.entity";

@Entity({ name: "article_posts" })
export class ArticlePost extends BaseEntity {
	@Column({ type: "varchar", nullable: false })
	title: string;

	@Column({ type: "varchar", nullable: false })
	sub_title: string;

	@Column({ type: "varchar", nullable: false })
	content: string;

	@Column({ type: "varchar", nullable: true })
	article_image: string;

	@Column({ type: "varchar", nullable: true })
	cloudinary_id: string;

	@Column({ type: "boolean", nullable: false, default: true })
	is_public: boolean;

	@Column({ type: "boolean", nullable: false, default: false })
	hidden: boolean;

	@OneToMany(() => Comment, (c) => c.article, { cascade: true })
	comments: Comment[];

	@OneToMany(() => UserLikedPosts, (c) => c.article, { cascade: true })
	userLikedPosts: UserLikedPosts[];

	@ManyToOne(() => Topic, (top) => top.articles)
	@JoinColumn([{ name: "topicId", referencedColumnName: "id" }])
	topic: Topic;

	@ManyToOne(() => User, (user) => user.articles)
	@JoinColumn([{ name: "userId", referencedColumnName: "id" }])
	user: User;
}
