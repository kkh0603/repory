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

  //기능
  getTodos();
  addTodos();
  load();
  renderRows();

  //투두스트 가져오기
  function getTodos() {
    inTodo = document.getElementsByTagName("input")[0];
    inCategory = document.getElementsByTagName("input")[1];
    inputButton = document.getElementById("inputBtn");
    filterElem = document.getElementById("todoFilter");
    dateInput = document.getElementById("dateInput");
    timeInput = document.getElementById("timeInput");
  }

  //투두리스트 추가
  function addTodos() {
    inputButton.addEventListener("click", addTodo, false);
    filterElem.addEventListener("change", filterEntries, false);
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
    
    rendowRow(obj)
    todoList.push(obj);
    save();
    updateNewFilterCategorie();
    
  }

  //분류별 보이기
  function filterEntries() {

    let choice = filterElem.value;
    
    if (choice == DEFAULT_OPTIONS) {

      let rows = document.getElementsByTagName("tr");

      Array.from(rows).forEach((row, index) => {
        row.style.display = "";
      });
    }else {
      let rows = document.getElementsByTagName("tr");

      Array.from(rows).forEach((row, index) => {
        if (index == 0){
          return;
        }
        let category = row.getElementsByTagName("td")[2].innerText;
        if (category == filterElem.value) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    }
  }
  //분류 자동 업데이트
  function updateNewFilterCategorie() {
    let options = [];
    let rows = document.getElementsByTagName("tr");
    
    Array.from(rows).forEach((row, index) => {
      if (index == 0){
        return;
      }
      let category = row.getElementsByTagName("td")[2].innerText;

      options.push(category);
      // if (!options.includes(category)){
      // }
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
  function renderRows() {
    todoList.forEach(todoObj => {
      rendowRow(todoObj);
    })
  }

  function rendowRow({todo: inTodoVal, category: inCategoryVal, id, date, time,  done}) {
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
    tdDateList.innerText = date;
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
  }
}

