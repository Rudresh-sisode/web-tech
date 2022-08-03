import classes from './Counter.module.css';
import { counterActions } from '../store/store';
import { useSelector, useDispatch, connect } from 'react-redux';
import { Component } from 'react';

const Counter = () => {
  const counter = useSelector(state => state.counter.counter);
  const show = useSelector(state => state.counter.showCounter)
  const dispatch = useDispatch();
  const toggleCounterHandler = () => {
    // dispatch({type:'toggle'})
    dispatch(counterActions.toggleCounter());
  };


  const incrementHandler = ()=>{
    // dispatch({type:"increment"})
    dispatch(counterActions.increment())
  }

  const increseHandler = ()=>{
    // dispatch({type:'increse',amount:5});
    dispatch(counterActions.increase(5))
  }

  const decrementHandler = ()=>{
    // dispatch({type:"decrement"})
    dispatch(counterActions.decrement());
  }

  return (
    <main className={classes.counter }>
      <h1>Redux Counter</h1>
      {show && <div className={classes.value}>{counter}</div>}
      {!show && <div className={classes.value}>!</div>}
      <div>
        <button onClick={incrementHandler}>increment</button>
        <button onClick={increseHandler}>Increse (by 5)</button>
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