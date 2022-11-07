todosMain();

function todosMain () {

  //변수 선언
  let inTodo;
  let ulList;
  let inCategory;
  let inputButton;

  //기능
  getTodos();
  addTodos();

  //투두스트 가져오기
  function getTodos() {
    inTodo = document.getElementsByTagName("input")[0];
    inCategory = document.getElementsByTagName("input")[1];
    inputButton = document.getElementById("inputBtn");
    ulList = document.getElementsByTagName("ul")[0];
  }

  //투두리스트 추가
  function addTodos() {
    inputButton.addEventListener("click", onChange, false);
  }

  //페이지 변화
  function onChange(event) {
    let flag = true;

    let inTOdoVal = inTodo.value;
    inTodo.value = "";
    let inCategoryVal = inCategory.value;
    inCategory.value = "";

    let liList = document.createElement("li");
    let checkedBoxTodo = document.createElement("input");
    checkedBoxTodo.type = "checkbox";
    liList.appendChild(checkedBoxTodo); 

    let todoElem = document.createElement("span");
    todoElem.innerHTML = inTOdoVal + " - " + inCategoryVal;
    liList.appendChild(todoElem);

    //제거 아이콘 span태그를 부모테그에 달기
    let spanElem = document.createElement("span");
    spanElem.innerText = "close"
    spanElem.className = "material-symbols-sharp";

    //제거 아이콘 span 태그를 누를경우 동작
    spanElem.addEventListener("click", deleteTodo, false);

    function deleteTodo() {
      liList.remove();
    }

    liList.appendChild(spanElem);
    ulList.appendChild(liList);
    
    function onClick(){
      if(flag){
        this.classList.add("strike");
        flag = !flag;
      }else{
        this.classList.remove("strike");
        flag = !flag;
      }
    }
  }

}

