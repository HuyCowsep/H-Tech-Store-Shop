import React from 'react';
import { Modal, Image } from 'react-bootstrap';

const AvatarModal = ({ show, handleClose, imageSrc }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className="text-center p-4">
        <Image src={imageSrc} fluid />
      </Modal.Body>
    </Modal>
  );
};

export default AvatarModal;
