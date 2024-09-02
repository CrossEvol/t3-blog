import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface IProps {
  count: number
  current: number
}

export default function PageBar({ count, current }: IProps) {
  const pageCount = Math.ceil(count / 10)

  const pageIndices = [
    current - 2,
    current - 1,
    current,
    current + 1,
    current + 2,
  ].filter((index) => index > 0 && index < pageCount)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className="w-28 bg-blue-500 opacity-100 hover:bg-blue-500 hover:opacity-90 text-white"
            href={current > 1 ? `/page/${current - 1}` : '#'}
          />
        </PaginationItem>
        {pageIndices.map((index) => 
          <PaginationItem key={index}>
            <PaginationLink
              isActive={index === current}
              href={`/page/${index}`}
            >
              {index}
            </PaginationLink>
          </PaginationItem>
        )}
        {current < pageCount ? 
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
         : null}
        <PaginationItem>
          <PaginationNext
            className="w-28 bg-blue-500 opacity-100 hover:bg-blue-500 hover:opacity-90 text-white"
            href={current < pageCount ? `/page/${current + 1}` : '#'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
