export interface AdminTicketItem {
  id: number
  code: string
  subject: string
  details: string
  files: string[]
  status: "pending" | "open" | "solved"
  viewed: boolean
  clientViewed: boolean
  createdAt: string
  updatedAt: string
  userName: string
  userEmail: string
  userImage: string | null
  lastReplyAt: string
  replyCount: number
}

export interface AdminTicketReplyItem {
  id: number
  ticketId: number
  userId: string
  reply: string
  files: string[]
  createdAt: string
  authorName: string
  authorRole: string
  authorImage: string | null
}

export interface AdminTicketDetail extends AdminTicketItem {
  replies: AdminTicketReplyItem[]
}

export interface AdminTicketsResponse {
  tickets: AdminTicketItem[]
  total: number
  pendingCount: number
  openCount: number
  solvedCount: number
}
