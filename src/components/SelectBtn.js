import React from 'react';

class SelectBtn extends React.Component{
    render(){
        
        // create JSX array of select options
        let optionsJSX = this.props.options.map( (option)=>{
            return (
                <option key={ option.id ? option.id : option._id } value={ option.value ? option.value : option.name }>{ option.value ? option.value : option.name }</option>
            )
        });

        return(
            <div>
                <label className="mr-2" htmlFor={ this.props.id } > { this.props.label }: </label>
                <select id={ this.props.id } className={ this.props.className } value={this.props.value} onChange={ this.props.changeHandler }>
                    {optionsJSX}
                </select>
            </div>
        )
    }
}

export default SelectBtn;