import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { DashboardController } from '../controllers/dashboardController';
import { ArrowLeft, Send, MoreVertical, Phone, Video } from 'lucide-react';

const MessageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const messageData = DashboardController.getMessageById(id);
    if (!messageData) {
      navigate('/dashboard');
      return;
    }
    // Deep clone to allow for local modifications before persisting
    setMsg(JSON.parse(JSON.stringify(messageData)));
    DashboardController.markMessageAsRead(id);
  }, [id, navigate]);

  useEffect(() => {
    // Scroll to bottom on load or new message
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msg?.thread]);

  if (!msg) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newChat = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: "You",
      time: "Just now",
      isSender: true
    };

    setMsg(prev => ({
      ...prev,
      thread: [...prev.thread, newChat]
    }));
    setInputValue('');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors mr-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="relative">
               <img src={msg.avatar} alt={msg.sender} className="w-10 h-10 rounded-full border border-gray-200 object-cover bg-gray-50 p-1" />
               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">{msg.sender}</h2>
              <p className="text-[13px] text-gray-500 font-medium leading-none">{msg.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400 hidden sm:flex">
             <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Phone className="w-4 h-4" /></button>
             <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><Video className="w-4 h-4" /></button>
             <button className="p-2 hover:bg-gray-50 rounded-full transition-colors"><MoreVertical className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 flex flex-col gap-6">
           <div className="text-center">
             <span className="bg-gray-100 text-gray-400 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Today</span>
           </div>
           
           {msg.thread.map((chat) => (
             <div key={chat.id} className={`flex ${chat.isSender ? 'justify-end' : 'justify-start'}`}>
                {!chat.isSender && (
                  <img src={msg.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200 object-cover bg-white p-0.5 mr-3 mt-auto mb-1 flex-shrink-0 hidden sm:block" />
                )}
                <div className={`flex flex-col ${chat.isSender ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%]`}>
                  <div 
                    className={`px-4 py-2.5 rounded-2xl shadow-sm text-[15px] leading-relaxed relative ${
                      chat.isSender 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                    }`}
                  >
                    {chat.text}
                  </div>
                  <span className="text-[11px] font-semibold text-gray-400 mt-2 mx-1">{chat.time}</span>
                </div>
             </div>
           ))}
           <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 z-10">
           <form onSubmit={handleSend} className="flex gap-3">
             <input 
               type="text" 
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               placeholder="Write a message..." 
               className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder-gray-400"
             />
             <button 
               type="submit" 
               disabled={!inputValue.trim()}
               className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                 inputValue.trim() 
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
               }`}
             >
               <Send className="w-5 h-5 ml-0.5" />
             </button>
           </form>
        </div>
      </div>
    </Layout>
  );
};

export default MessageDetails;
