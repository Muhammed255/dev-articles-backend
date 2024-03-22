import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ArticlePost } from "./article-post.entity";
import { BaseEntity } from "./base.entity";
import { Category } from "./category.entity";
import { User } from "./user.entity";

@Entity({name: 'topics'})
export class Topic extends BaseEntity {

	@Column({type: 'varchar', nullable: false})
	name: string;

	@Column({type: 'varchar', nullable: false})
	description: string;

	@Column({type: 'varchar', nullable: true, default: null})
	image: string;

	@Column({type: 'varchar', nullable: true, default: null})
	cloudinary_id: string;


	@OneToMany(() => ArticlePost, art => art.topic, {cascade: true})
	articles: ArticlePost[];

	@ManyToOne(() => Category, cat => cat.topics)
	@JoinColumn([{name: 'categoryId', referencedColumnName: 'id'}])
	category: Category

	@ManyToOne(() => User, user => user.categories)
	@JoinColumn([{name: 'userId', referencedColumnName: 'id'}])
	user: User

}