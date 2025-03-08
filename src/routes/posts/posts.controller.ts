import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorators/Auth.decorator'
import { AUTH_TYPES, CONDITION_GUARD } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsSetvice: PostsService) {}

  @Auth([AUTH_TYPES.Bearer, AUTH_TYPES.APIKey], { condition: CONDITION_GUARD.Or })
  @Get()
  getPosts() {
    return this.postsSetvice.getPosts()
  }

  @Post()
  @Auth([AUTH_TYPES.Bearer])
  createPost(@Body() body: any, @ActiveUser('userId') userId: number) {
    return this.postsSetvice.createPost(userId, body)
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsSetvice.getPost(id)
  }

  @Put(':id')
  updatePost(@Param('id') id: string, @Body() body: any) {
    return this.postsSetvice.updatePost(id, body)
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsSetvice.deletePost(id)
  }
}
