import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/commom/dto/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create.dto';

@Injectable()
export class TasksService {
  constructor(
    private prismaService: PrismaService,
  ) {}

  async findAll(pagination: PaginationDto) {
    try {
      const { limit, offset = 0 } = pagination

      const tasks = await this.prismaService.tasks.findMany({
        select: {
          id: true,
          title: true,
          deadline: true,
          comment: true,
          status: true,
          priority: true, 
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: limit,
        skip: offset,
      })

      return tasks
    } catch (error) {
      throw new HttpException("Error fetching tasks", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOne(id: string) {
    try {
      const task = await this.prismaService.tasks.findFirst({
        where: {
          id: id
        },
        select: {
          id: true,
          title: true,
          deadline: true,
          comment: true,
          status: true,
          priority: true, 
        },
      })

      if(!task) throw new HttpException("Task not found", HttpStatus.NOT_FOUND)

      return task
    } catch (error) {
      throw new HttpException("Error fetching tasks", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createOne(data: CreateTaskDto) {
    try {
      const task = await this.prismaService.tasks.create({
        data: {
          title: data.title,
          deadline: new Date(data.deadline),
          comment: data.comment,
          status: data.status,
          priority: data.priority
        },
        select: {
          id: true,
          title: true,
          deadline: true,
          comment: true,
          status: true,
          priority: true, 
        }
      })

      return task
    } catch (error) {
      throw new HttpException("Error creating task", HttpStatus.INTERNAL_SERVER_ERROR)      
    }
  }
}
