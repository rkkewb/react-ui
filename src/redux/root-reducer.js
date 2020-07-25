import {combineReducers} from 'redux' ;
import userRecuder from './user/user.reducer' ;
import fileReducer from './file/file.reducer'; 
import folderFlagReducer  from './shared-folder/folder.reducer'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import {  persistReducer } from 'redux-persist'

 
const persistConfig = {
  key: 'root',
  storage,
  whiteList:['user'],
  blackList:['currentFile']
}
 


const  rootReducer  = combineReducers({
  user :userRecuder ,
  currentFile:fileReducer,
  sharedWithMe:folderFlagReducer
})

export default persistReducer(persistConfig ,rootReducer)