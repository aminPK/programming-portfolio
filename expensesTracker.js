let expenses= [];

let nextId= Date.now();

let edtId= null;

let description= document.getElementById("description");
let amount= document.getElementById("amount");
let categorie= document.getElementById("categorie");
let filterCategories= document.getElementById("filterCategories");
let addBtn= document.getElementById("addBtn");
let cancelBtn= document.getElementById("cancelBtn");
let total= document.getElementById("total");
let totalFood= document.getElementById("totalFood");
let totalTransport= document.getElementById("totalTransport");
let totalEntertaiment= document.getElementById("totalEntertaiment");
let totalCommunication= document.getElementById("totalCommunication");
let expensesList= document.getElementById("expenseList");

addBtn.addEventListener("click", function(){
    
    let newDescription = description.value;
    let newAmount = parseFloat(amount.value);
    let newCategorie = categorie.value;

    if(!newDescription.trim() || !Number.isFinite(newAmount) || newAmount < 0){
        alert("Bitt gib eine Beschreibung und einen gültigen Betrag ein")
        return;
        
    };

    if(edtId !== null){
        let edtExpense = expenses.find(ex=> ex.id === edtId)
        edtExpense.description = newDescription
        edtExpense.amount = newAmount
        edtExpense.categorie = newCategorie
    }else{
        expenses.push({
            id : nextId,
            description: newDescription,
            amount: newAmount,
            categorie: newCategorie
        })
    }

    edtId = null;

    saveExpenses()
    renderExpenses()

    description.value = "";
    amount.value = "";
    
    console.log(expenses)
})

function renderExpenses(){
    expensesList.innerHTML = "";

    let selectedCategory= filterCategories.value;

    let filterdExpenses= selectedCategory === "all" ? expenses : expenses.filter(ex=> ex.categorie === selectedCategory)
    
    filterdExpenses.forEach(expense => {
        
        let li= document.createElement("li");
        li.textContent= expense.description + " | ";

        let span= document.createElement("span");
        span.textContent= expense.categorie + " | ";
        li.appendChild(span);

        let spanAmount= document.createElement("span");
        spanAmount.textContent= `${expense.amount.toFixed(2)} €`;
        li.appendChild(spanAmount);
        
        expensesList.appendChild(li);

        let dltBtn= document.createElement("button");
        dltBtn.textContent= "Delete";

        dltBtn.addEventListener("click", function(event){
            event.stopPropagation();

            expenses= expenses.filter(ex=> ex.id !== expense.id);
            saveExpenses();
            renderExpenses()
        })

        li.appendChild(dltBtn);

        let edtBtn= document.createElement("button");
        edtBtn.textContent= "Edit";
        li.appendChild(edtBtn)


        edtBtn.addEventListener("click", function(event){
            event.stopPropagation();
            
            let expenseToEdit= expenses.find(ex=> ex.id === expense.id)

            if(expenseToEdit){
                edtId = expenseToEdit.id
                description.value = expenseToEdit.description;
                amount.value = expenseToEdit.amount;
                categorie.value = expenseToEdit.categorie;
            };
        });

        cancelBtn.addEventListener("click", function(event){
            event.stopPropagation();
            
            edtId = null;
            
            description.value = "";
            amount.value = "";
            categorie.selectedIndex = 0;


        });
        
    });
   
    
    renderTotal()
   
}

filterCategories.addEventListener("change", function(){
    renderExpenses();
})



function getTotalByCategorie(categorie){
    
        return expenses.filter(ex=> ex.categorie === categorie).reduce((acc,ex)=> acc + ex.amount, 0);
}

function renderTotal(){

    let sumExp= expenses.reduce((acc, exp)=> acc + exp.amount, 0);
    total.textContent= `Total: ${sumExp.toFixed(2)} €`;

    let categories= [
        {name: "food", element: totalFood},
        {name: "entertaiment", element: totalEntertaiment},
        {name: "transport", element: totalTransport},
        {name: "communication", element: totalCommunication},
    ];

    categories.forEach(cat=> {
        let sum= getTotalByCategorie(cat.name)

        cat.element.textContent= `Total: ${cat.name}: ${sum.toFixed(2)} €`
        
    }
    )
}

function saveExpenses(){
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadExpenses(){
    expenses= JSON.parse(localStorage.getItem("expenses")) || [];
}

loadExpenses()
renderExpenses()








