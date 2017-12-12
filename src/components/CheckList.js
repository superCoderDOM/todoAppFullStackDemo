import React from 'react';
import moment from 'moment';

class CheckList extends React.Component{
    render(){
  
        // create JSX array of items
        let ListItemsJSX = this.props.list.map(item=>{
            
            let categoryColor = this.props.categories ? this.props.categories.find( category => category._id === item.category).color : '';
            let categoryName = this.props.categories ? this.props.categories.find( category => category._id === item.category).name : '';
            
            return (
                <li className={`list-group-item shadow ${ categoryColor }`} key={ item._id } >
                    <div className="col-12 list-item">
                        <div>
                            <input type="checkbox" checked={ item.done } onChange={ ()=>{ this.props.toggleHandler(item._id) } }/>
                            <label className={ `ml-2 ${item.done? 'done strike' : ''}` }> { item.text } </label>
                        </div>
                        <div className="done"><i className="fa fa-pencil-square-o" aria-hidden="true"></i></div>
                    </div>
                    <div className={`col-12 list-item list-item-details ${item.done? 'done' : ''}`}>
                        <div><strong>Created: </strong> { moment(item.created).format('MMMM Do YYYY') } </div>
                        <div><strong>Category: </strong> { categoryName } </div>
                    </div>
                </li>
            );
        });

        return(
            <ul className="row list-group">
                { ListItemsJSX }
            </ul>
        )
    }
}

export default CheckList;