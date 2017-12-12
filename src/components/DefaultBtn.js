import React from 'react';

class DefaultBtn extends React.Component{
    render(){
        return(
            // disable button if no todo items are marked done
            <button className={ this.props.className } disabled={ this.props.btnDisabled } onClick={ this.props.clickHandler }><strong>{ this.props.value }</strong></button>      
        )
    }
}  

export default DefaultBtn;