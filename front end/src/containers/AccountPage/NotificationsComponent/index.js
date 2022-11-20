import { Col, Divider, message, Pagination, Result, Row } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import GlobalLoading from '../../../components/Loading/Global'
import notificationApi from '../../../apis/notificationApi'
import { NotificationOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
const renderNotify = (notificationList) => {
    return notificationList.map(item => (
        <Fragment key={item.id}>
            <Row >
                <Col flex="50px">
                    <img src="https://res.cloudinary.com/dsa-company/image/upload/v1658586861/logo_car_ops93b.png" alt="logo" width={'100%'} />
                </Col>
                <Col flex="auto" className='d-flex m-lr-10 align-i-center'>
                    <Link to="/"><h3> {item.text}</h3></Link>
                </Col>
            </Row>
            <Divider />
        </Fragment>
    ))
}
let isSubscribe = true;
export default function Notifications() {
    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1)
    const getAllNotify = async (page = 1) => {
        try {
            setIsLoading(true)
            let result = await notificationApi.getAllNotify(page)
            if (isSubscribe) {
                setNotifications(result.data)
                setTimeout(() => {
                    if (isSubscribe) setIsLoading(false)
                }, 200)
            }
        } catch (error) {
            message.error("Đã xảy ra lỗi")
        }
    }
    useEffect(() => {

        getAllNotify();
        return () => {
            isSubscribe = false
        }
    }, [])

    return (
        <div>
            {isLoading ? GlobalLoading({ content: "Đang tải" })
                : (
                    <>
                        {notifications.rows?.length ?
                            <>{renderNotify(notifications.rows)}
                                <Pagination
                                    current={page}
                                    total={notifications.count}
                                    onChange={(page) => {
                                        getAllNotify(page)
                                        setPage(page)
                                    }}
                                    className="t-center"
                                    defaultPageSize={8}
                                />
                            </> :
                            <Result
                                icon={<NotificationOutlined />}
                                title="Bạn không có thông báo nào !"
                            />
                        }
                    </>
                )
            }
        </div>
    )
}
