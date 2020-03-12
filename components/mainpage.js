import React from "react"
import UserCard from "../components/usercard"
import FavorList from "../components/favorlist"
import {Row, Col, Tabs} from "antd";

class MainPage extends React.Component{
    constructor(){
        super();
        this.state={
            user:"",
            favorArr:[],
            historyArr:[]
        }
        this.loadRandomUser=this.loadRandomUser.bind(this)
        this.setFavorite=this.setFavorite.bind(this)
        this.navPrev=this.navPrev.bind(this)
        this.navNext=this.navNext.bind(this)
        this.cancelFavor=this.cancelFavorite.bind(this)
    }
    componentDidMount(){
        this.loadRandomUser()
    }
    
    loadRandomUser(){
        this.serverRequest=fetch(this.props.source)
        .then((response) => {
            return response.json()
        })
        .then((result) =>{
            const rst=result.results[0];
            const pos=this.state.historyArr.indexOf(rst);
            if(pos<0){
                const newArry=this.state.historyArr.concat(rst);
                this.setState({
                    user:rst,
                    historyArr:newArry
                })
            }
        })
    }
    navPrev(){
        const pos=this.state.historyArr.indexOf(this.state.user);
        if(pos>0){
            const user=this.state.historyArr[pos-1];
            this.setState({
                user:user
            })
        }
    }
    navNext(){
        const arrLen=this.state.historyArr.length-1;
        const pos=this.state.historyArr.indexOf(this.state.user);
        if(pos===arrLen){
            this.loadRandomUser()
        }else{
            const user=this.state.historyArr[pos+1];
            this.setState({
                user:user
            })
        }
    }
    setFavorite(){
        const currentUser=this.state.user;
        const pos=this.state.favorArr.indexOf(currentUser);
        if(pos<0){
            let newArray=this.state.favorArr.concat(this.state.user);
            this.setState({
                favorArr:newArray
            })
        }else{
            let newArray=this.state.favorArr.filter((item)=> item!==currentUser)
            this.setState({
                favorArr:newArray
            })
        }
    }
    cancelFavorite(targetObj){
        let newArray=this.state.favorArr.filter((item) => item!==targetObj)
        this.setState({
            favorArr:newArray
        })
    }
    render(){
        const inFavorList=this.state.favorArr.includes(this.state.user);
        const {TabPane} = Tabs;
        return(
            <Row>
                <Col span={12} offset={6}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Seek Friend" key="1">
                            <UserCard userObj={this.state.user} isLike={inFavorList} onFavor={this.setFavorite} onPrev={this.navPrev} onNext={this.navNext} />
                        </TabPane>
                        <TabPane tab="My Favor" key="2">
                            <FavorList list={this.state.favorArr} onCancelFav={this.cancelFavor}/>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        )
    }
}
export default MainPage