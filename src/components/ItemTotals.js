import React from 'react';

class ItemTotals extends React.Component{
    render(){
        return(
            <div className={ "row totals-bar" }>
                <div className={ this.props.className }>Total: { this.props.itemCounts.totalItems }</div>
                <div className={ this.props.className }>Complete: { this.props.itemCounts.completeItems }</div>
                <div className={ this.props.className }>Active: { this.props.itemCounts.activeItems }</div>
            </div>
        );
    }
}

export default ItemTotals;