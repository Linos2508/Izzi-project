import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import {Ip} from './types';
import React from 'react';
import { Box, Card, CardContent, IconButton } from '@mui/material';
import {
  Delete as DeleteIcon,
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import Modal from '../../components/modal.tsx';
const BASE_API = 'https://baa4ascm5l.execute-api.us-east-1.amazonaws.com/Izzi/'

const Home = () => {
    const [data, setData] = React.useState<Ip[]>([]);
    const [search, setSearch] = React.useState('');
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const fetchData = React.useCallback(() => {
        setIsLoading(true);
        fetch(`${BASE_API}backend/ips/?search=${search}`,{
            method: 'GET'
        }).then(res => res.json())
        .then(response => {
            if(response){
                setData(response.data)
                setIsLoading(false);
            }
        }).catch((e) =>{
            alert(e)
        });
    },[search])
    
    const deleteIp = (id: number) => {
        fetch(`${BASE_API}backend/ips/?ip=${id}`,{
            method: 'DELETE'
        }).then(res => res.json())
        .then(response => {
            if(response){
                alert(response.message)
            }
            fetchData()
        }).catch((e) => {
            alert(e)
        });
    }

    React.useEffect(() => {
        fetchData()
    },[search, fetchData])

    const columns = React.useMemo<MRT_ColumnDef<Ip>[]>(() => [
        {
            accessorKey: 'ip',
            header: 'Ip',
        },
        {
            accessorKey: 'latitude',
            header: 'Latitude',
        },
        {
            accessorKey: 'longitude',
            header: 'Longitude',
        },
        {
            accessorKey: 'country',
            header: 'Country',
            size: 80
        },
        {
            accessorKey: 'city',
            header: 'City',
        },
        {
            accessorKey: 'type',
            header: 'Type',
            size: 50
        },
        {
            accessorKey: 'country_flag',
            header: 'Country Flag',
            Cell: ({cell}) => (
                <img alt="country-flag" src={cell.getValue() as string} width={50}/>
            )
        },
    ],[])

    const table = useMaterialReactTable({
        columns,
        data,
        enableColumnFilters: false,
        manualFiltering: true,
        onGlobalFilterChange: setSearch,
        state: { 
            globalFilter: search,
            isLoading: isLoading,
        },
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <Box>
                <IconButton onClick={() => deleteIp(row.original.id)}>
                    <DeleteIcon color='error' />
                </IconButton>
            </Box>
        ),
        positionActionsColumn: 'last',
        renderTopToolbarCustomActions: () => (
            <>
                <IconButton onClick={() => setIsOpen(true)}>
                    <AddIcon />
                </IconButton>
            </>
        ),
        enablePagination: false,
    });

    const addNewIp = (ip: string) => {
        const body = {
            "ip": ip
        }
        fetch(`${BASE_API}backend/ips/`,{
            method:'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(res => res.json())
        .then(response => {
            if(response.message){
                alert('success')
                fetchData()
            }
        }).catch((e) => {
            alert(e)
        })
    }

    return (
        <Card variant="outlined">
             <CardContent>
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={addNewIp}/>
                <MaterialReactTable table={table} />
             </CardContent>
        </Card>
    )
}

export default Home;