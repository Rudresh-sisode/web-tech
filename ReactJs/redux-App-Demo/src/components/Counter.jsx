import classes from './Counter.module.css';
import { useSelector, useDispatch, connect } from 'react-redux';
import { Component } from 'react';

const Counter = () => {
  const counter = useSelector(state => state.counter);
  const dispatch = useDispatch();
  const toggleCounterHandler = () => {};

  const incrementHandler = ()=>{
    dispatch({type:"increment"})
  }

  const increseHandler = ()=>{
    dispatch({type:'increse',amount:5});
  }

  const decrementHandler = ()=>{
    dispatch({type:"decrement"})
  }

  return (
    <main className={classes.counter}>
      <h1>Redux Counter</h1>
      <div className={classes.value}>{counter}</div>
      <div>
        <button onClick={incrementHandler}>increment</button>
        <button onClick={increseHandler}>Increse</button>
        <button onClick={decrementHandler}>decrement</button>
      </div>
      <button onClick={toggleCounterHandler}>Toggle Counter</button>
    </main>
  );
};

export default Counter



// class Counter extends Component{

//   incrementHandler(){
//     console.log("increment happaned")
//     this.props.increment();
//   }
  
//   decrementHandler(){
//     console.log("decrement happaned")
//     this.props.decrement()
//   }

//   toggleCounterHandler(){

//   }

//   render(){
//     return (

//       <main className={classes.counter}>
//        <h1>Redux Counter</h1>
//        <div className={classes.value}>{this.props.counter}</div>
//        <div>
//          <button onClick={this.incrementHandler.bind(this)}>increment</button>
//          <button onClick={this.decrementHandler.bind(this)}>decrement</button>
//        </div>
//        <button onClick={this.toggleCounterHandler}>Toggle Counter</button>
//      </main>
//     )
//   }
  
// }

// const mapStateToProps = state =>{
//   return {
//     counter:state.counter
//   }
// }

// const mapDispatchToProps = dispatch =>{
//   return{
//     increment:()=> dispatch({type:'increment'}),
//     decrement:()=> dispatch({type:'decrement'})
//   }
// }


// export default connect(mapStateToProps,mapDispatchToProps)(Counter);