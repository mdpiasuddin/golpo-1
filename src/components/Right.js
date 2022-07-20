import React from 'react'
import { ListGroup } from 'react-bootstrap'
import moment from 'moment'
export const Right = (props) => {
    return (
        <div className='right'>
            <h3>Account info</h3>
            <ListGroup>
                <ListGroup.Item>{moment(props.createtime).fromNow()}</ListGroup.Item>

            </ListGroup>
        </div>
    )
}
