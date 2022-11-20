import React, { useRef, useState } from 'react'
import client from '../../configs/aws.lex.config'
import { Form, Input } from 'antd';
import './index.scss';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import helpers from '../../helpers';
let params = {
    "botAliasId": process.env.REACT_APP_BOOT_CHAT_ID,
    "botId": process.env.REACT_APP_BOOT_CHAT_ID,
    "localeId": "en_US",
    "sessionId": sessionStorage.getItem('session_id'),
    // "conversationMode": "text"
}
let defaultMessageList = [
    {
        type: 'bot',
        content: "Xin chào, tôi có thể giúp gì cho bạn ?"
    }
]
const showMessages = (mess) => {
    return mess.map((item, index) => {
        if (item.type === 'bot') {
            return (
                <div className="message-box-holder" key={index}>
                    <div className="message-sender">
                        Bot
                    </div>
                    <div className="message-box message-partner">
                        <div dangerouslySetInnerHTML={{ __html: item.content }} />
                    </div>
                </div>
            )
        } else if (item.type === 'user') {
            return (
                <div className="message-box-holder" key={index}>
                    <div className="message-box">
                        {item.content}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="message-box-holder" key={index}>
                    <div className="message-sender">
                        Bot
                    </div>
                    <div className="message-box message-partner">
                        <div className="spinner">
                            <div className="bounce1"></div>
                            <div className="bounce2"></div>
                            <div className="bounce3"></div>
                        </div>
                    </div>
                </div>
            )
        }
    })
}
let isSubscribe = false;
export default function ChatBox() {
    const [showBot, setShowBot] = useState(false);
    const [messages, setMessages] = useState(defaultMessageList.flat())
    const [form] = Form.useForm();
    const messagesEndRef = useRef(null);
    const inputText = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    const sendMessage = async (text) => {
        try {
            form.resetFields()
            setMessages(prev => [...prev, { type: 'user', content: text }, { type: 'wait', content: "" }])
            let encodedParams = new URLSearchParams();
            encodedParams.append("q", text);
            encodedParams.append("target", "en");
            encodedParams.append("source", "vi");
            let translatedText = await helpers.translateToEn(encodedParams);
            if (translatedText) {
                // console.log(translatedText);
                params.text = translatedText;
                client.recognizeText(params, (err, data) => {
                    if (err) throw new Error("fail"); // an error occurred
                    else {
                        if (isSubscribe) {
                            for (let i = 0; i < data.messages.length; i++) {
                                data.messages[i].type = 'bot'
                            }
                            setMessages(prev => [...prev.slice(0, prev.length - 1), ...data.messages])
                        }
                    }
                })
            }
        } catch (error) {
            setMessages(prev => [...prev.slice(0, prev.length - 1), { type: "bot", content: "Có lỗi xảy ra, hãy liên hệ nhân viên hỗ trợ" }])
        }
    }
    useEffect(() => {
        isSubscribe = true
        inputText.current?.focus();
        scrollToBottom()
        return () => isSubscribe = false;
    }, [messages])

    return (
        <div>
            {/* {console.log(window.innerWidth)} */}
            {showBot ?
                < div className="chatbox-holder" >
                    <div className="chatbox">
                        <div className="chatbox-top">
                            <div className="chatbox-avatar">
                                <img src="https://github.githubassets.com/images/modules/site/copilot/copilot.png" alt='chat-bot-img' />
                            </div>
                            <div className="chat-partner-name">
                                <span className="status online" />
                                <span>Shimba bot</span>
                            </div>
                            <div className='close-chatbot-button' onClick={() => {
                                setShowBot(false);
                                form.resetFields();
                            }}>
                                <CloseOutlined />
                            </div>
                        </div>
                        <div className="chat-messages">
                            {showMessages(messages)}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="">
                            <Form
                                form={form}
                                onFinish={(value) => { sendMessage(value.content) }}
                                onFinishFailed={() => { }}
                                autoComplete="off"
                            >
                                <Form.Item name="content"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'vui lòng nhập nội dung',
                                        },
                                    ]}
                                >
                                    <Input addonAfter={<SendOutlined
                                        onClick={form.submit} autoFocus />}
                                        ref={inputText}
                                    />
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div > : (
                    <div className='open-bot-button'
                        onClick={() => { setShowBot(true) }}>
                        <img src="https://github.githubassets.com/images/modules/site/copilot/copilot.png" alt="" />
                    </div>
                )
            }
        </div>
    )
}
