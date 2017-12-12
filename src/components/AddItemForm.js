import React from 'react';

class AddItemForm extends React.Component{
  render(){

    let categoriesJSX = this.props.categories.map( category => {
      return (
        <option key={ category._id } value={ category.name } > { category.name } </option>
      );
    });

    return(
      <form className="row" onSubmit={ this.props.submitHandler }>
        <div className="input-group mb-2 shadow">
          <span className="input-group-btn">
            <button className="btn btn-light" type="submit"><i className="fa fa-plus" aria-hidden="true"></i></button>
          </span>
          <input className="form-control" type="text" name="textValue" placeholder={ this.props.placeholder } />
          <span className="input-group-btn">
            <select className="btn btn-light" name="selectValue" value={ this.props.value } onChange={ this.props.changeHandler }>
              { categoriesJSX }
            </select>
          </span>
        </div>
      </form>
    )
  }
}  

export default AddItemForm;