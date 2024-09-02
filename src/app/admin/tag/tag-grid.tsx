'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import {
  type ColDef,
  type ICellRendererParams,
  ModuleRegistry,
  type NewValueParams,
} from '@ag-grid-community/core'
import { AgGridReact } from '@ag-grid-community/react'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-quartz.css'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { type TagWithCount } from './page'

ModuleRegistry.registerModules([ClientSideRowModelModule])

// const gridDiv = document.querySelector('#myGrid')

interface IProps {
  tags: TagWithCount[]
}

type TagColDef = TagWithCount & { actions: unknown }

const TagGrid = ({ tags }: IProps) => {
  const [rowData, setRowData] = useState(
    tags.map((tag) => ({ ...tag, actions: {} })),
  )
  const updateTopic = api.tag.update.useMutation({
    onSuccess(data, _variables, _context) {
      setRowData(
        rowData.map((item) =>
          item.id === data.id ? { ...item, ...data } : item,
        ),
      )
    },
    onError(error, _variables, _context) {
      console.log(error)
    },
  })

  const deleteTopic = api.tag.delete.useMutation({
    onSuccess(data, _variables, _context) {
      setRowData(rowData.filter((item) => item.id !== data.id))
    },
    onError(error, _variables, _context) {
      console.log(error)
    },
  })

  const [columnDefs] = useState<ColDef<TagColDef>[]>([
    {
      field: 'id',
      checkboxSelection: true,
      editable: false,
      flex: 1,
    },
    { field: 'count', flex: 1 },
    {
      field: 'name',
      flex: 1,
      editable: true,
      onCellValueChanged(event: NewValueParams<TagColDef, string>) {
        console.log(event)
        updateTopic.mutate({
          id: event.data.id,
          name: event.newValue!,
          description: event.data.description,
        })
      },
    },
    {
      field: 'description',
      editable: true,
      flex: 1,
      onCellValueChanged(event: NewValueParams<TagColDef, string>) {
        console.log(event)
        updateTopic.mutate({
          id: event.data.id,
          name: event.data.name,
          description: event.newValue!,
        })
      },
    },
    { field: 'createdAt', flex: 1 },
    { field: 'updatedAt', flex: 1 },
    {
      headerName: 'Actions',
      filter: null,
      field: 'actions',
      cellRenderer: (params: ICellRendererParams<TagColDef>) => 
        <div className="space-x-4">
          <Button variant={'outline'}>
            <Link href={`/tag/${params.data?.name}`}>Posts</Link>
          </Button>
          <Button
            variant={'destructive'}
            onClick={() => deleteTopic.mutate({ id: params.data!.id })}
          >
            Delete
          </Button>
        </div>
      ,
      flex: 1,
      editable: false,
      sortable: false,
    },
  ])

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    }
  }, [])

  return (
    <div className={'ag-theme-quartz'} style={{ height: 600 }}>
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
  )
}

export default TagGrid
