import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany
} from "typeorm";
import { Gender } from "../enum/gender.enum";
import { UserRole } from "../enum/user-role.enum";
import { ArticlePost } from "./article-post.entity";
import { BaseEntity } from "./base.entity";
import { Category } from "./category.entity";
import { Comment } from "./comment.entity";
import { Reply } from "./reply.entity";
import { Topic } from "./topic.entity";
import { UserLikedPosts } from "./user-liked-posts.entity";

@Entity({ name: "users" })
export class User extends BaseEntity {
	@Column({ type: "varchar", nullable: false })
	name: string;

	@Column({ type: "varchar", nullable: false, unique: true })
	username: string;

	@Column({ type: "varchar", nullable: false, unique: true })
	email: string;

	@Column({ type: "varchar", nullable: false })
	password: string;

	@Column({ type: "varchar", nullable: true })
	accessToken: string;

	@Column({ type: "varchar", nullable: true })
	bio: string;

	@Column({ type: "varchar", nullable: true })
	imageUrl: string;

	@Column({ type: "varchar", nullable: true })
	cloudinary_id: string;

	@Column({ type: "enum", enum: Gender, nullable: true })
	gender: Gender;

	@Column({ type: "varchar", nullable: true })
	phone_number: string;

	@Column({ type: "varchar", nullable: true })
	stackoverflow: string;

	@Column({ type: "varchar", nullable: true })
	linked_in: string;

	@Column({ type: "varchar", nullable: true })
	address: string;

	@Column({ type: 'timestamptz', nullable: true })
	birthdate: Date

	@Column({ type: "enum", enum: UserRole, default: UserRole.USER })
	role: UserRole;

	@OneToMany(() => Category, (cat) => cat.user, { cascade: true })
	categories: Category[];

	@OneToMany(() => Topic, (top) => top.user, { cascade: true })
	topics: Topic[];

	@OneToMany(() => Comment, (comment) => comment.commentator, { cascade: true })
	comments: Comment[];

	@OneToMany(() => Reply, (reply) => reply.replier, { cascade: true })
	replies: Reply[];

	@OneToMany(() => ArticlePost, (art) => art.user, { cascade: true })
	articles: ArticlePost[];

	@OneToMany(() => UserLikedPosts, (c) => c.user, { cascade: true })
	userLikedPosts: UserLikedPosts[];

	@ManyToMany(type => User)
	@JoinTable()
  followers: User[];
}
