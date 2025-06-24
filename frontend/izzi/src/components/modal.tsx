import React from 'react';
import { ModalProps } from './types';
import { Box, Button, FormGroup, FormHelperText, IconButton, Modal as ModalMui, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { StyledBox } from './styles.tsx';

const Modal: React.FC<ModalProps> = ({isOpen, onClose, onSave}) => {
    const [value, setValue] = React.useState<string>('');
    const [message, setMessage] = React.useState<string>('');
    const isValidIPv4 = (ip) => {
        const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|1?\d{1,2})(\.(25[0-5]|2[0-4][0-9]|1?\d{1,2})){3}$/;
        return ipv4Pattern.test(ip);
    }
    const onSubmit = () => {
        if(isValidIPv4(value)){
            setValue('');
            setMessage('');
            onSave(value);
            onClose()
        } else {
            setMessage('Invalid ip, please try again')
        }
    }
    return (
        <ModalMui
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <StyledBox>
                <IconButton onClick={onClose} style={{position: 'fixed', top: '10px', right: '10px'}}>
                    <CloseIcon/>
                </IconButton>
                <Box>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add new ip
                    </Typography>
                </Box>
                <Box>
                    <FormGroup>
                        <TextField
                            required
                            id="ip-required"
                            label="Ip"
                            placeholder="0.0.0.0"
                            variant="standard"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                        {message && <FormHelperText error={true}>{message}</FormHelperText>}
                        <Button onClick={() => onSubmit()}>submit</Button>
                    </FormGroup>
                </Box>
            </StyledBox>
        </ModalMui>
    )
}

export default Modal