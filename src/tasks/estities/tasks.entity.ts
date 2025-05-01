export class TaskEntity {
  id: string
  title: string
  priority: string
  deadline: Date
  status: string
  comment: string
  createdAt?: Date
  updatedAt?: Date
}