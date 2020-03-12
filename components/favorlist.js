import React from "react"
import { List, Avatar } from 'antd'
import {HeartTwoTone} from "@ant-design/icons"

class FavorList extends React.Component{
    
    render(){
        return(
            <List
                itemLayout="horizontal"
                dataSource={this.props.list}
                renderItem={item => (
                <List.Item actions={[<a onClick={()=>this.props.onCancelFav(item)}><HeartTwoTone twoToneColor="#eb2f96" />Don't like anymore</a>]}>
                    <List.Item.Meta
                    avatar={<Avatar src={item.picture.medium} />}
                    title={item.name.title +"."+item.name.last+" "+item.name.first} 
                    description={item.location.street.number+ " "+ item.location.street.name + ", "+item.location.city+" "+item.location.state +" "+item.location.postcode}
                    />
                </List.Item>
                )}
            />
        )
    }
}
export default FavorList