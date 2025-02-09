 // making the add btn work
 let add_btn = document.querySelector('.add-btn');
 let modal = document.querySelector('.modal');

 add_btn.addEventListener('click', ()=>{
      modal.style.display = "flex";
    //   modal.classList.add('cursor-disable');
 }) 

 //making the close button in form work
 let close_btn = document.querySelector('.close-btn');
 close_btn.onclick = (()=>{
     modal.style.display = 'none';
 })

 let form = document.querySelector('.expenseForm');
 form.addEventListener('submit' , (e)=>{
    e.preventDefault();

     let formField = document.querySelectorAll('.expenseForm > div > input');
     let amount = formField[0].value;
     let date = formField[1].value;
     let note = formField[2].value;
     
     let category = document.querySelector('#category').value;
    
     createExpenseCard(amount , category , date , note);
     modal.style.display = 'none';

    //  e.target.reset();
 }) 
     

function createExpenseCard(amount , category , date , note){
    // console.log(amount , category , date , note);
    const id = shortid();
    let expense_div = document.createElement('div');
    expense_div.classList.add('expense-card');
    expense_div.setAttribute('data-id', id);
    expense_div.setAttribute('data-category', category);
    expense_div.innerHTML = `<div class="top-row">
                                <div class="category editable" contenteditable = "false">${category}</div>
                                <div class="date" >${date}</div>
                            </div>
                            <div class="expense-card-bottom">
                                <div class="middle-row">
                                    <div class="amount editable" contenteditable = "false">${amount}</div>
                                    <div class="notes editable" contenteditable = "false">${note}</div>
                                </div>
                                
                                <div class="card-actions">
                                    <button class="action-btn edit-btn">Edit</button>
                                    <button class="action-btn delete-btn">Delete</button>
                                </div>
                            </div>
                            
                            `;

    // adding the expense card to the expense container 
    let expense_container = document.querySelector('.expense-container');
    expense_container.appendChild(expense_div);


    // expense delete
    expenseDelete(expense_div);


    //expense edit
    editable(expense_div);


    // total amount
    totalAmountSum(expense_div);
    
}


// making the delete btn work
function expenseDelete(expenseCard){
    let deleteBtn = expenseCard.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', function(){
        expenseCard.remove();
    })
}


// making the edit button work
function editable(expenseCard){
    let edit_btn_flag = true;

    let editBtn = expenseCard.querySelector('.edit-btn');
    let allEditables = expenseCard.querySelectorAll('.editable');


    editBtn.addEventListener('click',()=>{
        if(edit_btn_flag){
            allEditables.forEach((editable) => {
                editable.setAttribute('contenteditable' , true);  
            })
            editBtn.innerText = "Save";
        }
        else{
            allEditables.forEach((editable) => {
                editable.setAttribute('contenteditable' , false);  
            })
            editBtn.innerText = "Edit";
        }
        edit_btn_flag = !edit_btn_flag;
    })
    
}




// taking care of the total sum
function totalAmountSum(expenseCard){
    let previousExpense = document.querySelector('.total-amount').innerText;

    previousExpense = Number(previousExpense);

    let cardAmount = expenseCard.querySelector('.amount').innerText;
    cardAmount = Number(cardAmount);

    
    //updating total amount
    document.querySelector('.total-amount').innerText = cardAmount + previousExpense;

}



 function expenseCardIndex(id){
    let expenseCards = document.querySelectorAll('.expense-card');
    let index;

    for(let i = 0 ;i<expenseCards.length;i++){
        if(id===expenseCards[i].getAttribute('data-id')){
            index = i;
            break;
        }
    }
    
    return index;
 }








 // bar chart js
 let expenses = [
    { category: "Shopping", amount: 21000 },
    { category: "Entertainment", amount: 1000 },
    { category: "Education", amount: 1500 },
    { category: "Vehicle", amount: 1000 },
    { category: "Household", amount: 8000 },
    { category: "Insurance", amount: 3000 }
];

// Category colors
const categoryColors = {
    shopping: "#8b5cf6",
    entertainment: "#ec4899",
    education: "#10b981",
    vehicle: "#f59e0b",
    household: "#3b82f6",
    insurance: "#ef4444"
};

// Function to update the bar graph dynamically
function updateBarChart() {
    let total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    let barChart = document.getElementById("barChart");
    barChart.innerHTML = ""; // Clear previous bars

    expenses.forEach(exp => {
        let barHeight = (exp.amount / total) * 100; // Scale bar height
        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${barHeight}%`;
        bar.style.background = categoryColors[exp.category.toLowerCase()] || "#ccc"; // Assign color
        bar.setAttribute("data-amount", `$${exp.amount}`);
        bar.innerHTML = `<small>${exp.category}</small>`;
        barChart.appendChild(bar);
    });

    // Update total amount
}

// Call function initially
updateBarChart();




// making the filter function work

let filterValue = document.querySelector('.filter-by-category');

filterValue.addEventListener('change' , ()=>{
    let selected_category_value = filterValue.value;
    let expenses = document.querySelectorAll('.expense-card');

    expenses.forEach((expense) => {
        if(expense.getAttribute('data-category')===selected_category_value) expense.style.display = "block";
        else expense.style.display = "none";
    })
})


let removeFilter = document.querySelector('.remove_filter').onclick = (()=>{
    let expenses = document.querySelectorAll('.expense-card');
    expenses.forEach((expense) => {
         expense.style.display = "block";
    })
})






// changing currency works

const apiKey = "22ea93f4d90ebbe0698765f9"; 
const API_URL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

let currencySelect = document.querySelector('.currency-select');

async function addCurrenciesInSelect() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const currencies = Object.keys(data.conversion_rates);

        
        currencies.forEach(currency => {
            let option1 = document.createElement("option");
            option1.value = currency;
            option1.textContent = currency;
          
            currencySelect.appendChild(option1);
        });

        // Set default values
        
    } catch (error) {
        console.error("Error loading currencies:", error);
        alert("Failed to load currency list. Try again later.");
    }
}


addCurrenciesInSelect();



currencySelect.addEventListener('change' , async ()=>{
    let amounts = document.querySelectorAll('.amount');

    // console.log(currencySelect.value);
    try{
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/INR`);
        const data = await response.json();

        // if(data.conversion_rates[currencySelect.value]){
        //    cons
        // }
        console.log(data.conversion_rates)
    }
    catch(error){
        console.error("Error changing currency:", error);
    }
});





