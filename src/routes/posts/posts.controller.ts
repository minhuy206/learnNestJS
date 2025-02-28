import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsSetvice: PostsService) {}

  @Get()
  getPosts() {
    return this.postsSetvice.getPosts()
  }

  @Post()
  createPost(@Body() body: any) {
    return this.postsSetvice.createPost(body)
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
