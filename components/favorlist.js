import React from "react"
import { List, Avatar } from 'antd'

class FavorList extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <List
                itemLayout="horizontal"
                dataSource={this.props.list}
                renderItem={item => (
                <List.Item>
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