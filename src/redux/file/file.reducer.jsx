const INITIAL_STATE ={
  currentFile:null
}


const fileReducer = (state = INITIAL_STATE,action)=>{
       
     switch(action.type){
      case "SET_CURRENT_USER_FILE": 
      return {
             
            ...state,currentFile:action.payload
      }
      default : 
      return state
     }
    return state
}

export default fileReducer;