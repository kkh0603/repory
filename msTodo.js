todosMain();

function todosMain () {
  const DEFAULT_OPTIONS = "Choose category";
  //변수 선언
  let inTodo;
  let filterElem;
  let inCategory;
  let inputButton;
  let todoList = [];

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
  }

  //투두리스트 추가
  function addTodos() {
    inputButton.addEventListener("click", addTodo, false);
    filterElem.addEventListener("change", filterEntries, false);
  } 

  //페이지 변화
  function addTodo(event) {
    let inTOdoVal = inTodo.value;
    inTodo.value = "";
    let inCategoryVal = inCategory.value;
    inCategory.value = "";

    
    rendowRow(inTOdoVal, inCategoryVal)
    todoList.push({
      todo : inTOdoVal,
      category : inCategoryVal
    });
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
    todoList.forEach(todo => {
      rendowRow(todo, null);
    })
  }

  function rendowRow(inTOdoVal, inCategoryVal) {
    let todoTable = document.getElementById("todo-Table");
    let trElem = document.createElement("tr");
    todoTable.appendChild(trElem);

    //checkedBox
    let checkedBoxTodo = document.createElement("input");
    checkedBoxTodo.type = "checkbox";
    checkedBoxTodo.addEventListener("click", completeTodo, false);
    let tdCheckBox = document.createElement("td");
    tdCheckBox.appendChild(checkedBoxTodo);
    trElem.appendChild(tdCheckBox);

    let tdTodoList = document.createElement("td");
    tdTodoList.innerText = inTOdoVal;
    trElem.appendChild(tdTodoList);

    let tdCategory = document.createElement("td");
    tdCategory.innerText = inCategoryVal;
    trElem.appendChild(tdCategory);
    
    // //제거 아이콘 span태그를 부모테그에 달기
    let spanElem = document.createElement("span");
    spanElem.innerText = "close"
    spanElem.className = "material-symbols-sharp";
    // //제거 아이콘 span 태그를 누를경우 동작
    spanElem.addEventListener("click", deleteTodo, false);
    let tdDelete = document.createElement("td");
    tdDelete.appendChild(spanElem);
    trElem.appendChild(tdDelete);
    //삭제
    function deleteTodo() {
      trElem.remove();
      updateNewFilterCategorie();
    }
    
    //완료 체크
    function completeTodo(){
      trElem.classList.toggle("strike");
    }
  }
}

