export type CommentModel = {
  user: {
    name: string | null
    image: string | null
  }
} & {
  id: number
  createdAt: Date
  url: string
  text: string
  userId: string
  postId: number
}
