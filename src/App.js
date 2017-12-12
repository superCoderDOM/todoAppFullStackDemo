import React from 'react';
import axios from 'axios';

// import app components
import Title from './components/Title';
import Totals from './components/ItemTotals';
import AddTodoForm from './components/AddItemForm';
import TodoList from './components/CheckList';
import SelectTodos from './components/SelectBtn';
import ClearButton from './components/DefaultBtn';

// define base url
const baseTodoURL = '/todos';
const baseCategoryURL = '/categories';

class App extends React.Component{

  /*=================================================
    Define top-most state content using constructor
  =================================================*/

	constructor(){
    super();

    // top-most state content
		this.state = {
      categories: [],
      displayCategory: 'All', // current display category selected
      displayStatus: 'All', // current display option selected
      displayOptions: [ // list of possible display options
        {id: 1, value: 'All'}, 
        {id: 2, value: 'Active'}, 
        {id: 3, value: 'Complete'},
      ],
      newTodoCategory: 'Default',
			todos:[],
    }

    // bindings
    this.addTodo = this.addTodo.bind(this);
    this.clearCompleteTodos = this.clearCompleteTodos.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);
    this.editTodoItem = this.editTodoItem.bind(this);
    this.filterTodosByCategory = this.filterTodosByCategory.bind(this);
    this.filterTodosByStatus = this.filterTodosByStatus.bind(this);
    this.selectCategory = this.selectCategory.bind(this);
    this.toggleDoneState = this.toggleDoneState.bind(this);
    this.updateTodoItem = this.updateTodoItem.bind(this);
  }

  /*========================
    CREATE a new todo item
  =========================*/

  addTodo(event){
    // prevent page reload
    event.preventDefault();

    // make a copy of todos array
    let  copy = Array.from(this.state.todos);
    if (event.target.textValue.value){
      // create new todo object
      let newTodoItem = {
        text: event.target.textValue.value,
        category: this.state.categories.find( item => item.name === event.target.selectValue.value)._id,
      };
      
      // Make a POST request to '/todo' endpoint to update database
      axios.post(baseTodoURL, newTodoItem)
      
      .then(response=>{
        // after sucessful database update, add new object to local copy
        copy.push(response.data);

        // update state and reset display to view all values
        this.setState({
          displayCategory: 'All',
          displayStatus: 'All',
          newTodoCategory: 'Default',
          todos: copy,
        });

      })
      .catch(error=>{
        console.log(error);
      });
    }    

    // reset form fields
    event.target.textValue.value = '';
  }

  /*======================================
    DELETE ALL completed todos from list
  ======================================*/

  clearCompleteTodos(){

    // Get ids of all completed todos and turn into an array
    let completeTodos = this.state.todos.filter(elem => elem.done === true);
    let completeTodoIds = completeTodos.reduce((idArray, item)=>{return idArray.concat([item._id])}, []);

    // Make a DELETE request to '/todo' endpoint to update database
    // -> supply a stringified array of completed todos to pass as URL parameter
    // -> axios does not allow passing of body with axios.delete() request 
    axios.delete(`${ baseTodoURL }/${ completeTodoIds.join(",") }`)
    .then(response=>{
      // console.log(response.data);
      // Update state and reset display to view all values
      // -> supply array of incomplete todos
      this.setState({
        todos: this.state.todos.filter(elem => elem.done === false),
        displayStatus: 'All',      
      });      
    })
    .catch(error=>{
      console.log(error);
    });
  }

  /*===================================================
    RETRIEVE data from database when component mounts
  ===================================================*/

  componentWillMount(){
    let categories, todos;
    // Make a GET request to '/categories' endpoint to retrieve ALL categories
    axios.get(baseCategoryURL)    
    .then(categoryResponse=>{
      categories = categoryResponse.data;
      // Make a GET request to '/todos' endpoint to retrieve ALL todos
      return axios.get(baseTodoURL)
    })
    .then(todoResponse=>{
      todos = todoResponse.data;
      this.setState({
        categories: categories,
        todos: todos,
      })
    })
    .catch(error=>{
        console.log(error);
    });
  }
  
  /*=====================
    Edit todo item text
  =====================*/

  editTodoItem( todoID, text ){
    let copy = this.state.todos.map( item => {
      if ( item._id === todoID ){
        item.text = text;
      }
      return item;
    });

    let updateObject = {
      text: copy.find( item => item._id === todoID ).text
    }

    // call update todo function
    this.updateTodoItem( todoID, updateObject, copy );
  }

  /*========================================
    Filter todo list according to category
  ========================================*/

  filterTodosByCategory( event ){    
    this.setState({
      displayCategory: event.target.value,
    });
  }

  /*======================================
    Filter todo list according to status
  ======================================*/

  filterTodosByStatus( event ){    
    this.setState({
      displayStatus: event.target.value,
    });
  }  

  /*==================================
    Select category of new todo item
  ==================================*/

  selectCategory( event ){
    this.setState({
      newTodoCategory: event.target.value,
    });
  }

  /*=============================================================
    Toggle state of task between done (true) and undone (false)
  =============================================================*/

  toggleDoneState( todoID ){
    let copy = this.state.todos.map( item => {
      if ( item._id === todoID ){
        item.done = !item.done;
      }
      return item;
    });

    let updateObject = {
      done: copy.find( item => item._id === todoID ).done
    }

    // call update todo function
    this.updateTodoItem( todoID, updateObject, copy );
  }

  /*====================================================
    UPDATE specified todo object with provided content 
  ====================================================*/

  updateTodoItem(todoID, updateObject, updatedTodos){

    // Make a PUT request to '/todo' endpoint to update database
    axios.put(`${ baseTodoURL }/${ todoID }`, { update: updateObject })
    .then( response => {
      // console.log(response.data);

      // update state
      this.setState({
        todos: updatedTodos,
      });
    })
    .catch( error => {
      console.log( error );
    });
  }

  /*============================
    (Re-)Render all components
  ============================*/

	render(){
    // assess total number of todo items in each category
    let todoCounts = {
      activeItems: this.state.todos.filter(elem=>elem.done === false).reduce(sum=>{
        return sum += 1;
      }, 0),
      completeItems: this.state.todos.filter(elem=>elem.done === true).reduce(sum=>{
        return sum += 1;
      }, 0),
      totalItems: this.state.todos.reduce(sum=>{
        return sum += 1;
      }, 0),
    };

    // filter todo items based on status
    let  displayTodos = Array.from(this.state.todos);
    if (this.state.displayStatus === 'Active'){
      displayTodos = displayTodos.filter(elem => elem.done === false);
    }else if (this.state.displayStatus === 'Complete'){
      displayTodos = displayTodos.filter(elem => elem.done === true);
    }

    // filter todo items based on category
    if (this.state.displayCategory !== 'All'){
      let displayCategoryId = this.state.categories.find( category => category.name === this.state.displayCategory )._id;
      displayTodos = displayTodos.filter( todo => todo.category === displayCategoryId );
    }
    
    // disable clear complete button if no completed items are currently being displayed
    // -> prevents accidental delete of hidden items
    let btnDisabled = false;
    if (displayTodos.filter(elem => elem.done === true).length === 0){
      btnDisabled = true;
    } 

		return(
			<div className="container">
        <div className="row board">
          <div className="col-12 offset-sm-1 col-sm-10 offset-md-2 col-md-8">
            <Title className={ "title-block" } text={ "Friendly Reminders" } itemCounts={ todoCounts }/>
            <Totals className={ "col-4 text-center" } itemCounts={ todoCounts }/>
            <AddTodoForm placeholder={ "Add a todo" } categories={ this.state.categories } value={ this.state.newTodoCategory } changeHandler={ this.selectCategory } submitHandler={ this.addTodo }/>
            <div className="">
              <TodoList list={ displayTodos } categories={ this.state.categories } toggleHandler={ this.toggleDoneState }/>
            </div>
            <div className="row btn-toolbar justify-content-between mt-3" role="toolbar" aria-label="Toolbar with button groups">
              <div className="btn-group">
                <SelectTodos id={ "selectStatus" } className={ "btn btn-light shadow mr-2" } options={ this.state.displayOptions } label={ "Status" } value={ this.state.displayStatus } changeHandler={ this.filterTodosByStatus }/>
                <SelectTodos id={ "selectCategory" } className={ "btn btn-light shadow mr-2" } options={ this.state.categories.concat([{_id: '0Aa', name: 'All'}]) } label={ "Category" } value={ this.state.displayCategory } changeHandler={ this.filterTodosByCategory }/>
              </div>
              <ClearButton className={ "btn btn-light shadow" } value={ "Clear Complete" } btnDisabled={ btnDisabled } clickHandler={ this.clearCompleteTodos }/>
            </div>
            <div className="row"> </div>
          </div>
        </div>
			</div>
		);
	}
}

export default App;
