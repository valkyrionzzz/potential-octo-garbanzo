
//Task class
class Task{
  constructor(task){
    this.name = task;
    this.id = new Date().getTime();
    this.status = 0;
    this.urgent = 0;
    return this;
  }
}


//form module
var formmodule = (
  function () {
    var formobj = {};
    const formelm = document.getElementById('task-form');
    const inputelm = document.getElementById('task-input');

    formobj.getValue = function() {
      inputval = inputelm.value;
      formobj.val = inputval;
      return inputval;
    }
    return formobj;
  }()
);

//task functions
var task = ( function(){
  var object = {};
  object.taskArray = [];
  
  //add task
  object.add = function(taskname){
    let taskitem = new Task(taskname);
    object.taskArray.push(taskitem);
  }
  
  //change task status
  object.changeStatus = function(id){
    let taskcount = object.taskArray.length;
    for(let i=0; i<taskcount; i++){
      let item = object.taskArray[i];
      if( item.id == id ){
          if( item.status == 1){
            item.status = 0;
            //add strike class here <<??>>
          }
          else 
            item.status = 1;
        break;
        return true;
      }
    }
  }
  
  //make task urgent
  object.changeUrgent = function(id){
    let taskcount = object.taskArray.length;
    for(let i=0; i<taskcount; i++){
      let item = object.taskArray[i];
      if( item.id == id ){
          if( item.urgent == 1){
            item.urgent = 0;
          }
          else 
            item.urgent = 1;
        break;
        return true;
      }
    }
  }
  
  //delete task
  object.delete = function(id){
    let taskcount = object.taskArray.length;
    for(let i=0; i<taskcount; i++){
      let item = object.taskArray[i];
      if( item.id == id ){
        object.taskArray.splice(i,1);
        break;
        return true;
      }
    }
  }
  return object;
}
());

//handling storage
var storage = ( function(){
  var stg = {};
  stg.store = function(arr){
    let data = JSON.stringify(arr);
    stg.data = data;
    window.localStorage.setItem("data",data);
  }
  stg.read = function(){
    if(window.localStorage.getItem("data")){
      try{
        if(JSON.parse(localStorage.getItem("data"))){
          let data = JSON.parse(localStorage.getItem("data"));
        }
      }
      catch(error){
        console.log("error"+error);
      }
      let data = window.localStorage.getItem("data");
      return JSON.parse(data);
    }
    else{
      return false;
    }
  }
  return stg;
}());

//HTML template
var template = ( function(){
  var templateobject = {};
  
  window.addEventListener('load',() => { 
    const tmpl = document.querySelector('#task-template');
    templateobject.template = tmpl;
  });
  
  templateobject.create = function(taskobj){
    
    let template = document.importNode(templateobject.template.content,true);
    let temphtml = template.querySelector('li');
    
    temphtml.setAttribute('data-id',taskobj.id);
    temphtml.setAttribute('data-status',taskobj.status);
    temphtml.setAttribute('data-urgent',taskobj.urgent);
    temphtml.setAttribute('data-name',taskobj.name);
    
    temphtml.querySelector('.task-text').innerText = taskobj.name;
    temphtml.querySelector('button[data-function="urgent"]').setAttribute('data-id',taskobj.id);
    temphtml.querySelector('button[data-function="delete"]').setAttribute('data-id',taskobj.id);
    temphtml.querySelector('button[data-function="status"]').setAttribute('data-id',taskobj.id);
    
    return temphtml;
  }
  
  return templateobject;
} ());

//ui module
var uimodule = ( function(){
  var module = {};
  const listelem = document.getElementById('task-list');
  module.render = function(){
    let tasks = task.taskArray;
    listelem.innerHTML = "";
    for(let i=0; i<tasks.length; i++){
      let item = tasks[i];
      //create a template
      let listitem = template.create(item);
      
      listelem.appendChild(listitem);
    }
  }
  module.bindListener = function() {
    listelem.addEventListener('click', (event) => {
      //when status clicked
      if(event.target.getAttribute('data-function') == 'status'){
          //         var d = document.getElementById('templateTask');
          // d.className = 'strike';
        itemid = event.target.getAttribute('data-id'); 
        task.changeStatus(itemid);
        
        
      //   let taskcount = task.taskArray.length;
      //   for(let i=0; i<taskcount; i++){
      //     let item = task.taskArray[i];
      //       if( item.status == 1){
              
              
              
      //         alert(item.name);
              
      //         var x = document.getElementsByClassName("a");
      
      // for (var p = (x.length - 1); p >= 0; p--) {
      //   x[p].className = "strike";
      // }
      //     }
      //   }
        

        
      }
      
      //when urgent clicked
      if(event.target.getAttribute('data-function') == 'urgent'){
        itemid = event.target.getAttribute('data-id'); 
        task.changeUrgent(itemid);
      }
      
      //when delete clicked
      if(event.target.getAttribute('data-function') == 'delete'){
        itemid = event.target.getAttribute('data-id');
        task.delete(itemid);
      }
      
      //render and store
      module.render();
      storage.store(task.taskArray);
    });
  }  
  return module;
} () );

var app = (function(){
  const form = document.getElementById('task-form');
  form.addEventListener('submit',(event) => {
    event.preventDefault();
    let newtask = formmodule.getValue();
    if(newtask){
      task.add(newtask);
      storage.store(task.taskArray);
      uimodule.render();
    }
    form.reset();
  });
  uimodule.bindListener();
  window.addEventListener('load',() => {
    if(storage.read()){
      task.taskArray = storage.read() ;
    }
    uimodule.render();
  });
}());
