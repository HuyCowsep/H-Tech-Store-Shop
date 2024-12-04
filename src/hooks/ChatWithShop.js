import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import './css/Hooks.css';

const ChatWithShop = ({ show, handleClose }) => {
  const [messages, setMessages] = useState([
    { 
        sender: 'shop', 
        text: 'Chào bạn! Bạn có thắc mắc về sản phẩm nào không? Chúng tôi sẽ cố gắng giúp bạn tìm hiểu thêm về sản phẩm mà bạn quan tâm. Đừng ngần ngại hỏi bất kỳ câu hỏi nào bạn có.' 
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { sender: 'user', text: newMessage }]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Ngăn chặn việc mặc định làm thay đổi trong TextField
      handleSendMessage();
    }
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle className='ChatShop-title'>
        Chat với Cửa Hàng
        <IconButton onClick={handleClose} style={{ position: 'absolute', right: '5px', top: '5px' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="chat-container">
        <Box className="chat-box">
          <List>
            {messages.map((message, index) => (
              <ListItem
                key={index}
                className={message.sender === 'user' ? 'user' : 'shop'}
                alignItems="flex-start"
              >
                <ListItemText primary={message.text} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box display="flex" alignItems="center" mt={2}>
          <TextField
            fullWidth
            placeholder="Nhập tin nhắn của bạn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            variant="outlined"
            size="small"
            className="chat-input"
            onKeyDown={handleKeyPress}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            className="chat-send-button"
            size="large"
          >
            <SendIcon />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChatWithShop;
