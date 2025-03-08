import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorators/Auth.decorator'
import { AUTH_TYPES, CONDITION_GUARD } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { CreatePostBodyDTO, GetPostItemDTO, UpdatePostBodyDTO } from './post.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth([AUTH_TYPES.Bearer, AUTH_TYPES.APIKey], { condition: CONDITION_GUARD.Or })
  @Get()
  getPosts(@ActiveUser('userId') userId: number) {
    return this.postsService.getPosts(userId).then((posts) => posts.map((post) => new GetPostItemDTO(post)))
  }

  @Post()
  @Auth([AUTH_TYPES.Bearer])
  async createPost(@Body() body: CreatePostBodyDTO, @ActiveUser('userId') userId: number) {
    return new GetPostItemDTO(await this.postsService.createPost(userId, body))
  }

  @Get(':id')
  @Auth([AUTH_TYPES.Bearer])
  async getPost(@Param('id') id: string, @ActiveUser('userId') userId: number) {
    return new GetPostItemDTO(await this.postsService.getPost(Number(id), userId))
  }

  @Put(':id')
  @Auth([AUTH_TYPES.Bearer])
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostBodyDTO, @ActiveUser('userId') userId: number) {
    return new GetPostItemDTO(await this.postsService.updatePost({ postId: Number(id), userId, body }))
  }

  @Delete(':id')
  @Auth([AUTH_TYPES.Bearer])
  deletePost(@Param('id') id: string, @ActiveUser('userId') userId: number): Promise<boolean> {
    return this.postsService.deletePost(Number(id), userId)
  }
}
