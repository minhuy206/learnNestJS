import { isNotFoundPrismaError } from 'src/shared/helpers'
import { PrismaService } from './../../shared/services/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { UpdatePostBodyDTO } from './post.dto'

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
      include: {
        author: {
          omit: { password: true },
        },
      },
    })
  }

  async getPost(postId: number, userId: number) {
    try {
      const post = await this.prismaService.post.findUniqueOrThrow({
        where: {
          id: postId,
          authorId: userId,
        },
        include: {
          author: {
            omit: { password: true },
          },
        },
      })
      return post
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw error
    }
  }

  async updatePost({ postId, userId, body }: { postId: number; userId: number; body: UpdatePostBodyDTO }) {
    try {
      const post = await this.prismaService.post.update({
        where: {
          id: postId,
          authorId: userId,
        },
        data: {
          title: body.title,
          content: body.content,
        },
        include: {
          author: {
            omit: { password: true },
          },
        },
      })
      return post
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw error
    }
  }

  async deletePost(postId: number, userId: number) {
    try {
      await this.prismaService.post.delete({
        where: {
          id: postId,
          authorId: userId,
        },
      })
      return true
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw error
    }
  }
}
