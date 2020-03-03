import React from "react";
import {Card, Avatar} from "antd";
import HeartTwoTone from "@ant-design/icons"

class UserCard extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const rst=this.props.userObj;
        const likeSign=this.props.isLike;
        let n='',l='',p='';
        let colorNum= likeSign?"#eb2f96":"#999999"
        if(rst){
            n=rst.name.title + ". " + rst.name.last + " " + rst.name.first;
            l=rst.location.street.number +" "+rst.location.street.name + ", " + rst.location.city + " " + rst.location.state +" "+rst.location.postcode;
            p=rst.picture.medium
        }
        return(
            <div style={{padding:10,margin: 30,width:400, height:350}}>
            <Card title="Random User">
                <Avatar size={64} shape="square" src={p} />
                <p><em>Name: </em>{n}</p>
                <p><em>Location: </em>{l}</p>
            </Card>
        <button onClick={this.props.onPrev}>Preview</button><button onClick={this.props.onFavor}><HeartTwoTone twoToneColor={colorNum} /> {likeSign?"Cancel":"Like"}</button><button onClick={this.props.onNext}>Next</button>
            </div>
        )
    }
}
export default UserCard