import { Ip } from "../views/home/types";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (ip: string) => void;
}