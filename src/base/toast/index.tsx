import React, { memo } from 'react';
import { bemClass } from '@utils';
import { Icon } from '@base';
import './style.scss';

type ToastCategory = 'delete' | 'info' | 'success' | 'warning';
const blk = 'toast'
interface IToastProps {
    title?: string;
    message: string;
    category: ToastCategory;
    isConfirmable?: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
    className?: string;
}

const iconMap: Record<ToastCategory, string> = {
    delete: 'exclamation-triangle',
    info: 'info-circle',
    success: 'check-circle',
    warning: 'exclamation-triangle',
};

const Toast: React.FC<IToastProps> = ({
    title,
    message,
    category,
    isConfirmable,
    onConfirm,
    onCancel,
    className,
}) => {
    const rootClass = bemClass([blk, { [category]: category }, className]);
    const iconClass = bemClass([blk, 'icon', { [category]: category }]);
    const messageClass = bemClass([blk, 'message-container']);
    const actionsClass = bemClass([blk, 'actions']);
    const confirmButtonClass = bemClass([blk, 'confirm-button', { [category]: category }]);
    const cancelButtonClass = bemClass([blk, 'cancel-button', { [category]: category }]);

    return (
        <div className={rootClass}>
            <div className={bemClass([blk, 'title-icon-div'])}>
                <Icon name={iconMap[category]} size="small" className={iconClass} />
                {title && <h3>{title}</h3>}

            </div>
            <div className={messageClass}>
                <div>{message}</div>
            </div>
            {isConfirmable && category === 'delete' && (
                <div className={actionsClass}>
                    <button className={confirmButtonClass} onClick={onConfirm}>
                        Delete
                    </button>
                    <button className={cancelButtonClass} onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default memo(Toast);
