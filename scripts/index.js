import {
  db,
  doc,
  getDocs,
  addDoc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
} from "./firebases.js";

let todoList = [];

const getTodoList = async () => {
  const todoRef = collection(db, "todoList");
  const sortTodo = query(todoRef, orderBy("created_at", "asc"));
  let getData = await getDocs(sortTodo);
  getData.forEach((item) => {
    return todoList.push({ todoId: item.id, ...item.data() });
  });
};

await getTodoList();

const addTodo = async (value) => {
  const data = {
    id: todoList.length + 1,
    text: value,
    check: false,
    created_at: new Date(),
  };

  if (!value) {
    return alert("할 일을 입력해주세요.");
  }

  await addDoc(collection(db, "todoList"), data).then(() =>
    window.location.reload()
  );
};

const deleteTodo = async (todoId) => {
  await deleteDoc(doc(db, "todoList", todoId)).then(() =>
    window.location.reload()
  );
};

const checkTodo = async (todoId) => {
  const getData = await getDoc(doc(db, "todoList", todoId));
  const data = getData.data();

  if (data) {
    await setDoc(doc(db, "todoList", todoId), {
      ...data,
      check: !data.check,
    }).then(() => window.location.reload());
  }
};

const todoInputEl = document.querySelector("#todoInput");
const todoInputBtn = document.getElementById("todoInputBtn");

todoInputBtn.addEventListener("click", () => addTodo(todoInputEl.value));

const todoListBoxEl = document.getElementById("todoListBox");

const todoDiv = document.createElement("div");
todoDiv.className = "todoList";

todoList.map((item, idx) => {
  const todoItemDiv = document.createElement("div");
  todoItemDiv.style.color = item.check ? "red" : "black";
  todoItemDiv.className = "flexBox";

  const itemInfoDiv = document.createElement("div");
  itemInfoDiv.style.display = "flex";
  itemInfoDiv.style.gap = "16px";
  itemInfoDiv.innerHTML = `<span>${idx + 1}.</span><span>${item.text}</span>`;

  const itemButtonDiv = document.createElement("div");

  const checkBtn = document.createElement("button");
  checkBtn.className = "todoBtn";
  checkBtn.textContent = "V";
  checkBtn.onclick = function () {
    checkTodo(item.todoId);
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.classList = "todoBtn";
  deleteBtn.textContent = "X";
  deleteBtn.onclick = function () {
    deleteTodo(item.todoId);
  };

  itemButtonDiv.appendChild(checkBtn);
  itemButtonDiv.appendChild(deleteBtn);
  todoItemDiv.appendChild(itemInfoDiv);
  todoItemDiv.appendChild(itemButtonDiv);

  todoDiv.appendChild(todoItemDiv);
});

todoListBoxEl.appendChild(todoDiv);
