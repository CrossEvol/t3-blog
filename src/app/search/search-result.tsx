import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { type SearchedPost } from './page'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import {
  type ColDef,
  type ICellRendererParams,
  ModuleRegistry,
  type ValueFormatterParams,
} from '@ag-grid-community/core'
import { AgGridReact } from '@ag-grid-community/react'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-quartz.css'
import { type Tag } from '@prisma/client'
import { Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

ModuleRegistry.registerModules([ClientSideRowModelModule])

type PostColDef = SearchedPost & { actions?: unknown }

const PostsGrid = ({ posts }: IProps) => {
  const [rowData] = useState(posts)

  const [columnDefs] = useState<ColDef<PostColDef>[]>([
    {
      field: 'id',
      headerName: 'ID',
      filter: 'agNumberColumnFilter',
      sortable: true,
      width: 100,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: (params: ICellRendererParams<PostColDef>) => (
        <Button variant={'outline'}>
          <Link href={`/post/${params.data?.id}`}>
            <LinkIcon />
          </Link>
        </Button>
      ),
      sortable: false,
      width: 100,
    },
    { field: 'title', editable: false, width: 200 },
    {
      field: 'content',
      editable: false,
      width: 200,
      cellStyle: { whiteSpace: 'pre-wrap' },
    },
    { field: 'author.name', headerName: 'Author', editable: false, width: 180 },
    {
      field: 'comments',
      filter: 'agNumberColumnFilter',
      sortable: true,
      width: 180,
    },
    {
      field: 'topic.name',
      headerName: 'Topic',
      editable: false,
      width: 150,
      cellRenderer: (params: ICellRendererParams<PostColDef>) => (
        <div>
          {params.data?.topic !== null ? (
            <Badge variant="outline">{params.data?.topic?.name}</Badge>
          ) : (
            <div>Nil</div>
          )}
        </div>
      ),
    },
    {
      field: 'tags',
      editable: false,
      width: 200,
      valueFormatter: (params: ValueFormatterParams<PostColDef, Tag[]>) =>
        params.value?.map((tag) => tag.name).join('/') ?? '[ ]',
      cellStyle: { whiteSpace: 'nowrap' },
      cellRenderer: (params: ICellRendererParams<PostColDef>) => (
        <div>
          {params.data?.tags.length === 0 ? (
            <div>{'[ ]'}</div>
          ) : (
            <Badge variant="outline">
              {params.data?.tags.map((tag) => tag.name).join('/')}
            </Badge>
          )}
        </div>
      ),
    },
    {
      field: 'createdAt',
      filter: 'agDateColumnFilter',
      sortable: true,
      valueFormatter: (params: ValueFormatterParams<PostColDef, Date>) =>
        params.value!.toLocaleDateString(),
      // new Date(params.value).toLocaleDateString(),
      width: 180,
    },
    {
      field: 'updatedAt',
      filter: 'agDateColumnFilter',
      sortable: true,
      valueFormatter: (params: ValueFormatterParams<PostColDef, Date>) =>
        params.value!.toLocaleDateString(),
      width: 180,
    },
  ])

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    }
  }, [])

  return (
    <div className="h-screen">
      <div className={'ag-theme-quartz'} style={{ height: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection={true}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
    </div>
  )
}

interface IProps {
  posts: SearchedPost[]
}

const SearchResult = ({ posts }: IProps) => {
  return (
    <Accordion defaultValue="post-grid" type="single" collapsible>
      <AccordionItem value="post-grid">
        <AccordionTrigger>Result Posts :</AccordionTrigger>
        <AccordionContent>
          {posts.length === 0 ? (
            <div>No results.</div>
          ) : (
            <PostsGrid posts={posts} />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default SearchResult
