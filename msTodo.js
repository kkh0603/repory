todosMain();

function todosMain () {
  const DEFAULT_OPTIONS = "Choose category";
  //변수 선언
  let inTodo;
  let filterElem;
  let inCategory;
  let inputButton;
  let todoList = [];
  let dateInput;
  let timeInput;
  let sortBtn;
  let calendar;
  let checkedItem;

  //기능
  getTodos();
  addTodos();
  load();
  initCalendar();
  renderRows(todoList);
  updateNewFilterCategorie()

  //투두스트 가져오기
  function getTodos() {
    inTodo = document.getElementsByTagName("input")[0];
    inCategory = document.getElementsByTagName("input")[1];
    inputButton = document.getElementById("inputBtn");
    filterElem = document.getElementById("todoFilter");
    dateInput = document.getElementById("dateInput");
    timeInput = document.getElementById("timeInput");
    sortBtn = document.getElementById("sortBtn");
    checkedItem = document.getElementById("checkedItem");
  }

  //투두리스트 추가
  function addTodos() {
    inputButton.addEventListener("click", addTodo, false);
    filterElem.addEventListener("change", multipleFilters, false);
    sortBtn.addEventListener("click", sortDate, false);
    checkedItem.addEventListener("change", multipleFilters, false);
    
    document.getElementById("todo-Table").addEventListener("click",onTableClick, false);

  } 

  //페이지 변화
  function addTodo(event) {
    let inTodoVal = inTodo.value;
    inTodo.value = "";
    let inCategoryVal = inCategory.value;
    inCategory.value = "";
    let inDateVal = dateInput.value;
    dateInput.value = "";
    let inTimeVal = timeInput.value;
    timeInput.value = "";

    let obj = {
      id : todoList.length,
      todo : inTodoVal,
      category : inCategoryVal,
      date : inDateVal,
      time : inTimeVal,
      done : false,
    };
    renderRow(obj)
    todoList.push(obj);
    save();
    updateNewFilterCategorie();
    
  }

  //분류 자동 업데이트
  function updateNewFilterCategorie() {
    let options = [];
    todoList.forEach((obj) => {
      options.push(obj.category);
    });

    let optionSet = new Set(options);

    filterElem.innerHTML = "";
    let newFilterCategorie = document.createElement('option');
    newFilterCategorie.value = DEFAULT_OPTIONS;
    newFilterCategorie.innerText = DEFAULT_OPTIONS;
    filterElem.appendChild(newFilterCategorie);

    for (let option of optionSet){
      //카테고리 리스트 자동 업데이트
      let newFilterCategories = document.createElement('option');
      newFilterCategories.value = option;
      newFilterCategories.innerText = option;
      filterElem.appendChild(newFilterCategories);
    };
  }
  
  function save() {
    let stringified = JSON.stringify(todoList);
    localStorage.setItem("todoList", stringified);
  }

  function load() {
    let retrieved = localStorage.getItem("todoList");
    todoList = JSON.parse(retrieved);
    if (todoList == null) {
      todoList =[];
    }
  }

  function renderRows(arr) {
    arr.forEach(todoObj => {
      renderRow(todoObj);
    });
  }

  function renderRow({todo: inTodoVal, category: inCategoryVal, id, date, time,  done}) {
    let todoTable = document.getElementById("todo-Table");
    let trElem = document.createElement("tr");
    todoTable.appendChild(trElem);

    //checkedBox
    let checkedBoxTodo = document.createElement("input");
    checkedBoxTodo.type = "checkbox";
    checkedBoxTodo.addEventListener("click", completeTodo, false);
    checkedBoxTodo.dataset.id = id;
    let tdCheckBox = document.createElement("td");
    tdCheckBox.appendChild(checkedBoxTodo);
    trElem.appendChild(tdCheckBox);

    //날짜 리스트업
    let tdDateList = document.createElement("td");
    
    tdDateList.innerText = formatDate(date);
    trElem.appendChild(tdDateList);
    
    //시간 리스트업
    let tdTimeLiist = document.createElement("td");
    tdTimeLiist.innerText = time;
    trElem.appendChild(tdTimeLiist);

    //할일 리스트업
    let tdTodoList = document.createElement("td");
    tdTodoList.innerText = inTodoVal;
    trElem.appendChild(tdTodoList);

    //카테고리 리스트럽
    let tdCategory = document.createElement("td");
    tdCategory.innerText = inCategoryVal;
    tdCategory.className = "category";
    trElem.appendChild(tdCategory);
    
    // //제거 아이콘 span태그를 부모테그에 달기
    let spanElem = document.createElement("span");
    spanElem.innerText = "close"
    spanElem.className = "material-symbols-sharp";
    // //제거 아이콘 span 태그를 누를경우 동작
    spanElem.addEventListener("click", deleteTodo, false);
    spanElem.dataset.id = id;
    let tdDelete = document.createElement("td");
    tdDelete.appendChild(spanElem);
    trElem.appendChild(tdDelete);

    checkedBoxTodo.type = "checkbox";
    checkedBoxTodo.checked = done;
    if (done){
      trElem.classList.add("strike");
    } else {
      trElem.classList.remove("strike");
    }

    eventAddCalendar({
      id : id,
      title : inTodoVal,
      start : date,
    });

        //수정
        tdDateList.dataset.editable = true;
        tdTimeLiist.dataset.editable = true;
        tdTodoList.dataset.editable = true;
        tdCategory.dataset.editable = true;

        tdDateList.dataset.type = 'date';
        tdDateList.dataset.value = date;
        tdTimeLiist.dataset.type = 'time';
        tdTodoList.dataset.type = "todo"; 
        tdCategory.dataset.type = "category";
        
        tdDateList.dataset.id = id;
        tdTimeLiist.dataset.id = id;
        tdTodoList.dataset.id = id;
        tdCategory.dataset.id = id;   
        //tdTodoList.addEventListener("dblclick", allowEdit, false); 

    //삭제
    function deleteTodo() {
      trElem.remove();
      updateNewFilterCategorie();

      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id) {
          todoList.splice(i, 1);
        }
      }
      save();
      calendar.getEventById( this.dataset.id ).remove();
    }
    
    //완료 체크
    function completeTodo(){
      trElem.classList.toggle("strike");
      for (let i = 0; i < todoList.length; i++){
        if(todoList[i].id == this.dataset.id){
          todoList[i]["done"] = this.checked;
        }
      }
      save();
    }

    function toEditItem(event){
    }

  }

  //날짜 순으로 정리해주는 역활
  function sortDate() {
    todoList.sort((a,b) => {
      let aDate = Date.parse(a.date);
      let bDate = Date.parse(b.date);
      return aDate-bDate
    });

    save();
    
    cleantable();

    renderRows(todoList);
  }

  // 켈린더 초기와
  function initCalendar() {
    let calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      initialDate: '2022-11-07',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [],
    });
    calendar.render();
  }

  // 켈린더 일정 추가
  function eventAddCalendar(event){
    calendar.addEvent( event );
  }

  //확인완료 정리
  function cleantable(){
    let rows = document.getElementsByTagName("tr");
    for(let i = rows.length-1; i > 0; i--) {
      rows[i].remove();
    }

    calendar.getEvents().forEach(event => event.remove());
  }

  //체크박스 정렬 && 카테고리 정령
  function multipleFilters() {
    cleantable();

    let choice = filterElem.value;

    if (choice == DEFAULT_OPTIONS) {

      if (checkedItem.checked){
        let filterCompleteArr = todoList.filter(obj => obj.done == false);

        renderRows(filterCompleteArr);
      }else{
        renderRows(todoList);
      }
    }else {
      let filterCategoryArr = todoList.filter(obj => obj.category==choice);

      if (checkedItem.checked){
        let filterCompleteArr = filterCategoryArr.filter(obj => obj.done == false);
        renderRows(filterCompleteArr);
  
      }else{
        renderRows(filterCategoryArr);
      }
    }
  }

  //항목 수정
  function onTableClick(event){
    if (event.target.matches("td") && event.target.dataset.editable == "true"){
      let tempInputEl;
      switch(event.target.dataset.type){
        case "date":
          tempInputEl = document.createElement("input");
          tempInputEl.type = "date";
          tempInputEl.value = event.target.dataset.value;
          break;
        case "time":
          tempInputEl = document.createElement("input");
          tempInputEl.type = "time";
          tempInputEl.value = event.target.innerText;
          break;
        case "todo":
        case "category":
          tempInputEl = document.createElement("input");
          tempInputEl.value = event.target.innerText;
          break;
        default:
      }
      event.target.innerText = "";
      event.target.appendChild(tempInputEl);
      tempInputEl.addEventListener("change", onChange, false);
    }
    
    function onChange(event){
      let changedValue = event.target.value;
      let id = event.target.parentNode.dataset.id;
      let type = event.target.parentNode.dataset.type;

      calendar.getEventById(id).remove();

      todoList.forEach(todoObj => {
        if (todoObj.id == id){
          todoObj[type] = changedValue;

          eventAddCalendar({
            id : id,
            title : todoObj.todo,
            start : todoObj.date,
          }); 
        }
      });
      save();

      if(type == "date"){
        event.target.parentNode.innerText = formatDate(changedValue);
      }else{
        event.target.parentNode.innerText = changedValue;
      }
    }
  }

  //날짜 포멧
  function formatDate (date) {
    let dateObj = new Date(date);
    let transDate = dateObj.toLocaleString("en-KR",{
      month : "numeric",
      day : "numeric",
      //year : "numeric",
    });
    return transDate;
  }
}