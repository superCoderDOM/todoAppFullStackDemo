import React from 'react';

class Title extends React.Component{
    render(){
        return(
            <div className={ this.props.className }>
                <h1>{ this.props.text }</h1>
            </div>            
        )
    }
}  

export default Title;