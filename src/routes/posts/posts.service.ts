import { PrismaService } from './../../shared/services/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  getPosts(userId: number) {
    return this.prismaService.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          omit: { password: true },
        },
      },
    })
  }

  createPost(userId: number, body: any) {
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    })
  }

  getPost(id: string) {
    return `Post ${id}`
  }

  updatePost(id: string, body: any) {
    return `Updated post ${id}: ${body}`
  }

  deletePost(id: string) {
    return `Deleted post ${id}`
  }
}
