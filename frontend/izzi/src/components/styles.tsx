import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    [theme.breakpoints.down('sm')]: {
        width: 200
    },
    backgroundColor: theme.palette.background.paper,
    borderRadius: '20px',
    padding: 32,
}))